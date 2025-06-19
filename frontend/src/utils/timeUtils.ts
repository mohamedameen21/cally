/**
 * Utility functions for time manipulation and validation
 */

// Helper function to convert time string to minutes for easier comparison
const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== 'string') {
    console.error('timeToMinutes received invalid input:', time);
    return 0;
  }
  
  const parts = time.split(":");
  if (parts.length < 2) {
    console.error('timeToMinutes received invalid time format:', time);
    return 0;
  }
  
  const [hours, minutes] = parts.map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    console.error('timeToMinutes received non-numeric time parts:', time);
    return 0;
  }
  
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

// Format time string for display (convert from 24h to 12h format)
const formatTimeForDisplay = (timeString: string): string => {
  // Handle cases where timeString might include seconds
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1];
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${displayHours}:${minutes} ${period}`;
};

export const timeUtils = {
  timeToMinutes,
  validateTimeOrder,
  sortTimeSlots,
  doTimeSlotsOverlap
};

export { formatTimeForDisplay };