<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidateImmediateBooking implements ValidationRule
{

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            $bookingTime = Carbon::parse($value, 'UTC');

            // Get current time in UTC
            $nowUTC = Carbon::now('UTC');

            // Add a 15-minute buffer to current time
            $minimumBookingTime = $nowUTC->addMinutes(15);

            if ($bookingTime->lessThanOrEqualTo($minimumBookingTime)) {
                $fail('The booking time must be at least 15 minutes in the future.');
            }
        } catch (\Exception $e) {
            $fail('The booking time format is invalid.');
        }
    }
}
