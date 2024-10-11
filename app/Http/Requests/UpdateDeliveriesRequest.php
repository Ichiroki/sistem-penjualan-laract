<?php

namespace App\Http\Requests;

use App\Models\Product;
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
            'delivery_invoice' => 'required|string',
            'delivery_name' => 'required|string',
            'customer_name' => 'required|string',
            'customer_address' => 'required|string',
            'delivery_Cost' => 'required|string',
            'number_plates' => 'required|string',
            'date_delivery' => 'required|date',
            'time_delivery' => 'required|string|timezone:Indonesia',
            'batch_number' => 'nullable|decimal:0,100'
        ];
    }

    public function messages() {
        return [
            'delivery_invoice.required' => 'Harap isi kolom invoice pengiriman',
            'delivery_invoice.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'delivery_name.required' => 'Harap isi kolom nama pengirim',
            'delivery_name.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'customer_name.required' => 'Harap isi kolom nama kustomer',
            'customer_name.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'customer_address.required' => 'Harap isi kolom alamat kustomer',
            'customer_address.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'delivery_cost.required' => 'Harap isi kolom alamat biaya pengiriman',
            'delivery_cost.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'number_plates.required' => 'Harap isi kolom alamat plat nomor',
            'number_plates.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'date_delivery.required' => 'Harap isi kolom alamat tanggal pengiriman',
            'date_delivery.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'time_delivery.required' => 'Harap isi kolom jam pengiriman',
            'time_delivery.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'time_delivery.timezone' => 'Kolom ini wajib menggunakan zona Waktu Indonesia Barat',
            'batch_number.required' => 'Harap isi kolom alamat kustomer',
            'batch_number.string' => 'Kolom ini wajib menggunakan karakter alphabet',
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
