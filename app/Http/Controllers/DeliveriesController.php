<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeliveriesRequest;
use App\Http\Requests\UpdateDeliveriesRequest;
use App\Models\Delivery;
use Illuminate\Http\Request;

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
        return Delivery::create($request->validated());
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
