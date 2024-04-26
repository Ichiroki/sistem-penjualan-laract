<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeliveriesRequest;
use App\Http\Requests\UpdateDeliveriesRequest;
use App\Models\Delivery;
use App\Models\Product;
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
            }])->with(['vehicle', function($query) use ($search) {
                $query->where('number_plates', 'like', '%' . $search . '%')
                ->orWhere('vehicle_type', 'like', '%' . $search . '%');
            }])
            ->get();
        } else {
            $pengiriman = Delivery::with(['vehicle', 'product'])->latest()->get();
        }


        return response()->json($pengiriman);
    }

    public function showByNumberPlates($number_plates) {
        $product = Delivery::with(['vehicle', 'product'])
        ->where('product_code', $number_plates)
        ->orWhere('number_plates', $number_plates)
        ->get();
        if(!$product) {
            return response()->json(['error' => 'bjir pengirimannya dari plat nomor ini gak ketemu'], 404);
        }
        return response()->json($product);
    }

    public function store(StoreDeliveriesRequest $request)
    {
        $product = Product::where('code', $request->product_code)->first();
        $quantity = $product->quantity - $request->target_delivery;

        $product->update(['quantity' => $quantity]);

        return Delivery::create([
            'vehicle_id' => $request->vehicle_id,
            'product_code' => $request->product_code,
            'quantity' => $quantity,
            'target_delivery' => $request->target_delivery,
            'actual_delivery' => $request->actual_delivery,
            'percentage' => ($request->actual_delivery / $request->target_delivery) * 100
        ]);
    }

    public function update(UpdateDeliveriesRequest $request, Delivery $delivery)
    {
        $product = Product::where('code', $request->product_code)->first();
        $quantity = $product->quantity - $request->target_delivery;

        $product->update(['quantity' => $quantity]);

        return $delivery->update([
            'vehicle_id' => $request->vehicle_id,
            'product_code' => $request->product_code,
            'quantity' => $quantity,
            'target_delivery' => $request->target_delivery,
            'actual_delivery' => $request->actual_delivery,
            'percentage' => ($request->actual_delivery / $request->target_delivery) * 100
        ]);
    }

    public function destroy(Delivery $delivery)
    {
        return $delivery->delete();
    }
}
