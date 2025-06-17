<?php

namespace App\DTOs;

class AvailabilityDTO
{
    /**
     * @param string $day_of_week
     * @param string $start_time
     * @param string $end_time
     * @param bool $is_available
     */
    public function __construct(
        public readonly string $day_of_week,
        public readonly string $start_time,
        public readonly string $end_time,
        public readonly bool $is_available = true
    ) {}
}
