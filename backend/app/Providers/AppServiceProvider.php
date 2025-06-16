<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ResetPassword::createUrlUsing(function ($user, string $token) { return 'http://127.0.0.1:8000/admin/reset-password/'.$token; });
    }
}
