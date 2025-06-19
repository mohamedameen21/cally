<?php

namespace App\DTOs;

class BookingDTO
{
    public function __construct(
        public readonly string $username,
        public readonly string $booking_time,
        public readonly ?string $notes = null
    ) {}
}