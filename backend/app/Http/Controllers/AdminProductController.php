<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class AdminProductController extends Controller
{
    /* ================= INDEX ================= */
    public function index()
    {
        $products = Product::with(["brand", "category", "images", "variants.images"])
            ->orderBy("created_at", "asc")
            ->get();
      
        return response()->json([
            "products" => $products
        ]);
    }

    /* ================= STORE ================= */
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

        "images"         => "nullable|array",
        "images.*"       => "image|mimes:jpg,png,jpeg,avif|max:2048",

        // ✅ Variants
        "variants"                    => "nullable|array",
        "variants.*.color"            => "required|string",
        "variants.*.size"             => "nullable|string",
        "variants.*.stock"            => "required|integer|min:0",
        "variants.*.price"            => "nullable|numeric",

        // ✅ Variant Images
        "variants.*.images"           => "nullable|array",
        "variants.*.images.*"         => "image|mimes:jpg,png,jpeg,avif|max:2048",
    ]);

    /* ================= PRODUCT ================= */
    $product = Product::create($request->only([
        "name","slug","price","discount_price",
        "description","short_desc","sku",
        "category_id","brand_id","stock"
    ]));

    /* ================= PRODUCT IMAGES ================= */
    if ($request->hasFile("images")) {
        foreach ($request->file("images") as $image) {
            $upload = Cloudinary::upload(
                $image->getRealPath(),
                ["folder" => "products"]
            );

            $product->images()->create([
                "image" => $upload->getSecurePath()
            ]);
        }
    }

    /* ================= VARIANTS + VARIANT IMAGES ================= */
    if ($request->has("variants")) {
        foreach ($request->variants as $index => $variantData) {

            // Create Variant
            $variant = $product->variants()->create([
                "color" => $variantData["color"],
                "size"  => $variantData["size"] ?? null,
                "stock" => $variantData["stock"],
                "price" => $variantData["price"] ?? null,
            ]);

            // Variant Images (Color based)
            if (isset($variantData["images"])) {
                foreach ($variantData["images"] as $variantImage) {
                    $upload = Cloudinary::upload(
                        $variantImage->getRealPath(),
                        ["folder" => "product_variants"]
                    );

                    $variant->images()->create([
                        "image" => $upload->getSecurePath()
                    ]);
                }
            }
        }
    }

    return response()->json([
        "message" => "Product created successfully",
        "product" => $product->load([
            "images",
            "variants.images"
        ])
    ], 201);
}


    /* ================= UPDATE ================= */
public function update(Request $request, $id)
{
    $product = Product::with(['variants.images', 'images'])->find($id);

    if (!$product) {
        return response()->json(["message" => "Product not found"], 404);
    }

    $request->validate([
        "name"           => "nullable|string|max:100",
        "price"          => "nullable|numeric",
        "description"    => "nullable|string",
        "short_desc"     => "nullable|string",
        "discount_price" => "nullable|numeric",
        "sku"            => "nullable|string",
        "category_id"    => "nullable|exists:categories,id",
        "brand_id"       => "nullable|exists:brands,id",
        "stock"          => "nullable|integer|min:0",

        "images"         => "nullable|array",
        "images.*"       => "nullable|image|mimes:jpg,jpeg,png|max:2048",

        "variants"           => "nullable|array",
        "variants.*.id"      => "nullable|exists:product_variants,id",
        "variants.*.color"   => "required|string",
        "variants.*.size"    => "nullable|string",
        "variants.*.stock"   => "required|integer|min:0",
        "variants.*.price"   => "nullable|numeric",
        "variants.*.images"  => "nullable|array",
        "variants.*.images.*"=> "nullable|image|mimes:jpg,jpeg,png|max:2048",
    ]);

    DB::beginTransaction();

    try {

        /* ---------- PRODUCT UPDATE ---------- */
        $productData = $request->only([
            "name","price","description","short_desc",
            "discount_price","sku","category_id","brand_id","stock"
        ]);

        // Update slug if name changed
        if ($request->filled('name') && $request->name !== $product->name) {
            $baseSlug = Str::slug($request->name);
            $slug = $baseSlug;
            $count = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug . '-' . $count;
                $count++;
            }
            $productData['slug'] = $slug;
        }

        $product->update($productData);

        /* ---------- PRODUCT IMAGES ---------- */
        if ($request->hasFile("images")) {
            // delete old images
            foreach ($product->images as $img) {
                $img->delete();
            }

            foreach ($request->file("images") as $image) {
                $upload = \Cloudinary::upload($image->getRealPath(), ["folder" => "products"]);
                $product->images()->create([
                    "image" => $upload->getSecurePath()
                ]);
            }
        }

        /* ---------- VARIANTS ---------- */
        if ($request->has("variants")) {

            $incomingIds = collect($request->variants)
                ->pluck('id')
                ->filter()
                ->toArray();

            // delete removed variants
            $product->variants()
                ->whereNotIn('id', $incomingIds)
                ->delete();

            foreach ($request->variants as $variantData) {

                if (isset($variantData['id'])) {
                    // UPDATE EXISTING VARIANT
                    $variant = ProductVariant::find($variantData['id']);
                    $variant->update([
                        "color" => $variantData["color"],
                        "size"  => $variantData["size"] ?? null,
                        "stock" => $variantData["stock"],
                        "price" => $variantData["price"] ?? $product->price,
                    ]);

                    // VARIANT IMAGES
                    if (isset($variantData['images'])) {
                        // Delete old images
                        $variant->images()->delete();

                        foreach ($variantData['images'] as $image) {
                            $upload = \Cloudinary::upload($image->getRealPath(), ["folder" => "products/variants"]);
                            $variant->images()->create([
                                "image" => $upload->getSecurePath()
                            ]);
                        }
                    }

                } else {
                    // CREATE NEW VARIANT
                    $variant = $product->variants()->create([
                        "color" => $variantData["color"],
                        "size"  => $variantData["size"] ?? null,
                        "stock" => $variantData["stock"],
                        "price" => $variantData["price"] ?? $product->price,
                    ]);

                    if (isset($variantData['images'])) {
                        foreach ($variantData['images'] as $image) {
                            $upload = \Cloudinary::upload($image->getRealPath(), ["folder" => "products/variants"]);
                            $variant->images()->create([
                                "image" => $upload->getSecurePath()
                            ]);
                        }
                    }
                }
            }
        }

        DB::commit();

        return response()->json([
            "message" => "Product updated successfully",
            "product" => $product->load(["images", "variants.images"])
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            "message" => "Update failed",
            "error"   => $e->getMessage()
        ], 500);
    }
}




    /* ================= DELETE ================= */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            "message" => "Product Deleted Successfully"
        ], 200);
    }

    /* ================= FEATURED ================= */
    public function isFeatured(Request $request, string $productId)
    {
        $request->validate([
            "is_featured" => "required|boolean"
        ]);

        $product = Product::findOrFail($productId);
        $product->is_featured = $request->is_featured;
        $product->save();

        return response()->json([
            "message" => "Product featured status updated"
        ], 200);
    }
}
