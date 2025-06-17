<?php

namespace App\Rules;

use Illuminate\Validation\Validator;

class ValidateAvailabilityOverlaps
{
    /**
     * Validate that time slots don't overlap within the same day.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function __invoke(Validator $validator)
    {
        $data = $validator->getData();
        $availabilities = $data['availabilities'] ?? [];

        // Group availabilities by day
        $groupedByDay = [];
        foreach ($availabilities as $index => $availability) {
            $day = $availability['day_of_week'];

            $groupedByDay[$day][] = [
                'index' => $index,
                'start_time' => $availability['start_time'],
                'end_time' => $availability['end_time'],
                'is_available' => $availability['is_available'] ?? true
            ];
        }

        // Check for overlaps within each day
        foreach ($groupedByDay as $day => $slots) {
            // Sort slots by start time before checking for overlaps
            usort($slots, function ($a, $b) {
                $aStart = $this->timeToMinutes($a['start_time']);
                $bStart = $this->timeToMinutes($b['start_time']);
                return $aStart <=> $bStart;
            });
            
            $this->checkOverlapsInDay($slots, $validator);
        }
    }

    /**
     * Check for overlapping time slots within a day.
     *
     * @param  array  $slots
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    protected function checkOverlapsInDay(array $slots, Validator $validator): void
    {
        $count = count($slots);

        for ($i = 0; $i < $count; $i++) {
            if (!($slots[$i]['is_available'] ?? true)) {
                continue;
            }

            $startTime1 = $this->timeToMinutes($slots[$i]['start_time']);
            $endTime1 = $this->timeToMinutes($slots[$i]['end_time']);

            for ($j = $i + 1; $j < $count; $j++) {
                // Skip slots marked as not available
                if (!($slots[$j]['is_available'] ?? true)) {
                    continue;
                }

                $startTime2 = $this->timeToMinutes($slots[$j]['start_time']);
                $endTime2 = $this->timeToMinutes($slots[$j]['end_time']);

                // Check if slots overlap, but allow adjacent slots (where one ends exactly when another begins)
                if ($startTime1 < $endTime2 && $startTime2 < $endTime1
                && !($startTime2 == $endTime1 || $startTime1 == $endTime2)) {
                    $validator->errors()->add(
                        "availabilities.{$slots[$j]['index']}.start_time",
                        "This time slot overlaps with another slot on the same day."
                    );
                }
            }
        }
    }

    /**
     * Convert time string to minutes.
     *
     * @param  string  $time
     * @return int
     */
    protected function timeToMinutes(string $time): int
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + $minutes;
    }
}
