<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user.
     *
     * @param \App\Http\Requests\Auth\RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return ApiResponse::success($result, 'User registered successfully');
    }

    /**
     * Login a user.
     *
     * @param \App\Http\Requests\Auth\LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->authenticateAndLogin($request->validated());

        return ApiResponse::success($result, 'User logged in successfully');
    }

    /**
     * Send a password reset link.
     *
     * @param \App\Http\Requests\Auth\ForgotPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $this->authService->sendPasswordResetLink($request->email);

        return ApiResponse::success([], 'Password reset link sent successfully');
    }

    /**
     * Reset the user's password.
     *
     * @param \App\Http\Requests\Auth\ResetPasswordRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = $this->authService->resetPassword($request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        ));

        return ApiResponse::success($status, 'Password reset successfully');
    }

    /**
     * Logout the user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success([], 'User logged out successfully');
    }
}
