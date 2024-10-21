<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIncomingRequest;
use App\Http\Requests\UpdateIncomingRequest;
use App\Models\Incoming;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IncomingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        if($search) {
            $incoming = Incoming::where('incoming_invoice', 'like', "$search")
            ->orWhere('number_plate', 'like', "$search")
            ->orWhere('supplier_name', 'like', "$search")
            ->orWhere('received_to', 'like', "$search")
            ->get();
        } else {
            $incoming = Incoming::get();
        }

        return response()->json($incoming);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIncomingRequest $request)
    {
        DB::beginTransaction();

        $now = date('Y-m-d');
        $time = date('H:i:s');

        try {
            // Buat master incoming tanpa subtotal
            $incoming = Incoming::create([
                'incoming_invoice' => $request->incoming_invoice,
                'supplier_name' => $request->supplier_name,
                'received_to' => $request->received_to,
                'number_plate' => $request->number_plate,
                'subtotal' => 0,
                'date_incoming' => $now,
                'time_incoming' => $time,
            ]);

            // Inisialisasi subtotal
            $subtotal = 0;

            // Loop untuk insert detail produk dan hitung subtotal
            foreach ($request->products as $product) {
                $realProduct = DB::table('products')
                    ->select('name', 'quantity')
                    ->where('code', $product['code'])
                    ->first();

                DB::table('detail_incoming')->insert([
                    'incoming_invoice' => $incoming->incoming_invoice,
                    'product_code' => $product['code'],
                    'product_name' => $realProduct->name,
                    'price_per_unit' => $product['price'],
                    'subtotal' => $product['quantity'] * $product['price'],
                    'quantity' => $product['quantity'],
                ]);

                // Update stok produk
                DB::table('products')->where('code', $product['code'])
                    ->update(['quantity' => $realProduct->quantity + (int) $product['quantity']]);

                // Hitung subtotal
                $subtotal += $product['quantity'] * $product['price'];
            }

            // Update subtotal pada master incoming
            $incoming->update(['subtotal' => $subtotal]);

            DB::commit();

            return response()->json(['message' => 'Incoming created successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create incoming',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($invoice)
    {
        $incoming = DB::table('master_incoming')
        ->where('incoming_invoice', "$invoice")
        ->first();

        $details = DB::table('master_incoming')
        ->where('master_incoming.incoming_invoice', "$invoice")
        ->leftJoin('detail_incoming', 'master_incoming.incoming_invoice', '=' , 'detail_incoming.incoming_invoice')
        // ->leftJoin('products', 'detail_delivery.product_code', '=', 'products.code')
        ->get();

        if (!$incoming) {
            return response()->json(['error' => 'Delivery not found'], 404);
        }

        return response()->json(['message' => 'Delivery detail successfully fetched', 'incoming' => $incoming, 'details' => $details]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIncomingRequest $request, Incoming $incoming)
    {
        return $incoming->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incoming $incoming)
    {
        return $incoming->delete();
    }
}
