<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard() {
        return Inertia::render('Dashboard');
    }

    public function product() {
        return Inertia::render('Product/Index');
    }

    public function delivery() {
        return Inertia::render('Delivery/Index');
    }

    public function deliveryDetail($data) {
        $delivery = Delivery::where('number_plates', $data)->get();

        return Inertia::render('Delivery/DeliveriesDetail', [
            'delivery' => $delivery
        ]);
    }

    public function incoming() {
        return Inertia::render('Incoming/Index');
    }

    public function expense() {
        return Inertia::render('Expense/Index');
    }
}
