<?php

namespace App\Http\Service;
use App\DTOs\AvailabilityDTO;
use App\Http\Resources\AvailabilityCollection;
use App\Http\Resources\AvailabilityResource;
use App\Models\User;

class AvailabilityService
{

    public function updateAvailabilities(User $user, array $availabilityDTOs)
    {
        $user->availabilities()->delete();

        $availabilitiesData = array_map(function (AvailabilityDTO $dto) use ($user) {
            return [
                'user_id' => $user->id,
                'day_of_week' => $dto->day_of_week,
                'start_time' => $dto->start_time,
                'end_time' => $dto->end_time,
                'is_available' => $dto->is_available,
            ];
        }, $availabilityDTOs);

        $availabilities = $user->availabilities()->createMany($availabilitiesData);

        return AvailabilityResource::collection($availabilities);
    }
}
