<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        if($search) {
            $product = Product::where('code', 'like' , '%'.$search.'%')->orWhere('name', 'like', '%'.$search.'%')->get();
        } else {
            $product = Product::paginate(5);
        }

        // dd($product);
        return response()->json($product);
    }

    public function showByCode($code) {
        $product = Product::where('code', $code)->first();
        if(!$product) {
            return response()->json(['error' => 'bjir produknya gak ketemu'], 404);
        }
        return response()->json($product);
    }

    public function store(StoreProductRequest $request)
    {
        return Product::create($request->validated());
    }

    public function show(Product $product)
    {
        //
    }

    public function update(StoreProductRequest $request, Product $product)
    {
        return $product->update($request->validated());
    }

    public function destroy(Product $product)
    {
        return $product->delete();
    }
}
