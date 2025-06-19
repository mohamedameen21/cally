<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Password;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ResetPasswordNotificationJob implements ShouldQueue
{
    use Queueable;

    private $email;

    /**
     * Create a new job instance.
     */
    public function __construct(string $email)
    {
        $this->email = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $status = Password::sendResetLink(['email' => $this->email]);
    }
}
