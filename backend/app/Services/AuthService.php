<?php

namespace App\Services;

use App\Jobs\ResetPasswordNotificationJob;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Register a new user.
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'message' => 'User registered successfully',
        ];
    }

    /**
     * Authenticate user credentials and login.
     *
     * @param array<string, mixed> $credentials
     * @return array<string, mixed>
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticateAndLogin(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return $this->login(Auth::user());
    }

    /**
     * Login a user and generate token.
     *
     * @param \App\Models\User $user
     * @return array<string, mixed>
     */
    public function login(User $user): array
    {
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
            'message' => 'Login successful',
        ];
    }

    /**
     * Send a password reset link.
     *
     * @param string $email
     * @return string
     */
    public function sendPasswordResetLink(string $email): string
    {
        dispatch(new ResetPasswordNotificationJob($email));

        return true;
    }

    /**
     * Reset the user's password.
     *
     * @param array<string, mixed> $data
     * @return string
     */
    public function resetPassword(array $data): string
    {
        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status;
    }
}
