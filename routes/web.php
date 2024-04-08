<?php

use App\Http\Controllers\DeliveriesController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ViewController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', [ViewController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('products/{code}', [ProductController::class, 'showByCode']);

Route::prefix('/')->middleware(['auth', 'verified'])->group(function() {
    Route::get('product', [ViewController::class, 'product'])->name('product');
    Route::get('delivery', [ViewController::class, 'delivery'])->name('delivery');
    Route::get('incoming', [ViewController::class, 'incoming'])->name('incoming');
    Route::get('expense', [ViewController::class, 'expense'])->name('expense');

    Route::apiResource('products', ProductController::class);
    Route::apiResource('deliveries', DeliveriesController::class);
    Route::apiResource('incomings', IncomingController::class);
    Route::apiResource('expenses', ExpenseController::class);

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
