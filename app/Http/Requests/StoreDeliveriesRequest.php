<?php

namespace App\Http\Requests;

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
            'vehicle' => 'required|string',
            'product_code' => 'required|string',
            'quantity' => 'required|numeric',
            'target_delivery' => 'required|numeric',
            'actual_delivery' => 'required|numeric',
            'percentage' => 'nullable|decimal:0,100'
        ];
    }

    public function messages() {
        return [
            'vehicle.required' => 'Harap isi kolom kendaraan',
            'product_code' => 'Harap isi kolom produk',
            'quantity.required' => 'Harap isi kolom kuantitas produk',
            'quantity.numeric' => 'Kolom kuantitas wajib berupa angka',
            'target_delivery.required' => 'Harap isi kolom target pengiriman',
            'target_delivery.integer' => 'Mohon isi target pengiriman menggunakan karakter numerik',
            'actual_delivery.required' => 'Mohon isi barang yang baru terkirim',
            'actual_delivery.integer' => 'Kolom ini harus menggunakan angka',
        ];
    }
}
