<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        if($search) {
            $vehicles = Vehicle::where('number_plates', 'like', '%' . $search . '%' )
            ->orWhere('vehicle_type', 'like', '%' . $search . '%');
        } else {
            $vehicles = Vehicle::get();
        }

        return response()->json($vehicles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehicleRequest $request)
    {
        $id = Str::uuid();

        return Vehicle::create([
            'id' => $id,
            'number_plates' => $request->validated('number_plates'),
            'vehicle_type' => $request->validated('vehicle_type'),
            'target' => $request->validated('target')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        return $vehicle->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        //
    }
}
