<?php

namespace App\DTOs;

class MonthAvailabilityDTO
{
    /**
     * @param int $year The year for which to get availability data
     * @param int $month The month for which to get availability data (1-12)
     * @param string $username The username of the user whose availability is being queried
     */
    public function __construct(
        public readonly int $year,
        public readonly int $month,
        public readonly string $username
    ) {}
}