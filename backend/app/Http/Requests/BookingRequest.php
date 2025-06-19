<?php

namespace App\Http\Requests;

use App\DTOs\BookingDTO;
use App\Rules\BookingTimeAfterNow;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class BookingRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|exists:users,username',
            'booking_time' => ['required', 'date', new BookingTimeAfterNow()],
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'The username field is required.',
            'username.exists' => 'The selected username does not exist.',
            'booking_time.required' => 'The booking time is required.',
            'booking_time.date' => 'The booking time must be a valid datetime.',
            'booking_time.after' => 'The booking time must be at least 15 minutes in the future.',
            'notes.max' => 'The notes may not be greater than 1000 characters.',
        ];
    }

    public function toDTO(): BookingDTO
    {
        $validated = $this->validated();
        
        return new BookingDTO(
            username: $validated['username'],
            booking_time: $validated['booking_time'],
            notes: $validated['notes'] ?? null
        );
    }
}