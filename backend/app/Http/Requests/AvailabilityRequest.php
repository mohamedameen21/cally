<?php

namespace App\Http\Requests;

use App\DTOs\AvailabilityDTO;
use App\DTOs\AvailabilityCollectionDTO;
use App\Enums\DayEnum;
use App\Rules\ValidationTimeSlots;
use App\Rules\ValidateAvailabilityTimes;
use App\Rules\ValidateAvailabilityOverlaps;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AvailabilityRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'availabilities' => [
                'required',
                'array',
            ],
            'availabilities.*.day_of_week' => [
                'required',
                'string',
                Rule::in(DayEnum::getValues())
            ],
            'availabilities.*.start_time' => 'required|date_format:H:i:s',
            'availabilities.*.end_time' => [
                'required',
                'date_format:H:i:s',
            ],
            'availabilities.*.is_available' => 'boolean',
        ];
    }


    public function after(): array
    {
        return [
            new ValidateAvailabilityTimes,
            new ValidateAvailabilityOverlaps,
        ];
    }


    public function messages(): array
    {
        return [
            'availabilities.*.day_of_week.in' => 'The day of week must be one of: ' . implode(', ', DayEnum::getValues()),
            'availabilities.*.start_time.date_format' => 'The start time must be in the format HH:MM:SS.',
            'availabilities.*.end_time.date_format' => 'The end time must be in the format HH:MM:SS.',
        ];
    }

    public function toDTO()
    {
        $availabilities = [];
        
        // Use the request data directly instead of validated data
        // This ensures we get the sorted data after passedValidation() has run
        foreach ($this->input('availabilities') as $availability) {
            $availabilities[] = new AvailabilityDTO(
                day_of_week: $availability['day_of_week'],
                start_time: $availability['start_time'],
                end_time: $availability['end_time'],
                is_available: $availability['is_available'] ?? true
            );
        }
        
        return $availabilities;
    }

    public function passedValidation(): void
    {
        $availabilities = $this->validated('availabilities');

        // Group availabilities by day
        $groupedByDay = [];
        foreach ($availabilities as $availability) {
            $day = $availability['day_of_week'];
            $groupedByDay[$day][] = $availability;
        }

        // Sort time slots within each day by start time
        foreach ($groupedByDay as $day => &$slots) {
            usort($slots, function ($a, $b) {
                return $this->timeToMinutes($a['start_time']) <=> $this->timeToMinutes($b['start_time']);
            });
        }

        // Flatten the array back
        $sortedAvailabilities = [];
        foreach ($groupedByDay as $daySlots) {
            foreach ($daySlots as $slot) {
                $sortedAvailabilities[] = $slot;
            }
        }

        Log::info('sorted', $sortedAvailabilities);

        // Replace the original availabilities with the sorted ones
        $this->replace(['availabilities' => $sortedAvailabilities]);
    }


    protected function timeToMinutes(string $time): int
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + (int)$minutes;
    }
}
