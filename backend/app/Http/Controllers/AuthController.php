<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $validated  = $request->validate([
        "name"=>"required|string|max:50",
        "email"=>"required|email|string|max:50|unique:users,email",
        "password"=>"required|min:3|confirmed"
        ]);
        $existingEmail = User::where("email", $validated["email"])->first();
        if ($existingEmail) {
            return response()->json(["message"=>"Email Already Exist"],400);
        }

        $validated["password"] = \Hash::make($validated["password"]);

        $user = User::create($validated);

        return response()->json(["message"=>"User created Successfully", "user"=>$user],201);
    }
    public function Adminsignup(Request $request)
    {
        $validated  = $request->validate([
        "name"=>"required|string|max:50",
        "email"=>"required|email|string|max:50|unique:users,email",
        "password"=>"required|min:3|confirmed",
        "roles"=>"required|string|in:admin"
        ]);
        $existingEmail = User::where("email", $validated["email"])->first();
        if ($existingEmail) {
            return response()->json(["message"=>"Email Already Exists"],400);
        }

        $validated["password"] = \Hash::make($validated["password"]);

        $user = User::create($validated);

        return response()->json(["message"=>"Admin Created Successfully", "user"=>$user],201);
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
        return response()->json(["message"=>"LoggedIN Successfully", "user"=>$user, "token"=>$token],200);

    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response()->json(["message"=>"Logged Out Successfully"],200);
    }
}
