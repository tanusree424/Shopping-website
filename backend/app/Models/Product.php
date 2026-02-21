<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Cart;
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','slug','price','description','short_desc',
        'discount_price','sku','category_id','brand_id','stock'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    // Product-level images
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    // Variants
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // If you want direct access to variant images through product
    public function variantImages()
    {
        return $this->hasManyThrough(
            ProductVariantImage::class,
            ProductVariant::class,
            'product_id',        // Foreign key on ProductVariant
            'product_variant_id',// Foreign key on ProductVariantImage
            'id',                // Local key on Product
            'id'                 // Local key on ProductVariant
        );
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}

    

