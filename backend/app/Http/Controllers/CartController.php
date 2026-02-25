<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
class CartController extends Controller
{
public function addToCart(Request $request)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    // ✅ Validation
    $validated = $request->validate([
        "product_id" => "nullable",
        "product_variant_id" => "nullable",
        "quantity" => "required|integer|min:1"
    ]);
//     $product = Product::find($request->product_id);

// if (!$product || ($request->product_variant_id && !ProductVariant::find($request->product_variant_id))) {
//     return response()->json([
//         "message" => "Product not found"
//     ], 404);
// }

    // ✅ At least one required
    if (!$request->product_id && !$request->product_variant_id) {
        return response()->json([
            "message" => "Either product_id or product_variant_id is required"
        ], 422);
    }

    // ❌ Both cannot exist together
    if ($request->product_id && $request->product_variant_id) {
        return response()->json([
            "message" => "Send either product_id OR product_variant_id, not both"
        ], 422);
    }

    $price = 0;
    $productId = null;
    $variantId = null;

    // ===============================
    // ✅ If Variant Exists
    // ===============================
    if ($request->product_variant_id) {

        $variant = ProductVariant::with('product')
            ->findOrFail($request->product_variant_id);

        $productId = $variant->product_id;
        $variantId = $variant->id;
        $price = $variant->price ?? $variant->product->price;
    }

    // ===============================
    // ✅ If Normal Product
    // ===============================
    if ($request->product_id) {

        $product = Product::findOrFail($request->product_id);

        $productId = $product->id;
        $price = $product->price;
    }

    // ===============================
    // ✅ Check If Already Exists
    // ===============================
    $cartExists = Cart::where("user_id", $user->id)
        ->where("product_id", $productId)
        ->where("product_variant_id", $variantId)
        ->first();

    if ($cartExists) {
        $cartExists->quantity += $request->quantity;
        $cartExists->save();

        return response()->json([
            "message" => "Cart quantity updated"
        ]);
    }

    // ===============================
    // ✅ Create New Cart Item
    // ===============================
    Cart::create([
        "user_id" => $user->id,
        "product_id" => $productId,
        "product_variant_id" => $variantId,
        "quantity" => $request->quantity,
        "price" => $price
    ]);

    return response()->json([
        "message" => "Product added to cart successfully"
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
        ->with([
            'product.images',
            'variant.images',
            'variant.product'
        ])
        ->get();

    $formattedCart = $cartItems->map(function ($cart) {

        // 🔥 Variant case
        if ($cart->product_variant_id && $cart->variant) {

            return [
                "cart_id" => $cart->id,
                "type" => "variant",
                "product_name" => $cart->variant->product->name,
                "color" => $cart->variant->color,
                "price" => $cart->variant->price,
                "quantity" => $cart->quantity,
                "image" => optional($cart->variant->images->first())->image
            ];
        }

        // 🔥 Normal Product case
        return [
            "cart_id" => $cart->id,
            "type" => "product",
            "product_name" => $cart->product->name,
            "price" => $cart->product->discount_price ?? $cart->product->price,
            "quantity" => $cart->quantity,
            "image" => optional($cart->product->images->first())->image
        ];
    });

    return response()->json($formattedCart);
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

public function deleteCartItem($id)
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

    $cartItem->delete();

    return response()->json([
        "message" => "Cart item deleted"
    ]);

}

public function cartProductCount()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $cartCount = Cart::where('user_id', $user->id)->count();

    return response()->json([
        "cart_count" => $cartCount
    ]);
}

public function cartProductDetails(Request $request)
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    // query string থেকে ids নাও
    $ids = explode(',', $request->ids);

    $cartItems = Cart::whereIn('id', $ids)
        ->where('user_id', $user->id)
        ->with('product.images','variants.images')
        ->get();

    if ($cartItems->isEmpty()) {
        return response()->json([
            "message" => "Cart items not found"
        ], 404);
    }

    return response()->json($cartItems);
}
}

