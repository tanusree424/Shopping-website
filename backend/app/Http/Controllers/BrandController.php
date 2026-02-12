<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Brand;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
            $brands = Brand::all();
            return response()->json([
                "message"=>"AllBrands",
                "brands"=>$brands
            ]);
        
        return response()->json(["message"=>"Unauthorized"],403);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (auth()->user()->hasRole("Admin") ) {
            $validated = $request->validate([
                "name"=>"required|string|unique:brands,name",
                "slug"=>"required|string|unique:brands,slug",
                "country"=>"nullable|string",
                "description"=>"nullable|string",
                "website"=>"nullable|url",
                "logo"=>"nullable|image|max:2048|mimes:jpeg,png,jpg,gif,svg",
                "status"=>"in:active,inactive"
            ]);

            if ($request->hasFile("logo")) {
               $upload = Cloudinary::upload(
                $request->file("logo")->getRealPath(),
                [
                    "folder"=>"brands",
                    "transformation"=>[
                        "width"=>300,
                        "height"=>300,
                        "crop"=>'fill'
                    ]
                ]
               );
               $validated["logo"] = $upload->getSecurePath();
            }

            $brand = Brand::create($validated);

            return response()->json(["message"=>"Brand created successfully","brand"=>$brand],201);
        }
        return response()->json(["message"=>"You are unauthorized"],403);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, string $id)
{
    if (!auth()->user()->hasRole("Admin")) {
        return response()->json(["message" => "Unauthorized"], 403);
    }

    $brand = Brand::find($id);
    if (!$brand) {
        return response()->json(["message" => "Brand not found"], 404);
    }

    $validated = $request->validate([
        "name" => "nullable|string",
        "slug" => "nullable|string",
        "country" => "nullable|string",
        "description" => "nullable|string",
        "website" => "nullable|url",
        "logo" => "nullable|image|max:2048|mimes:jpeg,png,jpg,gif,svg",
        "status" => "in:active,inactive"
    ]);

    // Website only update if filled
    if ($request->filled('website')) {
        $brand->website = $validated['website'];
    }

    // Logo upload
    if ($request->hasFile("logo")) {
        $upload = Cloudinary::upload(
            $request->file("logo")->getRealPath(),
            [
                "folder" => "brands",
                "transformation" => [
                    "width" => 300,
                    "height" => 300,
                    "crop" => "fill"
                ]
            ]
        );

        $brand->logo = $upload->getSecurePath();
    }

    // Other fields
    $brand->update([
        "name" => $validated["name"] ?? $brand->name,
        "slug" => $validated["slug"] ?? $brand->slug,
        "country" => $validated["country"] ?? $brand->country,
        "description" => $validated["description"] ?? $brand->description,
        "status" => $validated["status"] ?? $brand->status,
    ]);

    return response()->json([
        "message" => "Brand updated successfully",
        "brand" => $brand
    ], 200);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!auth()->user()->hasRole("Admin") && !auth()->user()->hasPermissionTo("delete_product")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $brand = Brand::find($id);
        if (!$brand) {
            return response()->json(["message"=>"Brand not found"],404);
        }
        $brand->delete();
        return response()->json(["message"=>"Brand deleted successfully"],200);
    }
}
