<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\ProductVariantImage;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id','color','size','stock','price'
    ];

    public function images()
    {
        return $this->hasMany(ProductVariantImage::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}



