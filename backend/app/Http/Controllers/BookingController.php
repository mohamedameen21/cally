<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\BookingRequest;
use App\Http\Service\BookingService;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            $bookings = $this->bookingService->getUserBookings($user);

            return ApiResponse::success([
                'bookings' => $bookings
            ]);
        } catch (\Exception $e) {
            return ApiResponse::errorWithLog('Failed to retrieve bookings', $e, 500);
        }
    }


    public function store(BookingRequest $request): JsonResponse
    {
        $guestUser = Auth::user();
        $bookingDTO = $request->toDTO();

        try {
            DB::beginTransaction();

            $booking = $this->bookingService->createBooking($bookingDTO, $guestUser);

            DB::commit();

            return ApiResponse::success([
                'booking' => $booking->load('hostUser')
            ], 'Booking created successfully!', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::errorWithLog('Failed to create booking', $e, 422);
        }
    }
}
