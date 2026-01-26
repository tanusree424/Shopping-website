<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
class userController extends Controller
{
    public function users()
    {
        $users = User::all()->map(function ($user)
        {
            return [
    'id' => $user->id,
    'name' => $user->name,
    'email' => $user->email,
    'roles' => $user->roles->pluck("name")->toArray(),
    'created_at' => $user->created_at->toIso8601String()

            ];

        });
        return response()->json($users);
    }

public function assignRoles(Request $request, User $user)
{
   $request->validate([
    'roles' => ['required', 'array', 'min:1'],
    'roles.*' => function ($attribute, $value, $fail) {
        if (!Role::where('name', $value)
            ->where('guard_name', 'sanctum')
            ->exists()) {
            $fail("The role {$value} does not exist for guard sanctum.");
        }
    }
]);


    $user->syncRoles($request->roles); // Spatie নিজেই validate করবে

    return response()->json([
        'message' => 'Roles updated',
        'user' => $user->load('roles')
    ]);
}


public function editUser(string $id, Request $request)
{
    $user = auth()->user();
    if (!$user->hasRole("Admin")) {
        return response()->json(["message" => "Unauthorized"], 403);
    }

    if (!$id) {
        return response()->json(["message" => "ID is required"], 400);
    }

    $user = User::find($id);
    if (!$user) {
        return response()->json(["message" => "User not found"], 404);
    }

    $validated = $request->validate([
        "name"  => "nullable|string|max:255",
        "email" => "nullable|email|unique:users,email,".$id,
        "password"=>"nullable|",

    ]);
$user->update([
  "name" => $request->name ?? $user->name,
  "email" => $request->email ?? $user->email,
  "password"=> $request->password ? \Hash::make($validated["password"]) : $user->password
]);

   

    return response()->json([
        "message" => "User Updated Successfully",
        "user"    => $user
    ]);
}


public function deleteUser(string $id)
{
    $user = auth()->user();
    if (!$user->hasRole("Admin")) {
        return response()->json(["message" => "Unauthorized"], 403);
    }
    if (!$id) {
        return response()->json(["message" => "ID is required"], 400);
    }

    $user = User::find($id);
    if (!$user) {
        return response()->json(["message" => "User not found"], 404);
    }
    $user->delete();
     return response()->json([
        "message" => "User deleted Successfully",
        "user"    => $user
    ]);
}
    
}
