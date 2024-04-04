<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIncomingRequest;
use App\Models\Incoming;
use Illuminate\Http\Request;

class IncomingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        if($search) {
            $incoming = Incoming::where('number_plates', 'like' , '%'.$search.'%')
            ->orWhere('product_code', 'like', '%'.$search.'%')
            ->get();
        } else {
            $incoming = Incoming::all();
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
    public function update(Request $request, Incoming $incoming)
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
