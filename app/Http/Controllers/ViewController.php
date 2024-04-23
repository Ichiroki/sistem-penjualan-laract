<?php

namespace App\Http\Controllers;

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

    public function vehicle() {
        return Inertia::render('Vehicle/Index');
    }

    public function incoming() {
        return Inertia::render('Incoming/Index');
    }

    public function expense() {
        return Inertia::render('Expense/Index');
    }
}
