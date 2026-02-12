<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      
        $categories = Category::all();
        return response()->json($categories);
    }

    public function fetchParentCategories()
    {
        $categories = Category::with('children')
        ->whereNull('parent_id')
        ->orderBy('name')
        ->get();

    return response()->json([
        'status' => true,
        'data' => $categories
    ]);
    }
     public function fetchAllCategories()
    {
        $categories = Category::with('children')
        ->whereNotNull('parent_id')
        ->orderBy('name')
        ->get();

    return response()->json([
        'status' => true,
        'categories' => $categories
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
      public function store(Request $request)
{
    // Authorization check
    if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermission("create categories")) {
        return response()->json(["message" => "Unauthorized"], 403);
    }

    // Validation
    $validated = $request->validate([
        "name"        => "required|string",
        "slug"        => "required|string|unique:categories,slug",
        "description" => "nullable|string",
        "parent_id"   => "nullable|integer|exists:categories,id",
        "category_image" => "nullable|image|mimes:jpg,png,jpeg|max:2048",
        "category_image_public_id"=>"nullable|string"
    ]);

    // Handle image upload
    if ($request->hasFile("category_image")) {
        $categories_imageName = $request->file("category_image");

        $upload = Cloudinary::upload(
            $categories_imageName->getRealPath(),
            ["folder" => "categories"]
        );

        // Save both secure URL and public_id
        $validated["category_image"] = $upload->getSecurePath();
        $validated["category_image_public_id"] = $upload->getPublicId();
    }

    // Create category
    $category = Category::create($validated);

    return response()->json([
        "message"  => "Category created successfully",
        "category" => $category
    ], 201);
}
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermission("view categories")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(["message"=>"Category not found"],404);
        }
        return response()->json(["category"=>$category],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermission("update categories")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(["message"=>"Category not found"],404);
        }

        $validated = $request->validate([
            "name"=>"nullable|string",
            "slug"=>"nullable|string",
            "description"=>"nullable|string",
            "parent_id" => "nullable|integer|exists:categories,id",
            "category_image"=> "nullable|image|mimes:jpg,png,jpeg",
            "category_image_public_id"=>"nullable|string"

        ]);
        if ($request->hasFile("category_image")) {
    // পুরনো image delete করো যদি থাকে
                if ($category->category_image_public_id) {
                    Cloudinary::destroy($category->category_image_public_id);
                }

                $categories_imageName = $request->file("category_image");
                $upload = Cloudinary::upload(
                    $categories_imageName->getRealPath(),
                    ["folder" => "categories"]
                );

                // DB তে secure URL + public_id দুটোই সেভ করো
                $validated["category_image"] = $upload->getSecurePath();
                $validated["category_image_public_id"] = $upload->getPublicId();
}

        $category->update([
            "name"=>$validated["name"] ?? $category->name,
            "slug"=>$validated["slug"] ?? $category->slug,
            "description"=>$validated["description"] ?? $category->description,
            "parent_id"=>$validated["parent_id"] ?? $category->parent_id,
            "category_image"=> $validated["category_image"] ?? $category->category_image

        ]);

        return response()->json(["message"=>"Category updated successfully","category"=>$category],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermission("delete categories")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(["message"=>"Category not found"],404);
        }

        $category->delete();

        return response()->json(["message"=>"Category deleted successfully"],200);
    }

   public function fetchCategoryWiseProducts(string $slug)
{
    if (!$slug) {
        return response()->json(["message" => "Slug not found"], 404);
    }

    // Only fetch categories that match slug AND have a parent_id
   $category_products = Category::where("slug", $slug)
    ->whereNotNull("parent_id")   // optional filter
    ->with("products.images")
    ->first();

if (!$category_products) {
    return response()->json(["message" => "Category not found"], 404);
}

return response()->json($category_products);

}
}
