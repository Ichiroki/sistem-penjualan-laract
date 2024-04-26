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
}
