<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeliveriesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'vehicle_id' => 'required|numeric',
            'product_code' => 'required|string',
            'quantity' => 'required|numeric',
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
            'quantity.required' => 'Harap isi kolom kuantitas produk',
            'quantity.numeric' => 'Kolom kuantitas wajib berupa angka',
            'target_delivery.required' => 'Harap isi kolom target pengiriman',
            'target_delivery.integer' => 'Mohon isi target pengiriman menggunakan karakter numerik',
            'actual_delivery.required' => 'Mohon isi barang yang baru terkirim',
            'actual_delivery.integer' => 'Kolom ini harus menggunakan angka',
        ];
    }
}
