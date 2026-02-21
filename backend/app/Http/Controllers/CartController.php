<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
class CartController extends Controller
{
   public function addedToCart(Request $request)
{
    $authUser = auth()->user();   // Correct way

    if (!$authUser) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $validated = $request->validate([
        "product_id" => "required|exists:products,id",
        "quantity"   => "required|integer|min:1"
    ]);

    $product = Product::findOrFail($validated["product_id"]);

    // Check if cart already exists for this user + product
    $cartExists = Cart::where("user_id", $authUser->id)
                      ->where("product_id", $validated["product_id"])
                      ->first();

    if ($cartExists) {

        $cartExists->quantity += $validated["quantity"];
        $cartExists->save();

        return response()->json([
            "message" => "Cart quantity updated"
        ]);
    }

    // Create new cart item
    Cart::create([
        "user_id"    => $authUser->id,
        "product_id" => $validated["product_id"],
        "quantity"   => $validated["quantity"],
        "price"      => $product->price
    ]);

    return response()->json([
        "message" => "Product added to cart"
    ]);
}

public function cartList()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }
  
    $cartItems = Cart::where('user_id', $user->id)
                    ->with('product.images')
                    ->get();

    return response()->json($cartItems);
}

public function updateIncreaseQuantity(Request $request, $id)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $cartItem = Cart::where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

    if (!$cartItem) {
        return response()->json([
            "message" => "Cart item not found"
        ], 404);
    }

    $cartItem->quantity += 1;
    $cartItem->save();

    return response()->json([
        "message" => "Quantity Increased",
        "cart" => $cartItem
    ]);
}


public function updateDecreaseQuantity(Request $request, $id)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $cartItem = Cart::where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

    if (!$cartItem) {
        return response()->json([
            "message" => "Cart item not found"
        ], 404);
    }

    $cartItem->quantity -= 1;
    $cartItem->save();

    return response()->json([
        "message" => "Quantity Increased",
        "cart" => $cartItem
    ]);
}

}
