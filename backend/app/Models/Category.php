<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
     public function products()
    {
        return $this->hasOne(Products::class, 'parent_id');
    }
}
