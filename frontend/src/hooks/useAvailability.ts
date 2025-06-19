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
import toast from "react-hot-toast";

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
      toast.success("Availability loaded successfully!");
    } catch (error) {
      console.error("Failed to fetch availabilities:", error);
      toast.error("Failed to load availability data. Please try again.");
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
    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
      toast.error("Please enter a valid time format (HH:MM)");
      return;
    }

    const newAvailabilities = [...availabilities];
    const previousValue = newAvailabilities[dayIndex].time_slots[slotIndex][field];
    newAvailabilities[dayIndex].time_slots[slotIndex][field] = value;

    // Update state with new availabilities
    updateState({
      availabilities: newAvailabilities,
      sortTimerDayIndex: dayIndex, // Trigger delayed sorting
    });

    // Validate the time change using the validation hook
    const isValid = validateTimeChange(
      dayIndex,
      slotIndex,
      newAvailabilities[dayIndex].time_slots
    );

    // If validation failed, optionally revert the change
    // (This is handled by the validation hook showing error messages)
  };

  const handleToggleAvailability = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    const wasAvailable = newAvailabilities[dayIndex].is_available;
    newAvailabilities[dayIndex].is_available = !wasAvailable;
    
    // Clear any errors for this day when toggling
    clearErrorForDay(dayIndex);
    
    updateState({ availabilities: newAvailabilities });
    
    // Provide feedback to user
    const dayName = dayNames[dayIndex]?.fullName || `Day ${dayIndex + 1}`;
    if (newAvailabilities[dayIndex].is_available) {
      toast.success(`${dayName} is now available`);
    } else {
      toast.info(`${dayName} is now unavailable`);
    }
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    const currentSlotCount = newAvailabilities[dayIndex].time_slots.length;

    // Check if day is available before adding time slot
    if (!newAvailabilities[dayIndex].is_available) {
      toast.error("Please enable availability for this day before adding time slots.");
      return;
    }

    // Limit maximum number of time slots per day
    const maxSlotsPerDay = 5;
    if (currentSlotCount >= maxSlotsPerDay) {
      toast.error(`Maximum ${maxSlotsPerDay} time slots allowed per day.`);
      return;
    }

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
    const isValidOrder = validateTimeOrder(
      newAvailabilities[dayIndex].time_slots[newSlotIndex],
      dayIndex
    );
    const hasOverlaps = checkForOverlaps(dayIndex, newAvailabilities[dayIndex].time_slots);

    // Show success message if no validation errors
    if (isValidOrder && !hasOverlaps) {
      const dayName = dayNames[dayIndex]?.fullName || `Day ${dayIndex + 1}`;
      toast.success(`Time slot added to ${dayName}`);
    }
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailabilities = [...availabilities];
    const currentSlots = newAvailabilities[dayIndex].time_slots;
    
    // Prevent removing the last time slot if day is available
    if (currentSlots.length === 1 && newAvailabilities[dayIndex].is_available) {
      toast.error("Cannot remove the last time slot. Disable availability for this day instead.");
      return;
    }

    // Remove the time slot
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

    // Show success message
    const dayName = dayNames[dayIndex]?.fullName || `Day ${dayIndex + 1}`;
    toast.success(`Time slot removed from ${dayName}`);
  };

  const handleSaveAvailabilities = async () => {
    // Check all days for overlaps before saving
    if (checkAllDaysForOverlaps()) {
      toast.error("Please fix overlapping time slots before saving.");
      return;
    }

    // Validate that all time slots have proper time order
    let hasValidationErrors = false;
    availabilities.forEach((day, dayIndex) => {
      if (day.is_available) {
        day.time_slots.forEach((slot) => {
          if (!timeUtils.validateTimeOrder(slot.start_time, slot.end_time)) {
            toast.error(`Invalid time order on ${dayNames[dayIndex]?.fullName || `Day ${dayIndex + 1}`}. End time must be after start time.`);
            hasValidationErrors = true;
          }
        });
      }
    });

    if (hasValidationErrors) {
      return;
    }

    try {
      updateState({ saving: true });
      toast.loading("Saving availability...", { id: "save-availability" });
      const formattedData = formatStateDataForApi(availabilities);
      await availabilityService.updateAvailabilities(formattedData);
      toast.success("Availability updated successfully!", { id: "save-availability" });
    } catch (error) {
      console.error("Failed to save availabilities:", error);
      toast.error("Unable to update availability. Please try again.", { id: "save-availability" });
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
