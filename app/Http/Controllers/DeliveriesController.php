<?php

namespace App\Http\Controllers;

date_default_timezone_set('Asia/Jakarta');

use App\Http\Requests\StoreDeliveriesRequest;
use App\Http\Requests\UpdateDeliveriesRequest;
use App\Models\Delivery;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class DeliveriesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        if ($search) {
            $pengiriman = Delivery::with(['vehicle', 'product'])
                ->whereHas('vehicle', function ($query) use ($search) {
                    $query->where('number_plates', 'like', '%' . $search . '%');
                })
                ->orWhereHas('product', function ($query) use ($search) {
                    $query->where('code', 'like', '%' . $search . '%')->orWhere('name', 'like', '%' . $search . '%');
                })
                ->get();
        } else {
            $pengiriman = Delivery::with(['vehicle', 'product'])->latest()->get();
        }

        return response()->json($pengiriman);
    }

    public function showByNumberPlates($number_plates) {
        $product = Delivery::with(['vehicle', 'product'])
        ->whereHas('vehicle', function($query) use ($number_plates) {
            $query->where('number_plates', 'like', '%' . $number_plates . '%');
        })
        ->orWhereHas('product', function ($query) use ($number_plates) {
            $query->where('code', 'like', '%' . $number_plates . '%');
        })
        ->get();
        if($product->isEmpty()) {
            return response()->json(['error' => 'bjir pengirimannya dari plat nomor ini gak ketemu'], 404);
        }
        return response()->json($product);
    }

    public function store(StoreDeliveriesRequest $request)
    {
        DB::beginTransaction();

        $now = date('Y-m-d');
        $time = date('H:i:s');

        try {
            $delivery = Delivery::create([
                'delivery_invoice' => $request->delivery_invoice,
                'delivery_name' => $request->delivery_name,
                'customer_name' => $request->customer_name,
                'customer_address' => $request->customer_address,
                'number_plates' => $request->number_plates,
                'date_delivery' => $now,
                'time_delivery' => $time,
                'batch_number' => $request->batch_number,
            ]);

            forEach($request->products as $product) {
                DB::table('detail_delivery')->insert([
                    'delivery_invoice' => $delivery->delivery_invoice,
                    'product_code' => $product['code'],
                    'quantity' => $product['quantity']
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Delivery created successfully'], 201);
        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => 'Failed to create delivery', 'details' => $e->getMessage()], 500);
        }

    }

    public function update(UpdateDeliveriesRequest $request, Delivery $delivery)
    {
        // $product = Product::where('code', $request->product_code)->first();
        // $quantity = $product->quantity - $request->target_delivery;

        // $product->update(['quantity' => $quantity]);

        // return $delivery->update([
        //     'vehicle_id' => $request->vehicle_id,
        //     'product_code' => $request->product_code,
        //     'quantity' => $quantity,
        //     'target_delivery' => $request->target_delivery,
        //     'actual_delivery' => $request->actual_delivery,
        //     'percentage' => ($request->actual_delivery / $request->target_delivery) * 100
        // ]);
    }

    public function destroy(Delivery $delivery)
    {
        return $delivery->delete();
    }
}
