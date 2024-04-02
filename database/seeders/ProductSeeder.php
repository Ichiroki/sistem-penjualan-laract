<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'code' => 'NLE-1001',
            'name' => 'Botol 220ml',
            'quantity' => 100
        ]);

        Product::create([
            'code' => 'NLE-1012',
            'name' => 'Botol 330ml',
            'quantity' => 100
        ]);

        Product::create([
            'code' => 'NLE-1052',
            'name' => 'Botol 500ml',
            'quantity' => 100
        ]);

        Product::create([
            'code' => 'NLE-1943',
            'name' => 'Botol 1000ml',
            'quantity' => 100
        ]);
    }
}
