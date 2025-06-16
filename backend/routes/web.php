<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Password reset route for email notifications
// This route is used by Laravel's ResetPassword notification to generate reset URLs
Route::get('/reset-password/{token}', function (string $token) {
    // For API-only applications, redirect to frontend reset page
    $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
    
    return redirect($frontendUrl . '/reset-password?token=' . $token . '&email=' . request('email'));
})->middleware('guest')->name('password.reset');
