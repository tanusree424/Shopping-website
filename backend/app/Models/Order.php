<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order_item;
use App\Models\User;
use App\Models\Payment;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal',
        'shipping_charges',
        'tax',
        'discount',
        'grand_total',
        'order_status',
        'ordered_at'
    ];

    public function order_items()
    {
        return $this->hasMany(Order_item::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
