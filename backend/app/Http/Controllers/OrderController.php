<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
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
                ->with('product.images')
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
            $total = $subtotal + $shipping;

            // ================= CREATE ORDER =================
            $order = Order::create([
                'user_id' => $user->id,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'status' => 'pending',
                'billing_details' => json_encode($request->billing),
            ]);

            // ================= CREATE ORDER ITEMS =================
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ]);
            }

            // ================= CREATE PAYMENT =================
            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'amount' => $total,
                'status' => 'pending',
            ]);

            // ================= CLEAR CART =================
            Cart::whereIn('id', $request->cart_ids)
                ->where('user_id', $user->id)
                ->delete();

            DB::commit();

            return response()->json([
                "message" => "Order placed successfully",
                "order_id" => $order->id
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                "message" => "Something went wrong",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}