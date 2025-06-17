<?php

namespace App\Rules;

use Illuminate\Validation\Validator;

class ValidateAvailabilityTimes
{
    /**
     * Validate that all time slots have valid start and end times.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function __invoke(Validator $validator)
    {
        $data = $validator->getData();
        $availabilities = $data['availabilities'] ?? [];

        foreach ($availabilities as $index => $availability) {
            if (!$availability['is_available']) {
                continue;
            }

            $startTime = $this->timeToMinutes($availability['start_time']);
            $endTime = $this->timeToMinutes($availability['end_time']);

            if ($startTime >= $endTime) {
                $validator->errors()->add(
                    "availabilities.{$index}.end_time",
                    "The end time must be after the start time."
                );
            }
        }
    }

    protected function timeToMinutes(string $time): int
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + $minutes;
    }
}
