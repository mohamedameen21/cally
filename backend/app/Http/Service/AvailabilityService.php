<?php

namespace App\Http\Service;

use App\DTOs\AvailabilityDTO;
use App\Enums\DayEnum;
use App\Http\Resources\AvailabilityResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AvailabilityService
{
    public function updateAvailabilities(User $user, array $availabilityDTOs)
    {
        $user->availabilities()->delete();

        $availabilitiesData = array_map(function (AvailabilityDTO $dto) use ($user) {
            return [
                'user_id' => $user->id,
                'day_of_week' => DayEnum::from($dto->day_of_week),
                'start_time' => $dto->start_time,
                'end_time' => $dto->end_time,
                'is_available' => $dto->is_available,
            ];
        }, $availabilityDTOs);

        $availabilities = $user->availabilities()->createMany($availabilitiesData);

        return AvailabilityResource::collection($availabilities);
    }


    public function getMonthAvailability(User $user, int $year, int $month)
    {
        $userAvailabilities = $user->availabilities()->get()->groupBy(function ($availability) {
            return $availability->day_of_week->value;
        });

        $userTimezone = $user->timezone ?? 'Asia/Kolkata';

        $now = Carbon::now($userTimezone);

        $monthStart = Carbon::create($year, $month, 1, 0, 0, 0, $userTimezone);
        $monthEnd = $monthStart->copy()->endOfMonth();

        $existingBookings = $this->getUserBookingsForThisMonth($user, $monthStart, $monthEnd);

        $monthAvailability = [];

        for ($day = 1; $day <= $monthEnd->day; $day++) {
            $currentDate = Carbon::create($year, $month, $day, 0, 0, 0, $userTimezone);
            $dayAvailability = $this->getDayAvailability($currentDate, $now, $userAvailabilities, $existingBookings);
            $monthAvailability[] = $dayAvailability;
        }

        return $monthAvailability;
    }

    private function getDayAvailability(Carbon $date, Carbon $now, $userAvailabilities, $existingBookings)
    {
        $dayOfWeek = strtolower($date->format('l'));

        if ($this->isPastDate($date, $now)) {
            return [
                'date' => $date->format('Y-m-d'),
                'is_available' => false,
                'time_slots' => []
            ];
        }

        $dayAvailabilities = $userAvailabilities->get($dayOfWeek, collect());

        if ($dayAvailabilities->isEmpty()) {
            return [
                'date' => $date->format('Y-m-d'),
                'is_available' => false,
                'time_slots' => []
            ];
        }

        $availableTimeSlots = $this->generateTimeSlots($dayAvailabilities);
        $filteredTimeSlots = $this->filterBookedTimeSlots($availableTimeSlots, $existingBookings, $date);
        $filteredTimeSlots = $this->filterPastTimeSlots($filteredTimeSlots, $date, $now);

        return [
            'date' => $date->format('Y-m-d'),
            'is_available' => count($filteredTimeSlots) > 0,
            'time_slots' => $filteredTimeSlots
        ];
    }

    private function isPastDate(Carbon $date, Carbon $now): bool
    {
        return $date->copy()->startOfDay()->lt($now->copy()->startOfDay());
    }

    private function generateTimeSlots($dayAvailabilities)
    {
        $timeSlots = [];

        foreach ($dayAvailabilities as $availability) {
            if (!$availability->is_available) {
                continue;
            }

            $slots = $this->breakIntoThirtyMinuteSlots(
                $availability->start_time,
                $availability->end_time ?? '23:30:00'
            );
            $timeSlots = array_merge($timeSlots, $slots);
        }

        return array_unique($timeSlots);
    }

    private function breakIntoThirtyMinuteSlots(string $startTime, string $endTime)
    {
        $slots = [];
        $currentTime = Carbon::createFromFormat('H:i:s', $startTime);
        $endTimeCarbon = Carbon::createFromFormat('H:i:s', $endTime);

        while ($currentTime->lt($endTimeCarbon)) {
            $slots[] = $currentTime->format('H:i:s');
            $currentTime->addMinutes(30);
        }

        return $slots;
    }

    private function filterBookedTimeSlots(array $timeSlots, $existingBookings, Carbon $date)
    {
        $bookedTimes = $this->getBookedTimesForDate($existingBookings, $date);

        return array_filter($timeSlots, function ($timeSlot) use ($bookedTimes) {
            return !in_array($timeSlot, $bookedTimes);
        });
    }

    private function getBookedTimesForDate($existingBookings, Carbon $date)
    {
        return $existingBookings
            ->filter(function ($booking) use ($date) {
                return $booking->booking_time->format('Y-m-d') === $date->format('Y-m-d');
            })
            ->map(function ($booking) {
                return $booking->booking_time->format('H:i:s');
            })
            ->toArray();
    }

    private function getUserBookingsForThisMonth(User $user, $monthStart, $monthEnd)
    {
        $hostBookings = $user->hostBookings;
        $guestBookings = $user->guestBookings;

        $totalBooking = $hostBookings->merge($guestBookings);

        $bookingsInUsersTimezone = $this->convertBookingsTimestampToLocalTime($totalBooking, $user->timezone);

        return $bookingsInUsersTimezone->filter(function ($booking) use ($monthStart, $monthEnd) {
            return $booking->booking_time->between($monthStart, $monthEnd);
        });
    }

    private function convertBookingsTimestampToLocalTime($bookings, $timezone)
    {
        return $bookings->map(function ($booking) use ($timezone) {
            // Convert the main booking_time field
            $booking->booking_time = Carbon::parse($booking->booking_time)
                ->setTimezone($timezone);

            return $booking;
        });
    }

    
    private function filterPastTimeSlots(array $timeSlots, Carbon $date, Carbon $now): array
    {
        // Only filter if the date is today
        if (!$date->isSameDay($now)) {
            return $timeSlots;
        }

        $currentTime = $now->format('H:i:s');
        $nextAvailableTime = $this->getNextAvailableTimeSlot($now);

        return array_filter($timeSlots, function ($timeSlot) use ($nextAvailableTime) {
            return $timeSlot >= $nextAvailableTime;
        });
    }

    private function getNextAvailableTimeSlot(Carbon $currentTime): string
    {
        $minutes = $currentTime->minute;
        $hour = $currentTime->hour;

        // Round up to next 30-minute slot
        if ($minutes <= 30) {
            $nextSlotMinute = 30;
            $nextSlotHour = $hour;
        } else {
            $nextSlotMinute = 0;
            $nextSlotHour = $hour + 1;

            // Handle hour overflow (23:xx -> 00:xx next day)
            if ($nextSlotHour >= 24) {
                $nextSlotHour = 0;
            }
        }

        // If current time is exactly on a 30-minute mark, use current time
        if ($minutes === 0 || $minutes === 30) {
            return $currentTime->format('H:i:s');
        }

        return sprintf('%02d:%02d:00', $nextSlotHour, $nextSlotMinute);
    }
}
