<?php

namespace App\Http\Requests;

use App\DTOs\MonthAvailabilityDTO;

class MonthAvailabilityRequest extends BaseApiRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        return [
            'year' => 'sometimes|integer|digits:4|min:2000|max:' . (date('Y') + 10),
            'month' => 'sometimes|integer|min:1|max:12',
            'username' => 'required|string|exists:users,username',
        ];
    }

    public function messages(): array
    {
        return [
            'year.integer' => 'The year must be a valid number.',
            'year.digits' => 'The year must be a 4-digit number.',
            'year.min' => 'The year must be at least 2000.',
            'year.max' => 'The year cannot be more than 10 years in the future.',
            'month.integer' => 'The month must be a valid number.',
            'month.min' => 'The month must be between 1 and 12.',
            'month.max' => 'The month must be between 1 and 12.',
            'username.required' => 'The username is required.',
            'username.string' => 'The username must be a string.',
            'username.exists' => 'The specified username does not exist.',
        ];
    }

    public function toDTO(): MonthAvailabilityDTO
    {
        $validated = $this->validated();

        return new MonthAvailabilityDTO(
            year: $validated['year'] ?? (int)date('Y'),
            month: $validated['month'] ?? (int)date('m'),
            username: $validated['username']
        );
    }
}
