<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ProductVariant;
use App\ModelS\Product;
class Cart extends Model
{
    use HasFactory;
    protected $fillable = ["product_id","user_id", "quantity","price", "product_variant_id"];

public function product()
{
    return $this->belongsTo(Product::class);
}

public function variants()
{
    return $this->belongsTo(ProductVariant::class, 'product_variant_id');
}
}
