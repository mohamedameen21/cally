<?php

namespace App\Http\Requests;

use App\Enums\DayEnum;
use App\Rules\ValidationTimeSlots;
use App\Rules\ValidateAvailabilityTimes;
use App\Rules\ValidateAvailabilityOverlaps;
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
            'availabilities.*.start_time' => 'required|date_format:H:i',
            'availabilities.*.end_time' => [
                'required',
                'date_format:H:i',
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
            'availabilities.*.start_time.date_format' => 'The start time must be in the format HH:MM.',
            'availabilities.*.end_time.date_format' => 'The end time must be in the format HH:MM.',
        ];
    }
}
