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
            'delivery_invoice' => 'required|string',
            'delivery_name' => 'required|string',
            'customer_name' => 'required|string',
            'customer_address' => 'required|string',
            'number_plates' => 'required|string',
            'batch_number' => 'required|string',
            'products' => 'required',
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
            'number_plates.required' => 'Harap isi kolom alamat plat nomor',
            'number_plates.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'batch_number.required' => 'Harap isi kolom alamat kustomer',
            'batch_number.string' => 'Kolom ini wajib menggunakan karakter alphabet',
            'products.required' => 'Harap isi kolom produk yang akan dikirimkan (setidaknya satu produk)',
        ];
    }

    public function withValidator($validator) {
        $validator->after(function($valid) {
            foreach ($this->products as $product) {
                $findProd = Product::where('code', $product['code'])->first();

                if (!$findProd) {
                    $valid->errors()->add('products', "Produk dengan kode {$product['code']} tidak ditemukan.");
                    continue;
                }

                if ((int) $product['quantity'] > $findProd->quantity) {
                    $valid->errors()->add('target_delivery', "Produk {$product['code']} tidak memiliki stok yang cukup.");
                }
            }
        });
    }
}
