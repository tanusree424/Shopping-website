<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\userController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
 use App\Http\Controllers\CategoryController;
 use App\Http\Controllers\BrandController;
 use App\Http\Controllers\AdminProductController;
 use App\Http\Controllers\ProductController;
 use App\Http\Controllers\BannerController;
 use App\Http\Controllers\CartController;
 use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
 
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

// Public Routes
  Route::get('/parent-categories', [CategoryController::class, "fetchParentCategories"]);
  Route::get("/categories", [CategoryController::class ,"fetchAllCategories"]);
  Route::get("/categories/{slug}", [CategoryController::class,"getProductsBySlug"]);
  Route::get("/product/{slug}", [ProductController::class,"product"]);
  Route::get("/similar-product/{slug}", [ProductController::class,'fetchSimilarProducts']);
  Route::get("/products",[ProductController::class,'fetchAllProducts']);
  Route::get("/filter-products",[ProductController::class,'index']);
  Route::get("/featured",[ProductController::class,"featuredProducts"]);
  Route::get("/recent",[ProductController::class, "reacentProducts"]);
  Route::get("/brands",[BrandController::class ,"index"]);
  Route::get("/brands/{slug}",[BrandController::class,"BrandWiseProduct"]);
  Route::get("/banners",[BannerController::class ,"index"]);

Route::get('/cloudinary-test', function () {
    return Cloudinary::getConfiguration();
});


Route::middleware("auth:sanctum")->group(function(){
  Route::post("/add-to-cart",[CartController::class,"addedToCart"]);
   Route::get("/logout", [AuthController::class,"userLogout"]);
  Route::get("/cartlist",[CartController::class, "cartList"]);
  Route::put("/increase-quantity/{id}",[CartController::class,'updateIncreaseQuantity']);
  Route::put("/decrease-quantity/{id}",[CartController::class,'updateDecreaseQuantity']);
});
Route::middleware('auth:sanctum')->prefix("admin")->group(function () {
 //Auth Routes
  Route::get("/logout", [AuthController::class,"adminLogout"]);
  Route::get("/me", [AuthController::class,"me"]);
  // Permission Management Routes
  Route::apiResource("/permissions",PermissionController::class);
  // Role Management Routes
  Route::apiResource("/roles",RoleController::class);  
  Route::post("/{role}/assign-permission",[RoleController::class,"AssignPermissions"]);
  Route::post("/{role}/remove-permission",[RoleController::class,"RemovePermissions"]);
  // Category Management Routes
 Route::apiResource('categories', CategoryController::class);

 // Brand Management Routes
  Route::apiResource('brands', BrandController::class);

  // Product Management
  Route::apiResource("products", AdminProductController::class);
  Route::post("/is_featured/{productId}", [AdminProductController::class , "isFeatured"]);

  // User Management Routes
  Route::get("/users", [userController::class, "users"]);
  Route::put("/users/{id}", [userController::class, "editUser"]);
    Route::delete("/users/{id}", [userController::class, "deleteUser"]);
  Route::post("/users/{user}/roles" , [userController::class, "assignRoles"]);

  // website baanner route

  Route::get("/banners",[BannerController::class ,"index"]);
  Route::post("/banners",[BannerController::class,"store"]);
  Route::put("/banners/{id}",[BannerController::class,"update"]);
  Route::delete("/banners/{id}",[BannerController::class,"destroy"]);
});

