<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Order_item;
use App\Models\Cart;
use App\Models\Payment;
use Razorpay\Api\Api;
use App\Models\OrderTracking;
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
            ->lockForUpdate() // prevent race condition
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

        // ================= CREATE ORDER ITEMS + STOCK CHECK =================
        foreach ($cartItems as $item) {

            if ($item->product->stock < $item->quantity) {
                throw new \Exception("Insufficient stock for " . $item->product->name);
            }

            Order_item::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'total' => $item->price * $item->quantity,
            ]);

            // Stock minus
            $item->product->decrement('stock', $item->quantity);
        }

        // ================= CREATE PAYMENT =================
        $payment = Payment::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'payment_method' => $request->payment_method,
            'amount' => $grandTotal,
            'payment_status' => 'pending',
            'transaction_id' => $request->payment_method === "Cash On Delivery"
                ? "TXN-" . strtoupper(uniqid())
                : null,
        ]);

        // ================= CREATE ORDER TRACKING =================
        OrderTracking::create([
            'order_id' => $order->id,
            'status' => 'Order Placed',
            'description' => 'Your order has been placed successfully.',
            'created_at' => now()
        ]);

        // ================= CLEAR CART =================
        Cart::whereIn('id', $request->cart_ids)
            ->where('user_id', $user->id)
            ->delete();

        // ================= ONLINE PAYMENT =================
        if ($request->payment_method !== "Cash On Delivery") {

            $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

            $razorpayOrder = $api->order->create([
                'receipt' => $order->order_number,
                'amount' => $grandTotal * 100,
                'currency' => 'INR'
            ]);

            DB::commit();

            return response()->json([
                "order_id" => $order->id,
                "razorpay_order_id" => $razorpayOrder['id'],
                "amount" => $grandTotal
            ]);
        }

        // ================= COD CASE =================
        $order->update(['order_status' => 'confirmed']);
        $payment->update(['payment_status' => 'paid']);

        OrderTracking::create([
            'order_id' => $order->id,
            'status' => 'Confirmed',
            'description' => 'Order confirmed. It will be shipped soon.',
        ]);

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

    public function getUserOrders()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                "message" => "Unauthorized"
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['order_items.product.images', 'order_items.product.variants.images', 'payment'])
            ->orderBy('ordered_at', 'desc')
            ->get();

        return response()->json([
            "orders" => $orders
        ], 200);
    }
public function verifyPayment(Request $request)
{
    $api = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));

    $payment = $api->payment->fetch($request->razorpay_payment_id);

    $order = Order::find($request->order_id);

    $order->payment->update([
        'payment_status' => 'paid',
        'transaction_id' => $payment['id'],
        'payment_method' => $payment['method']  // 🔥 এখানে method আসবে
    ]);

    $order->update([
        'order_status' => 'confirmed'
    ]);

    return response()->json([
        "message" => "Payment Verified"
    ]);
}

public function getOrderDetails($id)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            "message" => "Unauthorized"
        ], 401);
    }

    $order = Order::where('id', $id)
        ->where('user_id', $user->id)
        ->with(['order_items.product.images', 'order_items.product.variants.images', 'payment', 'tracking'])
        ->first();

    if (!$order) {
        return response()->json([
            "message" => "Order not found"
        ], 404);
    }

    return response()->json([
        "order" => $order
    ], 200);

}
}