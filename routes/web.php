<?php

use App\Http\Controllers\StarController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. The Cinematic Intro (Public)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// 2. The Main Application (Requires Login)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/starmap', [StarController::class, 'index'])->name('home');
    Route::get('/observatory', [StarController::class, 'observatory'])->name('observatory');
    Route::post('/chapter', [StarController::class, 'store'])->name('chapter.save');
    Route::delete('/chapter/{star_name}', [StarController::class, 'destroy'])->name('chapter.delete');
    Route::get('/star/search', [StarController::class, 'search'])->name('star.search');
});

// 3. Breeze Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';