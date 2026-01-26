<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        if (!$user->hasRole('Admin')) {
            return response()->json(["message"=>"Unauthorized"],403);
        }
       $permissions = Permission::all();
       return response()->json(["permissions"=>$permissions],200); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->hasRole('Admin')) {
            return response()->json(["message"=>"Unauthorized"],403);
        }

        $validated = $request->validate([
            "name" => "required|string|unique:permissions"

        ]);

        $permission = Permission::create([
            "name"=>$validated["name"],
            "guard_name"=>"sanctum",
            "created_at"=>\Carbon\Carbon::now()->toISO8601String(),
            "updated_at"=>\Carbon\Carbon::now()->toISO8601String(),
        ]);
        return response()->json(["message"=>"Permission created successfully","permission"=>$permission],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        if (!auth()->user()->hasRole("Admin")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }
        $permission = Permission::findById($id);
        if (!$permission) {
            return response()->json(["message"=>"Permission not found"],404);
        }
        return response()->json(["permission"=>$permission],200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (!auth()->user()->hasRole("Admin")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }
        $permission = Permission::findById($id);
        if (!$permission) {
            return response()->json(["message"=>"Permission not found"],404);
        }

        $validated = $request->validate([
            "name" => "required|string|unique:permissions,name,".$permission->id,
        ]);

        $permission->name = $validated["name"];
        $permission->updated_at = \Carbon\Carbon::now()->toISO8601String();
        $permission->save();

        return response()->json(["message"=>"Permission updated successfully","permission"=>$permission],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (!auth()->user()->hasRole("Admin")) {
            return response()->json(["message"=>"Unauthorized"],403);
        }
       DB::table("role_has_permissions")->where("permission_id",$id)->delete();
       $permission = DB::table("permissions")->where("id",$id)->first();
       if (!$permission) {
        return response()->json(["message"=>"Permission not found"],404);
       }
         DB::table("permissions")->where("id",$id)->delete();
         return response()->json(["message"=>"Permission deleted successfully"],200);

}
}
