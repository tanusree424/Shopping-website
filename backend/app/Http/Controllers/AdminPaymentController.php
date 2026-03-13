<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
class AdminPaymentController extends Controller
{
    public function allPayments()
    {
        $payments = Payment::with('user', 'order.order_items.product', 'order.order_items.product.variants.images')->orderBy("created_at", "desc")->get();
        return response()->json($payments);
    }
   public function paymentOrder($id)
{
    $payment = Payment::with([
        'user',
        'order.order_items.product',
        'order.order_items.product.variants.images'
    ])->find($id);

    if(!$payment){
        return response()->json([
            "message" => "Payment not found"
        ],404);
    }

    return response()->json($payment);
}
}
