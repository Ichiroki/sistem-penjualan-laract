<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Vehicle::create([
            'number_plates' => "F8601KH",
            'vehicle_type' => "Grandmax"
        ]);

        Vehicle::create([
            'number_plates' => "F8171HP",
            'vehicle_type' => "Traga"
        ]);

        Vehicle::create([
            'number_plates' => "F8716HR",
            'vehicle_type' => "Traga"
        ]);
    }
}
