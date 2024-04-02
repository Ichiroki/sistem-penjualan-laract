<?php

namespace App\Http\Controllers;

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
}
