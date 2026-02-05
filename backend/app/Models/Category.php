<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Category extends Model
{
    use HasFactory;

     protected $fillable = [
    'name', 'slug', 'description', 'parent_id',
    'category_image', 'category_image_public_id'
];

    // 🔹 Parent category
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // 🔹 Child categories
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // 🔹 Category has many products
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
