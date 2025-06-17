/**
 * Utility functions for time manipulation and validation
 */

// Helper function to convert time string to minutes for easier comparison
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Validate that end time is after start time
const validateTimeOrder = (startTime: string, endTime: string): boolean => {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
};

// Sort time slots by start time and then by end time
const sortTimeSlots = <T extends { start_time: string; end_time: string }>(
  slots: T[]
): T[] => {
  return [...slots].sort((a, b) => {
    const aStartMinutes = timeToMinutes(a.start_time);
    const bStartMinutes = timeToMinutes(b.start_time);
    
    // First sort by start time
    if (aStartMinutes !== bStartMinutes) {
      return aStartMinutes - bStartMinutes;
    }
    
    // If start times are equal, sort by end time
    const aEndMinutes = timeToMinutes(a.end_time);
    const bEndMinutes = timeToMinutes(b.end_time);
    return aEndMinutes - bEndMinutes;
  });
};

// Check if two time slots overlap
const doTimeSlotsOverlap = (
  slotA: { start: number; end: number },
  slotB: { start: number; end: number }
): boolean => {
  return (
    (slotA.start < slotB.end && slotA.end > slotB.start) ||
    (slotB.start < slotA.end && slotB.end > slotA.start)
  );
};

export const timeUtils = {
  timeToMinutes,
  validateTimeOrder,
  sortTimeSlots,
  doTimeSlotsOverlap
};