<?php

namespace App\Rules;

use Illuminate\Validation\Validator;

class ValidateAvailabilityOverlaps
{

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

    protected function checkOverlapsInDay(array $slots, Validator $validator): void
    {

        // Filter out unavailable slots
        $availableSlots = array_filter($slots, function($slot) {
            return $slot['is_available'] ?? true;
        });

        // Re-index array after filtering
        $availableSlots = array_values($availableSlots);
        $availableCount = count($availableSlots);

        if ($availableCount < 2) {
            return;
        }

        // Initialize with the first slot's end time
        $lastEndTime = $this->timeToMinutes($availableSlots[0]['end_time']);

        for ($i = 1; $i < $availableCount; $i++) {
            $currentStartTime = $this->timeToMinutes($availableSlots[$i]['start_time']);

            // If current slot starts before the last slot ends (and they're not adjacent),
            // we have an overlap
            if ($currentStartTime < $lastEndTime && $currentStartTime != $lastEndTime) {
                $validator->errors()->add(
                    "availabilities.{$availableSlots[$i]['index']}.start_time",
                    "This time slot overlaps with another slot on the same day."
                );
                return;
            }

            // Update the last end time if the current end time is later
            $currentEndTime = $this->timeToMinutes($availableSlots[$i]['end_time']);
            $lastEndTime = max($lastEndTime, $currentEndTime);
        }
    }


    protected function timeToMinutes(string $time): int
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + (int)$minutes;
    }
}
