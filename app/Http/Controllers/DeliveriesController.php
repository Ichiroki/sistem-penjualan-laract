<?php

namespace App\Http\Controllers;

date_default_timezone_set('Asia/Jakarta');

use App\Http\Requests\StoreDeliveriesRequest;
use App\Http\Requests\UpdateDeliveriesRequest;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeliveriesController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        if ($search) {
            $pengiriman = DB::table('master_delivery')
            ->where('delivery_invoice', 'like' , `%$search%`)
            ->where('delivery_name', 'like' , `%$search%`)
            ->where('customer_name', 'like' , `%$search%`)
            ->where('batch_number', 'like' , `%$search%`)
            ->where('number_plates', 'like', `%$search%`)
            ->get();
        } else {
            $pengiriman = DB::table('master_delivery')->get();
        }

        return response()->json($pengiriman);
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
                $realProduct = DB::table('products')->select('quantity')->where('code', $product['code'])->first();

                DB::table('detail_delivery')->insert([
                    'delivery_invoice' => $delivery->delivery_invoice,
                    'product_code' => $product['code'],
                    'quantity' => $product['quantity']
                ]);

                DB::table('products')->where('code', $product['code'])->update(['quantity' => $realProduct->quantity - (int) $product['quantity']]);
            }

            DB::commit();

            return response()->json(['message' => 'Delivery created successfully'], 201);
        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => 'Failed to create delivery', 'details' => $e->getMessage()], 500);
        }

    }

    public function show($invoice) {
        $delivery = DB::table('master_delivery')->where('delivery_invoice', "$invoice")->first();

        if (!$delivery) {
            return response()->json(['error' => 'Delivery not found'], 404);
        }

        $details = DB::table('detail_delivery')
        ->where('delivery_invoice', $invoice)
        ->get();

        return response()->json(['message' => 'Delivery detail successfully fetched', 'delivery' => $delivery, 'details' => $details]);
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
