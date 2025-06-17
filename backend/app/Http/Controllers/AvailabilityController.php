<?php

namespace App\Http\Controllers;

use App\Enums\DayEnum;
use App\Http\Requests\AvailabilityRequest;
use App\Models\Availability;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AvailabilityController extends Controller
{
    /**
     * Get the authenticated user's availabilities.
     */
    public function index(): JsonResponse
    {
        $availabilities = Auth::user()->availabilities;
        
        return response()->json([
            'success' => true,
            'data' => $availabilities,
        ]);
    }

    /**
     * Store or update the user's availabilities.
     */
    public function store(AvailabilityRequest $request): JsonResponse
    {
        // Validation is handled by the AvailabilityRequest class

        $user = Auth::user();
        
        // Delete existing availabilities
        $user->availabilities()->delete();
        
        // Create new availabilities
        foreach ($request->availabilities as $availability) {
            $user->availabilities()->create([
                'day_of_week' => $availability['day_of_week'],
                'start_time' => $availability['start_time'],
                'end_time' => $availability['end_time'],
                'is_available' => $availability['is_available'] ?? true,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $user->availabilities()->get(),
            'message' => 'Availabilities updated successfully',
        ]);
    }
}