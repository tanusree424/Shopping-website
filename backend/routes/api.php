<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\userController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post("/signup",[AuthController::class,"signup"]);
Route::post("/admin/signup",[AuthController::class,"Adminsignup"]);
Route::post("/login",[AuthController::class,"login"]);
 
Route::middleware('auth:sanctum')->prefix("admin")->group(function () {
 //Auth Routes
  Route::get("/logout", [AuthController::class,"logout"]);
  Route::get("/me", [AuthController::class,"me"]);
  // Permission Management Routes
  Route::apiResource("/permissions",PermissionController::class);
  // Role Management Routes
  Route::apiResource("/roles",RoleController::class);  
  Route::post("/{role}/assign-permission",[RoleController::class,"AssignPermissions"]);
  Route::post("/{role}/remove-permission",[RoleController::class,"RemovePermissions"]);
  // User Management Routes
  Route::get("/users", [userController::class, "users"]);
  Route::put("/users/{id}", [userController::class, "editUser"]);
    Route::delete("/users/{id}", [userController::class, "deleteUser"]);
  Route::post("/users/{user}/roles" , [userController::class, "assignRoles"]);
});

