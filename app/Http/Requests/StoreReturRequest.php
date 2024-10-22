<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReturRequest extends FormRequest
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
            'retur_invoice' => 'required|string',
            'retur_name' => 'required|string',
            'customer_name' => 'required|string',
            'customer_address' => 'required|string',
            'number_plate' => 'required|string',
            'batch_number' => 'required|string',
            'products' => 'required|array'
        ];
    }
}
