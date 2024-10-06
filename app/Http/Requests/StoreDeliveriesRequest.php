<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class StoreDeliveriesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => 'required|numeric',
            'product_code' => 'required|string',
            'target_delivery' => 'required|numeric',
            'actual_delivery' => 'required|numeric',
            'percentage' => 'nullable|decimal:0,100'
        ];
    }

    public function messages() {
        return [
            'vehicle_id.required' => 'Harap isi kolom kendaraan',
            'vehicle_id.numeric' => 'Kolom vehicle wajib berupa angka',
            'product_code' => 'Harap isi kolom produk',
            'target_delivery.required' => 'Harap isi kolom target pengiriman',
            'target_delivery.integer' => 'Mohon isi target pengiriman menggunakan karakter numerik',
            'actual_delivery.required' => 'Mohon isi barang yang baru terkirim',
            'actual_delivery.integer' => 'Kolom ini harus menggunakan angka',
        ];
    }


    public function withValidator($validator) {
        $validator->after(function($valid) {
            $product = Product::where('code', $this->product_code)->first();
            if($this->target_delivery >= $product->quantity) {
                $valid->errors()->add('target_delivery', 'Produk yang dipilih tidak memiliki jumlah yang cukup');
            }
        });
    }
}
