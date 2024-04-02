<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'code' => 'required|string',
            'name' => 'required|string',
            'quantity' => 'required|integer'
        ];
    }

    public function messages() {
        return [
            'code.required' => 'Harap isi kolom kode',
            'code.string' => 'Mohon isi code menggunakan karakter alphabet',
            'name.required' => 'Harap isi kolom nama',
            'name.string' => 'Mohon isi nama menggunakan karakter alphabet',
            'quantity.required' => 'Harap isi kolom kuantitas',
            'quantity.integer' => 'Mohon isi kuantitas menggunakan karakter numerik'
        ];
    }
}
