<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReturRequest;
use App\Models\Retur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RetursController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        if($search) {
            $retur = DB::table('master_retur')
            ->where('retur_invoice', "$search")
            ->orWhere('retur_name', "$search")
            ->orWhere('customer_name', "$search")
            ->orWhere('customer_address', "$search")
            ->get();
        } else {
            $retur = DB::table('master_retur')->get();
        }

        return response()->json($retur);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReturRequest $request)
    {
        DB::beginTransaction();

        $now = date('Y-m-d');
        $time = date('H:i:s');

        try {
            // Buat master retur tanpa subtotal
            $retur = Retur::create([
                'retur_invoice' => $request->retur_invoice,
                'retur_name' => $request->retur_name,
                'customer_name' => $request->customer_name,
                'customer_address' => $request->customer_address,
                'number_plate' => $request->number_plate,
                'date_retur' => $now,
                'time_retur' => $time,
                'batch_number' => $request->batch_number
            ]);

            // Loop untuk insert detail produk dan hitung subtotal
            foreach ($request->products as $product) {
                $realProduct = DB::table('products')
                    ->select('name', 'quantity')
                    ->where('code', $product['code'])
                    ->first();

                DB::table('detail_retur')->insert([
                    'retur_invoice' => $retur->retur_invoice,
                    'product_code' => $product['code'],
                    'product_name' => $realProduct->name,
                    'quantity' => $product['quantity'],
                ]);

                // Update stok produk
                DB::table('products')->where('code', $product['code'])
                    ->update(['quantity' => $realProduct->quantity + (int) $product['quantity']]);
            }

            DB::commit();

            return response()->json(['message' => 'Retur ticket created successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create retur',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($invoice)
    {
        $retur = DB::table('master_retur')
        ->where('retur_invoice', "$invoice")
        ->first();

        $details = DB::table('master_retur')
        ->where('master_retur.retur_invoice', "$invoice")
        ->leftJoin('detail_retur', 'master_retur.retur_invoice', '=' , 'detail_retur.retur_invoice')
        // ->leftJoin('products', 'detail_delivery.product_code', '=', 'products.code')
        ->get();

        if (!$retur) {
            return response()->json(['error' => 'Delivery not found'], 404);
        }

        return response()->json(['message' => 'Delivery detail successfully fetched', 'retur' => $retur, 'details' => $details]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($invoice)
    {
        DB::table('detail_retur')->where('retur_invoice', '=', "$invoice")->delete();
        DB::table('master_retur')->where('retur_invoice', '=', "$invoice")->delete();
        return response()->json(['message' => "Retur ticket successfully deleted"], 200);
    }
}
