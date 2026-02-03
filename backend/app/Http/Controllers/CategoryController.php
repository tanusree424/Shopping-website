<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
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

    public function fetchAllCategories()
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermission("create categories")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $validated = $request->validate([
            "name"=>"required|string",
            "slug"=>"required|string|unique:categories,slug",
            "description"=>"nullable|string",
            "parent_id"=>"nullable|exists:categories,id",
        ]);

        $category = Category::create($validated);

        return response()->json(["message"=>"Category created successfully","category"=>$category],201);
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
            "parent_id"=>"nullable|exists:categories,id",
        ]);

        $category->update([
            "name"=>$validated["name"] ?? $category->name,
            "slug"=>$validated["slug"] ?? $category->slug,
            "description"=>$validated["description"] ?? $category->description,
            "parent_id"=>$validated["parent_id"] ?? $category->parent_id,

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
}
