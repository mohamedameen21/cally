import { useState } from 'react';
import type { TimeSlot, TimeError } from '@/types/availability';
import { timeUtils } from '@/utils/timeUtils';

/**
 * Custom hook for validating availability time slots
 * Handles validation of time slots, checking for overlaps, and managing error states
 */
export const useAvailabilityValidation = () => {
  // State for tracking validation errors
  const [timeError, setTimeError] = useState<TimeError | null>(null);

  /**
   * Convert time slots to minutes for easier comparison
   */
  const convertSlotsToMinutes = (slots: TimeSlot[]) => {
    return slots
      .filter(slot => {
        // Filter out slots with invalid time values
        if (!slot.start_time || !slot.end_time) {
          console.warn('Skipping time slot with missing time values:', slot);
          return false;
        }
        return true;
      })
      .map(slot => ({
        start: timeUtils.timeToMinutes(slot.start_time),
        end: timeUtils.timeToMinutes(slot.end_time)
      }));
  };

  /**
   * Validate time order for a single time slot
   * @returns true if valid, false if invalid
   */
  const validateTimeOrder = (slot: TimeSlot, dayIndex: number): boolean => {
    if (!timeUtils.validateTimeOrder(slot.start_time, slot.end_time)) {
      const errorMessage = `End time must be after start time.`;
      setTimeError({
        dayIndex,
        message: errorMessage,
      });
      toast.error(errorMessage);
      return false;
    }
    return true;
  };

  /**
   * Check if time slots overlap for a specific day
   * @returns true if overlaps exist, false otherwise
   */
  const checkForOverlaps = (dayIndex: number, slots: TimeSlot[]): boolean => {
    // Sort slots by start time before checking for overlaps
    const sortedSlots = timeUtils.sortTimeSlots(slots);
    const convertedSlots = convertSlotsToMinutes(sortedSlots);

    // Check for overlaps
    for (let i = 0; i < convertedSlots.length; i++) {
      for (let j = i + 1; j < convertedSlots.length; j++) {
        const a = convertedSlots[i];
        const b = convertedSlots[j];

        // Check if slot a overlaps with slot b
        if (timeUtils.doTimeSlotsOverlap(a, b)) {
          const errorMessage = `Time slots ${i + 1} and ${j + 1} overlap. Please adjust the times.`;
          setTimeError({
            dayIndex,
            message: errorMessage,
          });
          toast.error(errorMessage);
          return true;
        }
      }
    }

    // No overlaps found, clear error if it was for this day
    if (timeError?.dayIndex === dayIndex) {
      setTimeError(null);
    }
    return false;
  };

  /**
   * Check if a specific day has overlapping time slots
   * @returns true if overlaps exist, false otherwise
   */
  const hasOverlapsForDay = (timeSlots: TimeSlot[]): boolean => {
    // Sort slots by start time before checking for overlaps
    const sortedSlots = timeUtils.sortTimeSlots(timeSlots);
    const convertedSlots = convertSlotsToMinutes(sortedSlots);

    // Check for overlaps
    for (let i = 0; i < convertedSlots.length; i++) {
      for (let j = i + 1; j < convertedSlots.length; j++) {
        const a = convertedSlots[i];
        const b = convertedSlots[j];

        // Check if slot a overlaps with slot b
        if (timeUtils.doTimeSlotsOverlap(a, b)) {
          return true; // Found an overlap
        }
      }
    }
    return false;
  };

  /**
   * Check if any day has overlapping time slots
   * @returns true if any day has overlaps, false otherwise
   */
  const hasAnyOverlaps = (availabilities: { is_available: boolean; time_slots: TimeSlot[] }[]): boolean => {
    for (let dayIndex = 0; dayIndex < availabilities.length; dayIndex++) {
      const day = availabilities[dayIndex];
      if (day.is_available && hasOverlapsForDay(day.time_slots)) {
        return true;
      }
    }
    return false; // No overlaps found
  };

  /**
   * Validate a time change for a specific slot
   * @returns true if valid, false if invalid
   */
  const validateTimeChange = (
    dayIndex: number,
    slotIndex: number,
    timeSlots: TimeSlot[],
  ): boolean => {
    // Validate time order for the modified slot
    const slot = timeSlots[slotIndex];
    if (!validateTimeOrder(slot, dayIndex)) {
      return false;
    }
    
    // Check for overlaps after time change
    return !checkForOverlaps(dayIndex, timeSlots);
  };

  /**
   * Clear time error for a specific day
   */
  const clearErrorForDay = (dayIndex: number) => {
    if (timeError?.dayIndex === dayIndex) {
      setTimeError(null);
    }
  };

  /**
   * Reset all validation errors
   */
  const resetErrors = () => {
    setTimeError(null);
  };

  return {
    timeError,
    validateTimeOrder,
    checkForOverlaps,
    hasOverlapsForDay,
    hasAnyOverlaps,
    validateTimeChange,
    clearErrorForDay,
    resetErrors,
  };
};