import { useState, useEffect } from "react";
import { availabilityService } from "@/services/availability";
import type { DayAvailability, DayName } from "@/types/availability";
import { timeUtils } from "@/utils/timeUtils";
import { defaultTimeSlot, additionalTimeSlots } from "@/constants/availability";
import { useAvailabilityValidation } from "@/hooks/useAvailabilityValidation";
import {
  formatApiDataForState,
  formatStateDataForApi,
  initializeAvailabilities,
} from "@/utils/availabilityFormatters";

interface UseAvailabilityProps {
  dayNames: DayName[];
}

interface UseAvailabilityState {
  loading: boolean;
  saving: boolean;
  sortTimerDayIndex: number | null;
  availabilities: DayAvailability[];
}

/**
 * Custom hook for managing user availability
 * Handles fetching, updating, and validating time slots for each day of the week
 */
export const useAvailability = ({ dayNames }: UseAvailabilityProps) => {
  const {
    timeError,
    validateTimeOrder,
    checkForOverlaps,
    hasAnyOverlaps,
    validateTimeChange,
    clearErrorForDay,
  } = useAvailabilityValidation();

  const [state, setState] = useState<UseAvailabilityState>({
    loading: false,
    saving: false,
    sortTimerDayIndex: null,
    availabilities: initializeAvailabilities(dayNames),
  });

  const { loading, saving, sortTimerDayIndex, availabilities } = state;

  const updateState = (newState: Partial<UseAvailabilityState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    let sortingTimer: NodeJS.Timeout | null = null;

    if (sortTimerDayIndex !== null) {
      // Capture the current availabilities state when the timer is set
      const currentAvailabilities = [...availabilities];

      sortingTimer = setTimeout(() => {
        // Sort the time slots for the specific day
        currentAvailabilities[sortTimerDayIndex].time_slots =
          timeUtils.sortTimeSlots(
            currentAvailabilities[sortTimerDayIndex].time_slots
          );

        updateState({
          availabilities: currentAvailabilities,
          sortTimerDayIndex: null,
        });
      }, 3000);
    }

    return () => {
      if (sortingTimer) {
        clearTimeout(sortingTimer);
      }
    };
  }, [sortTimerDayIndex, availabilities]);

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      updateState({ loading: true });
      const data = await availabilityService.getAvailabilities();
      const formattedAvailabilities = formatApiDataForState(data?.availabilities, dayNames);
      updateState({ availabilities: formattedAvailabilities });
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
    } finally {
      updateState({ loading: false });
    }
  };

  const checkAllDaysForOverlaps = (): boolean => {
    return hasAnyOverlaps(availabilities);
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].time_slots[slotIndex][field] = value;

    // Update state with new availabilities
    updateState({
      availabilities: newAvailabilities,
      sortTimerDayIndex: dayIndex, // Trigger delayed sorting
    });

    // Validate the time change using the validation hook
    validateTimeChange(
      dayIndex,
      slotIndex,
      newAvailabilities[dayIndex].time_slots
    );
  };

  const handleToggleAvailability = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].is_available =
      !newAvailabilities[dayIndex].is_available;
    updateState({ availabilities: newAvailabilities });
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    const currentSlotCount = newAvailabilities[dayIndex].time_slots.length;

    // Get the next time slot from additionalTimeSlots based on current count
    const nextTimeSlotIndex =
      (currentSlotCount - 1) % additionalTimeSlots.length;
    const nextTimeSlot = additionalTimeSlots[nextTimeSlotIndex];

    // Add the new time slot
    newAvailabilities[dayIndex].time_slots.push({ ...nextTimeSlot });

    // Update state with new availabilities
    updateState({
      availabilities: newAvailabilities,
      sortTimerDayIndex: dayIndex, // Trigger delayed sorting
    });

    // Validate the new slot using the validation hook
    const newSlotIndex = newAvailabilities[dayIndex].time_slots.length - 1;
    validateTimeOrder(
      newAvailabilities[dayIndex].time_slots[newSlotIndex],
      dayIndex
    );
    checkForOverlaps(dayIndex, newAvailabilities[dayIndex].time_slots);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].time_slots.splice(slotIndex, 1);

    // Ensure at least one time slot exists
    if (newAvailabilities[dayIndex].time_slots.length === 0) {
      newAvailabilities[dayIndex].time_slots.push({ ...defaultTimeSlot });
    }

    // Update state with new availabilities
    updateState({
      availabilities: newAvailabilities,
    });

    // Clear any error for this day
    clearErrorForDay(dayIndex);

    // Check for overlaps after removing the time slot
    if (newAvailabilities[dayIndex].time_slots.length > 1) {
      checkForOverlaps(dayIndex, newAvailabilities[dayIndex].time_slots);
    }
  };

  const handleSaveAvailabilities = async () => {
    // Check all days for overlaps before saving
    if (checkAllDaysForOverlaps()) {
      alert("Please fix overlapping time slots before saving.");
      return;
    }

    try {
      updateState({ saving: true });
      const formattedData = formatStateDataForApi(availabilities);
      await availabilityService.updateAvailabilities(formattedData);
      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Failed to save availabilities:", error);
      alert("Failed to update availability. Please try again.");
    } finally {
      updateState({ saving: false });
    }
  };

  return {
    loading,
    saving,
    timeError,
    availabilities,
    fetchAvailabilities,
    handleTimeChange,
    handleToggleAvailability,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleSaveAvailabilities,
    hasAnyOverlaps: checkAllDaysForOverlaps,
  };
};
