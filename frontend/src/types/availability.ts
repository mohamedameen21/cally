/**
 * Type definitions for availability management
 */

export interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
}

export interface DayAvailability {
  day_of_week: string;
  is_available: boolean;
  time_slots: TimeSlot[];
}

export interface DayName {
  id: string;
  label: string;
  fullName: string;
}

export interface TimeError {
  dayIndex: number;
  message: string;
}

export interface ApiAvailability {
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}