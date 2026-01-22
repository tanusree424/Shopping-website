<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
class RoleController extends Controller
{
    public function AddRoles(Request $request)
    {
        $validated = $request->validate(["name"=>"required|string|max:50|unique:roles,name", "guard_name"=>"required|string|max:50"]);

        $role =  Role::create($validated);
        return response()->json(["message"=>"Role Created Successfully","role"=>$role],201);
    }

    public function AllRoles()
    {
        $roles = Role::all();
        return response()->json(["roles"=>$roles],201);
    }
}
