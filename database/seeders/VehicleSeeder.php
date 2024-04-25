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
            'id' => 'b056596c-2518-4658-8266-72bc86a1072f',
            'number_plates' => "F8601KH",
            'vehicle_type' => "Grandmax"
        ]);

        Vehicle::create([
            'id' => '6dbbb163-050d-497d-90b3-4f0ec8c5df43',
            'number_plates' => "F8171HP",
            'vehicle_type' => "Traga"
        ]);

        Vehicle::create([
            'id' => '194c5232-cace-4975-8814-0c704b24aae2',
            'number_plates' => "F8716HR",
            'vehicle_type' => "Traga"
        ]);
    }
}
