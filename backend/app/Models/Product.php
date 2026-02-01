<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductImage;
class Product extends Model
{
    use HasFactory;
    protected $fillable = ['name','slug','price','description','short_desc',
    'discount_price','sku','category_id','brand_id','stock'];

    public function category()
    {
        return $this->belongsTo(Category::class);

    }
    public function brand()
    {
        return $this->belongsTo(Brand::class);
        
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class, "product_id");
    }

        
    }

    

