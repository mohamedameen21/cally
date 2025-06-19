/**
 * Constants for availability management
 */

import type { DayName, TimeSlot } from '@/types/availability.ts';

export const dayNames: DayName[] = [
  { id: "monday", label: "M", fullName: "Monday" },
  { id: "tuesday", label: "T", fullName: "Tuesday" },
  { id: "wednesday", label: "W", fullName: "Wednesday" },
  { id: "thursday", label: "T", fullName: "Thursday" },
  { id: "friday", label: "F", fullName: "Friday" },
  { id: "saturday", label: "S", fullName: "Saturday" },
  { id: "sunday", label: "S", fullName: "Sunday" },
];

// Default time slot is 9:00-17:00
export const defaultTimeSlot: TimeSlot = { start_time: "09:00:00", end_time: "17:00:00" };

// Additional time slots for the + button
export const additionalTimeSlots: TimeSlot[] = [
  { start_time: "17:00:00", end_time: "23:00:00" },
  { start_time: "23:00:00", end_time: "23:59:00" },
];