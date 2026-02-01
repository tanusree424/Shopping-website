<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Models\ProductImage;
class AdminProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $products = Product::with(["brand", "category", "images"])
        ->orderBy("created_at", "asc")
        ->get();

    return response()->json([
        "products" => $products
    ]);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        "name"           => "required|string|max:100",
        "slug"           => "required|string|unique:products,slug",
        "price"          => "required|numeric",
        "description"    => "nullable|string",
        "short_desc"     => "nullable|string",
        "discount_price" => "nullable|numeric",
        "sku"            => "nullable|string",
        "category_id"    => "nullable|exists:categories,id",
        "brand_id"       => "nullable|exists:brands,id",
        "stock"          => "nullable|integer|min:0",
        "images"         => "nullable|array|min:1",
        "images.*"       => "nullable|image|mimes:jpg,png,jpeg|max:2048"
    ]);

    $product = Product::create($request->only([
        "name","slug","price","discount_price",
        "description","short_desc","sku",
        "category_id","brand_id" ,"stock"
    ]));

    if ($request->hasFile("images")) {
        foreach ($request->file("images") as $image) {
            \Log::info($request->file('images'));
            $upload = Cloudinary::upload(
                $image->getRealPath(),
               // $public_id = $image->getPublicId(),
                ["folder" => "products"]
            );

            ProductImage::create([
                "product_id" => $product->id,
                "image"      => $upload->getSecurePath()

            ]);
        }
    }

    return response()->json([
        "product" => $product->load("images")
    ]);
}
public function update(Request $request, $id)
{
        $product = Product::find($id);
        if (!$product) {
            return response()->json(["message" => "Product Not Found"], 404);
        }

        $request->validate([
            "name"           => "nullable|string|max:100",
            "slug"           => "nullable|string",
            "price"          => "nullable|numeric",
            "description"    => "nullable|string",
            "short_desc"     => "nullable|string",
            "discount_price" => "nullable|numeric",
            "sku"            => "nullable|string",
            "category_id"    => "nullable|exists:categories,id",
            "stock"          => "nullable|integer|min:0",
            "brand_id"       => "nullable|exists:brands,id",
            "images"         => "nullable|array",
            "images.*"       => "nullable|image|mimes:jpg,png,jpeg|max:2048"
        ]);

    // Update basic fields
      $product->update($request->only([
    'name','slug','price','description','short_desc',
    'discount_price','sku','category_id','brand_id','stock'
]));
$product->stock = (int) $request->stock;
$product->save();
    // Replace images if new ones are uploaded
        if ($request->hasFile('images')) {
            // Delete old images from Cloudinary
            foreach ($product->images as $oldImage) {
               // Cloudinary::destroy($oldImage->public_id); // assuming public_id is stored
                $oldImage->delete();
            }

            // Upload new images
            foreach ($request->file('images') as $image) {
                $uploaded = Cloudinary::upload($image->getRealPath())->getSecurePath();
               // $publicId = Cloudinary::upload($image->getRealPath())->getPublicId();

                $product->images()->create([
                    'url' => $uploaded,
                    'public_id' => $publicId
                ]);
            }
        }

         return response()->json(["message" => "Product updated successfully" , "product"=>$product],200);
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        if (!$product) {
            return response()->json(["message" => "Product Not Found"], 404);
        }
        $product->delete();
        return response()->json(["message"=>"Product Deleted Successfully", "product"=>$product],200);
    }
}
