<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
class ProductController extends Controller
{
public function index(Request $request)
{
    $query = Product::with([
        'images', // product-level images
        'variants.images' => function ($q) { 
            // no need to filter here, just eager load
        }
    ]);

    // Price filter
    if ($request->filled(['min_price', 'max_price'])) {
        $query->whereBetween('discount_price', [
            $request->min_price,
            $request->max_price
        ]);
    }

    // Variant filters (color + size live in product_variants)
    if ($request->color || $request->size) {
        $query->whereHas('variants', function ($q) use ($request) {
            if ($request->color) {
                $q->where('color', $request->color);
            }
            if ($request->size) {
                $q->where('size', $request->size);
            }
        });
    }

    return $query->paginate(5);
}

    public function product(string $slug)
    {
        if (!$slug) {
            return response()->json(["message"=>"Slug Must be required"],400);
        }

        $product  =  Product::where("slug", $slug)->with("category", "brand" ,"images" , 'variants' , 'variantImages')->orderBy("created_at","ASC")->first();
        if (!$product) {
            return response()->json(["message"=>"Product not foung"],404);
        }

        return response()->json($product);
    }

    public function fetchSimilarProducts(string $slug)
    {
        if (!$slug) {
            return response()->json(["message"=>"Slug Must be required"],400);
        }
        $product = Product::where("slug", $slug)
        ->with([
            "category",
            "brand",
            "images",   // product-level images
            "variants.images", // variant images via variants
            "variantImages"    // all variant images directly
        ])
        ->orderBy("created_at", "ASC")
        ->first();

         if (!$product) {
            return response()->json(["message"=>"Product not foung"],404);
        }
       $similarProducts = Product::where("category_id", $product->category_id)
    ->where("id", "!=", $product->id)
    ->with("category","brand","images")
    ->take(4)
    ->get();
        return response()->json([
            "product" => $product,
            "similar_products" => $similarProducts
        ]);

    }

    public function fetchAllProducts()
    {
        $products = Product::with('images','category', 'brand','variants.images')->paginate(5);
        return response()->json($products);
    }

    public function featuredProducts()
    {
        $product = Product::where("is_featured" , true )->with('category','brand','images')->get();

        return response()->json($product);
    }

   public function reacentProducts()
{
    $products = Product::with('category', 'brand', 'images')
        ->orderBy('created_at', 'desc')->limit(4)
        ->get();

    return response()->json($products);
}
}

