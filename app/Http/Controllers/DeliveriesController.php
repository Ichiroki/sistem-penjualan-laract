<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeliveriesRequest;
use App\Http\Requests\UpdateDeliveriesRequest;
use App\Models\Delivery;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;

class DeliveriesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        if($search) {
            $pengiriman = Delivery::with(['product', function($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%');
            }])
            ->where('number_plates', 'like', '%'.$search.'%')
            ->orWhere('vehicle_type', 'like', '%'.$search.'%')
            ->get();
        } else {
            $pengiriman = Delivery::with(['product'])->latest()->get();
        }


        return response()->json($pengiriman);
    }

    public function store(StoreDeliveriesRequest $request)
    {
        return Delivery::create([
            'id' => $request->id,
            'number_plates' => $request->number_plates,
            'vehicle_type' => $request->vehicle_type,
            'product_code' => $request->product_code,
            'target_delivery' => $request->target_delivery
        ]);
    }

    public function show(Delivery $delivery)
    {
        //
    }

    public function update(UpdateDeliveriesRequest $request, Delivery $delivery)
    {
        return $delivery->update($request->validated());
    }

    public function destroy(Delivery $delivery)
    {
        return $delivery->delete();
    }
}
