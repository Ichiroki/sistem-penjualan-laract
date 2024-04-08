<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIncomingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'input_date' => 'required|string',
            'delivery_id' => 'required|integer',
            'product_code' => 'required|string'
        ];
    }
}
