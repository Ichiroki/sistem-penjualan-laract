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
            $incoming = DB::table('master_incoming')
            ->where('incoming_invoice', 'like', "$search")
            ->where('supplier_name', 'like', "$search")
            ->where('received_to', 'like', "$search")
            ->get();
        } else {
            $incoming = DB::table('master_incoming')->get();
        }

        return response()->json($incoming);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIncomingRequest $request)
    {
        return Incoming::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Incoming $incoming)
    {
        //
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
