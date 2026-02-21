<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::latest()->get();
        return response()->json($banners);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'link' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'nullable|boolean'
        ]);

        if ($request->hasFile('image')) {

            $upload = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ["folder" => "banners"]
            );

            $validated['image'] = $upload->getSecurePath();
        }

        $banner = Banner::create($validated);

        return response()->json([
            'message' => 'Banner created successfully',
            'data' => $banner
        ], 201);
    }

    // ✅ UPDATE METHOD
    public function update(Request $request, string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'link' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'nullable|boolean'
        ]);

        // 🔥 যদি নতুন image আসে
        if ($request->hasFile('image')) {

            // পুরোনো image delete
            if ($banner->image) {
                $urlParts = explode('/', $banner->image);
                $fileNameWithExtension = end($urlParts);
                $fileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);
                $publicId = 'banners/' . $fileName;

                Cloudinary::destroy($publicId);
            }

            // নতুন image upload
            $upload = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ["folder" => "banners"]
            );

            $validated['image'] = $upload->getSecurePath();
        }

        $banner->update($validated);

        return response()->json([
            'message' => 'Banner updated successfully',
            'data' => $banner
        ]);
    }

    // ✅ DESTROY METHOD
    public function destroy(string $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner not found'], 404);
        }

        // 🔥 Cloudinary image delete
        if ($banner->image) {
            $urlParts = explode('/', $banner->image);
            $fileNameWithExtension = end($urlParts);
            $fileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);
            $publicId = 'banners/' . $fileName;

            Cloudinary::destroy($publicId);
        }

        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully'
        ]);
    }

   
}
