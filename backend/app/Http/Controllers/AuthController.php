<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
   public function signup(Request $request)
{
    $validated = $request->validate([
        "name" => "required|string|max:50",
        "email" => "required|email|max:50|unique:users,email",
        "password" => "required|min:3|confirmed"
    ]);

    $validated["password"] = \Hash::make($validated["password"]);
    \Log::info("Creating user with data: ", $validated);

    $user = User::create($validated);
   

    // 🔥 EXACT role name from DB
   // $user->assignRole("user");

    return response()->json([
        "message" => "User created successfully",
        "user" => $user->load("roles")
    ], 201);
}

    public function Adminsignup(Request $request)
    {
        $validated  = $request->validate([
        "name"=>"required|string|max:50",
        "email"=>"required|email|string|max:50|unique:users,email",
        "password"=>"required|min:3|confirmed",
        // "roles"=>"required|string|in:admin"
        ]);
        $existingEmail = User::where("email", $validated["email"])->first();
        if ($existingEmail) {
            return response()->json(["message"=>"Email Already Exists"],400);
        }

        $validated["password"] = \Hash::make($validated["password"]);

        $user = User::create($validated);
        $user->assignRole("Admin");

        return response()->json(["message"=>"Admin Created Successfully", "user"=>$user->load("roles")],201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            "email"=>"required|exists:users,email",
            "password"=>"required"
        ]);
        $user = User::where("email", $validated["email"])->first();

        if (!$user || ! \Hash::check($validated["password"], $user->password) ) {
              return response()->json([
                "message"=>"Invalid Credenatials",
                
              ]);
        }
        $token = $user->createToken("auth_token")->plainTextToken;
        return response()->json(["message"=>"LoggedIN Successfully", "user"=>$user->load("roles"), "token"=>$token],200);

    }

    public function adminLogout(Request $request)
{
    $user = $request->user();

    if ($user && $user->hasRole("Admin")) {
        $user->currentAccessToken()->delete();

        return response()->json([
            "message" => "Admin Logged Out Successfully"
        ], 200);
    }

    return response()->json([
        "message" => "Unauthorized - Only Admin can logout here"
    ], 403);
}

    public function userLogout(Request $request)
{
    $user = $request->user();

    if ($user && $user->hasRole("User")) {
        $user->currentAccessToken()->delete();

        return response()->json([
            "message" => "User Logged Out Successfully"
        ], 200);
    }

    return response()->json([
        "message" => "Unauthorized - Only User can logout here"
    ], 403);
}

    public function me(Request $request){
       $user = auth()->user();
       if ($user && $user->hasRole("Admin")) {
        return response()->json(["message"=>"You Are Admin","user"=>$user->load("roles"), "status"=>true],200);
       }
       return response()->json(["message"=>"You are not authenticated to access this page"]);
    }
}
