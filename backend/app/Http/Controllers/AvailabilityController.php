<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\AvailabilityRequest;
use App\Http\Resources\AvailabilityResource;
use App\Http\Service\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AvailabilityController extends Controller
{
    protected $availabilityService;

    public function __construct(AvailabilityService $availabilityService)
    {
        $this->availabilityService = $availabilityService;
    }


    public function index(): JsonResponse
    {
        $availabilities = Auth::user()->availabilities;

        return ApiResponse::success([
            'availabilities' => AvailabilityResource::collection($availabilities),
        ]);
    }

    public function store(AvailabilityRequest $request): JsonResponse
    {
        $availabilityDTOs = $request->toDTO();
        Log::info('availabilities', $availabilityDTOs);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            $availabilityCollection = $this->availabilityService->updateAvailabilities($user, $availabilityDTOs);
            DB::commit();

            return ApiResponse::success([
                'availabilities' => $availabilityCollection,
            ], 'Availabilities updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return ApiResponse::errorWithLog('unable to update the availabilities', $e, 500);
        }
    }
}
