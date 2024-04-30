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
            'quantity' => 1000
        ]);

        Product::create([
            'code' => 'NLE-1012',
            'name' => 'Botol 330ml',
            'quantity' => 1000
        ]);

        Product::create([
            'code' => 'NLE-1052',
            'name' => 'Botol 500ml',
            'quantity' => 1000
        ]);

        Product::create([
            'code' => 'NLE-1943',
            'name' => 'Botol 1500ml',
            'quantity' => 1000
        ]);

        Product::create([
            'code' => 'NLE-4556',
            'name' => 'Galon 19 L',
            'quantity' => 1000
        ]);
    }
}
