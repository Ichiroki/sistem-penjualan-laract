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
            'id' => 'required|string',
            'number_plates' => 'required|string',
            'vehicle_type' => 'required|string',
            'product_code' => 'required|string',
            'target_delivery' => 'required|integer',
            'actual_delivery' => 'required|integer',
            'percentage' => 'nullable|decimal:0,100'
        ];
    }

    public function messages() {
        return [
            'number_plates.required' => 'Harap isi kolom plat nomor',
            'number_paltes.string' => 'Mohon isi plat nomor menggunakan karakter gabungan numerik dan alphabet',
            'vehicle_type.required' => 'Harap isi kolom tipe / nama kendaraan',
            'vehicle_type.string' => 'Mohon isi tipe / nama kendaraan menggunakan karakter alphabet',
            'target_delivery.required' => 'Harap isi kolom target pengiriman',
            'target_delivery.integer' => 'Mohon isi target pengiriman menggunakan karakter numerik',
            'actual_delivery.required' => 'Mohon isi barang yang baru terkirim',
            'actual_delivery.integer' => 'Kolom ini harus menggunakan angka',
        ];
    }
}
