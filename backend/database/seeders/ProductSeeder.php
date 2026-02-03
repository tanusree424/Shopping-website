<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Existing category & brand ID fetch
        $womenCategory = Category::where('name', 'Womens')->first();
        $kidsCategory  = Category::where('name', 'Kids')->first();
        $accessoryCat  = Category::where('name', 'Accessories')->first();

        $nike   = Brand::where('name', 'Nike')->first();
        $puma   = Brand::where('name', 'Puma')->first();
        $levis  = Brand::where('name', "Levi's")->first();

        $products = [

            [
                "name" => "Women Floral Kurti",
                "price" => 1999,
                "discount_price" => 1699,
                "sku" => "WM-KURTI-01",
                "stock" => 100,
                "short_desc" => "Elegant floral kurti",
                "description" => "Soft cotton floral printed kurti for women",
                "category_id" => $womenCategory?->id,
                "brand_id" => $nike?->id,
                "images" => [
                    "https://via.placeholder.com/300?text=Women+Kurti"
                ],
                "variants" => [
                    [
                        "color" => "Red",
                        "size" => "M",
                        "stock" => 30,
                        "price" => 1999,
                    ],
                    [
                        "color" => "Blue",
                        "size" => "L",
                        "stock" => 40,
                        "price" => 1999,
                    ]
                ]
            ],

            [
                "name" => "Kids Cartoon T-Shirt",
                "price" => 899,
                "discount_price" => 749,
                "sku" => "KD-TSHIRT-01",
                "stock" => 120,
                "short_desc" => "Cute cartoon t-shirt",
                "description" => "Soft cotton t-shirt for kids",
                "category_id" => $kidsCategory?->id,
                "brand_id" => $puma?->id,
                "images" => [
                    "https://via.placeholder.com/300?text=Kids+Tshirt"
                ],
                "variants" => [
                    [
                        "color" => "Yellow",
                        "size" => "6Y",
                        "stock" => 40,
                        "price" => 899,
                    ]
                ]
            ],

            [
                "name" => "Leather Handbag",
                "price" => 3499,
                "discount_price" => 2999,
                "sku" => "ACC-BAG-01",
                "stock" => 50,
                "short_desc" => "Premium leather handbag",
                "description" => "Stylish handbag for women",
                "category_id" => $accessoryCat?->id,
                "brand_id" => $levis?->id,
                "images" => [
                    "https://via.placeholder.com/300?text=Handbag"
                ],
                "variants" => [
                    [
                        "color" => "Brown",
                        "size" => "Free",
                        "stock" => 50,
                        "price" => 3499,
                    ]
                ]
            ],
        ];

        foreach ($products as $item) {

            // 🔐 Duplicate SKU check
            if (Product::where('sku', $item['sku'])->exists()) {
                continue;
            }

            $product = Product::create([
                "name" => $item["name"],
                "slug" => Str::slug($item["name"]),
                "price" => $item["price"],
                "discount_price" => $item["discount_price"],
                "sku" => $item["sku"],
                "stock" => $item["stock"],
                "short_desc" => $item["short_desc"],
                "description" => $item["description"],
                "category_id" => $item["category_id"],
                "brand_id" => $item["brand_id"],
            ]);

            foreach ($item["images"] as $img) {
                ProductImage::create([
                    "product_id" => $product->id,
                    "image" => $img
                ]);
            }

            foreach ($item["variants"] as $variant) {
                ProductVariant::create([
                    "product_id" => $product->id,
                    "color" => $variant["color"],
                    "size" => $variant["size"],
                    "stock" => $variant["stock"],
                    "price" => $variant["price"],
                ]);
            }
        }
    }
}
