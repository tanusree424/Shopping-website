<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('order_items.product.images','user' )->latest("created_at")->get();
        return response()->json([
            "orders"=>$orders
        ]);
    }

    public function viewOrderDeatils(string $id)
{
    $orders = Order::with("order_items.product.images", "order_items.product.variants.images", 'user')
                    ->find($id);

    return response()->json($orders);
}

public function changeOrderStatus(string $id , Request $request)
{
    $request->validate([
        "status"=>"required|string|"
    ]);
     $order = Order::find($id);
     if (!$order) {
       return response()->json(["message"=>"Order Not Found"],404);
     }
     $order->update([
        "order_status"=> $request->status
     ]);
     return response()->json([
        "message" => "Order Status Updated Successfully",
        "order" => $order
    ]);
}
public function deleteOrder(string $id)
{
    $order = Order::find($id);

    if (!$order) {
        return response()->json([
            "message" => "Order Not Found"
        ],404);
    }

    // first delete payments
    $order->payments()->delete();

    // then delete order
    $order->delete();

    return response()->json([
        "message" => "Order deleted Successfully"
    ],200);
}


}
