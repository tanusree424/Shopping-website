<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::all();
        return response()->json(["roles"=>$roles->load("permissions")],200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name"=>"required|unique:roles,name",
        ]);

        $role = Role::create([
            "name"=>$validated["name"],
            "guard_name"=>"sanctum",
            "createdAt"=>\Carbon\Carbon::now()->toISO8601String(),
            "updatedAt"=>\Carbon\Carbon::now()->toISO8601String(),
        ]);

        return response()->json(["message"=>"Role Created Successfully","role"=>$role],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function AssignPermissions(Request $request, Role $role)
{
    $validated = $request->validate([
        'permissions_name' => 'required|array|min:1',
        'permissions_name.*' => 'exists:permissions,name',
    ]);

    $permissions = Permission::whereIn('name', $validated['permissions_name'])
        ->where('guard_name', $role->guard_name)
        ->pluck('name')
        ->toArray();

    $role->givePermissionTo($permissions);

    return response()->json([
        'message' => 'Permissions synced successfully',
        'role' => $role->load('permissions')
    ]);
}



    public function removePermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            "permissions_name" => "required|array|min:1",
            "permissions_name.*" => "required|string|exists:permissions,name",
        ]);
        if (!$role) {
            return response()->json(["message" => "Role not found"], 404);
        }
        $permissions = Permission::whereIn("name", $validated["permissions_name"])->where("guard_name", $role->guard_name)->pluck("name")->toArray();
        $role->revokePermissionTo($permissions);
        return response()->json(["message" => "Permissions removed successfully"], 200);
    }

     

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (!$role = Role::findById($id, 'sanctum')) {
            return response()->json(["message" => "Role not found"], 404);
        }
        $validated = $request->validate([
            "name"=>"required|unique:roles,name,".$role->id,
        ]);
        $role->name = $validated["name"];
        $role->updated_at = \Carbon\Carbon::now()->toISO8601String();
        $role->save();
        return response()->json(["message"=>"Role updated successfully","role"=>$role],200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
{
    // Spatie role exists check (guard সহ)
    $role = Role::findById($role->id, 'sanctum');

    if (!$role) {
        return response()->json([
            'message' => 'Role not found'
        ], 404);
    }

    DB::beginTransaction();

    try {
        // pivot tables delete
        DB::table('model_has_roles')->where('role_id', $role->id)->delete();
        DB::table('role_has_permissions')->where('role_id', $role->id)->delete();

        // main role delete
        DB::table('roles')->where('id', $role->id)->delete();
        DB::commit();

        return response()->json([
            'message' => 'Role deleted successfully'
        ], 200);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Delete failed',
            'error' => $e->getMessage()
        ], 500);
    }
}
}