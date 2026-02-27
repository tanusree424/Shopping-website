<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Order_item;
use App\Models\Cart;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
   public function placeOrder(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $request->validate([
        'cart_ids' => 'required|array',
        'payment_method' => 'required|string',
        'billing' => 'required|array'
    ]);

    DB::beginTransaction();

    try {

        // ================= GET CART ITEMS =================
        $cartItems = Cart::whereIn('id', $request->cart_ids)
            ->where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                "message" => "Cart items not found"
            ], 404);
        }

        // ================= CALCULATE TOTAL =================
        $subtotal = 0;

        foreach ($cartItems as $item) {
            $subtotal += $item->price * $item->quantity;
        }

        $shipping = $subtotal < 1000 ? 50 : 0;
        $tax = $subtotal < 1000 ? $subtotal * 0.05 : 0;
        $discount = $subtotal >= 1000 ? $subtotal * 0.10 : 0;

        $grandTotal = $subtotal + $shipping + $tax - $discount;

        // ================= CREATE ORDER =================
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'subtotal' => $subtotal,
            'shipping_charges' => $shipping,
            'tax' => $tax,
            'discount' => $discount,
            'grand_total' => $grandTotal,
            'order_status' => 'pending',
            'ordered_at' => now(),
            'billing_details' => json_encode($request->billing),
        ]);

        // ================= CREATE ORDER ITEMS =================
        foreach ($cartItems as $item) {
            Order_item::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'price' => $item->price,
                "total" => $item->price * $item->quantity,
                'quantity' => $item->quantity,
            ]);
        }

        // ================= CREATE PAYMENT =================
        Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'payment_method' => $request->payment_method,
            'amount' => $grandTotal,
            'payment_status' => 'pending',
            'transaction_id' => $request->payment_method === "Cash On Delivery"
                ? "TXN-" . strtoupper(uniqid())
                : null,
        ]);

        // ================= CLEAR CART =================
        Cart::whereIn('id', $request->cart_ids)
            ->where('user_id', $user->id)
            ->delete();

        DB::commit();

        return response()->json([
            "message" => "Order placed successfully",
            "order" => $order->load('order_items', 'payment')
        ], 201);

    } catch (\Exception $e) {

        DB::rollBack();
        Log::error("Error placing order: " . $e->getMessage());

        return response()->json([
            "message" => "Something went wrong",
            "error" => $e->getMessage()
        ], 500);
    }
}
}