<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeliveriesRequest extends FormRequest
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
            'number_plates' => 'required|string',
            'vehicle_type' => 'required|string',
            'product_code' => 'required|string',
            'target_delivery' => 'required|integer'
        ];
    }

    public function messages() {
        return [
            'number_plates.required' => 'Harap isi kolom plat nomor',
            'number_paltes.string' => 'Mohon isi plat nomor menggunakan karakter gabungan numerik dan alphabet',
            'vehicle_type.required' => 'Harap isi kolom tipe / nama kendaraan',
            'vehicle_type.string' => 'Mohon isi tipe / nama kendaraan menggunakan karakter alphabet',
            'target_delivery.required' => 'Harap isi kolom target pengiriman',
            'target_delivery.integer' => 'Mohon isi target pengiriman menggunakan karakter numerik'
        ];
    }
}
