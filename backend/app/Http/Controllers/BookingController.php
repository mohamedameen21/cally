<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Booking;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Service\BookingService;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\BookingRequest;
use Illuminate\Support\Facades\Cache;

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
        $booking = null;

        try {
            $booking = Cache::lock("booking:$bookingDTO->booking_time", 5)->get(function () use ($bookingDTO, $guestUser) {
                DB::beginTransaction();
                $booking = $this->bookingService->createBooking($bookingDTO, $guestUser);
                DB::commit();
                return $booking;
            });

            return ApiResponse::success([
                'booking' => $booking->load('hostUser')
            ], 'Booking created successfully!', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return ApiResponse::validationError($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::errorWithLog('Failed to create booking', $e, 422);
        }
    }
}
