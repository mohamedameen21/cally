<?php

namespace App\Http\Service;

use App\DTOs\BookingDTO;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{

    public function createBooking(BookingDTO $bookingDTO, User $guestUser): Booking
    {
        $bookingTime = Carbon::parse($bookingDTO->booking_time);

        // Create the booking
        return Booking::create([
            'host_user_id' => $hostUser->id,
            'guest_user_id' => $guestUser->id,
            'booking_time' => $bookingTime,
            'notes' => $bookingDTO->notes
        ]);
    }


    public function getUserBookings(User $user, ?string $startDate = null, ?string $endDate = null)
    {
        $query = Booking::where(function ($q) use ($user) {
            $q->where('host_user_id', $user->id)
              ->orWhere('guest_user_id', $user->id);
        })
            ->with(['hostUser', 'guestUser'])
            ->orderBy('booking_time', 'desc');

        if ($startDate && $endDate) {
            $query->forDateRange($startDate, $endDate);
        }

        return $query->get();
    }

    public function getBookingsByUserId(int $userId, ?string $startDate = null, ?string $endDate = null)
    {
        $startDate = $startDate ?: Carbon::now('UTC')->startOfMonth();
        $endDate = $endDate ?: Carbon::now('UTC')->endOfMonth();

        return Booking::where('host_user_id', $userId)
            ->forDateRange($startDate, $endDate)
            ->select(['booking_time'])
            ->get();
    }

    
    public function updateBooking(Booking $booking, array $data): Booking
    {
        $booking->update($data);
        return $booking->fresh();
    }
}
