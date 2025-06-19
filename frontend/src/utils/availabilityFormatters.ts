import type { DayAvailability, DayName, ApiAvailability } from '@/types/availability';
import { defaultTimeSlot } from '@/constants/availability';

export function formatApiDataForState(data: any[], dayNames: DayName[]): DayAvailability[] {
  // Group availabilities by day
  const groupedByDay: Record<string, any[]> = {};
  data.forEach((item) => {
    if (!groupedByDay[item.day_of_week]) {
      groupedByDay[item.day_of_week] = [];
    }
    groupedByDay[item.day_of_week].push(item);
  });

  // Format data for our state
  return dayNames.map((day) => {
    const dayData = groupedByDay[day.id] || [];

    if (dayData.length === 0) {
      return {
        day_of_week: day.id,
        is_available: false, // Default to unavailable if no specific data from API
        time_slots: [{ ...defaultTimeSlot }],
      };
    }

    return {
      day_of_week: day.id,
      is_available: dayData[0].is_available,
      time_slots: dayData.map((slot) => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
      })),
    };
  });
}

export function formatStateDataForApi(availabilities: DayAvailability[]): ApiAvailability[] {
  return availabilities.flatMap((day) => {
    const isAvailable = day.is_available;
      
    if (!isAvailable) {
      // If day is not available, create one record with is_available=false
      return [
        {
          day_of_week: day.day_of_week,
          start_time: "00:00:00",
          end_time: "00:00:00",
          is_available: false,
        },
      ];
    }

    // Otherwise, create a record for each time slot
    return day.time_slots.map((slot) => {
      // Ensure time format includes seconds (HH:MM:SS)
      const start_time = slot.start_time.includes(':') && slot.start_time.split(':').length === 2 
        ? `${slot.start_time}:00` 
        : slot.start_time;
      const end_time = slot.end_time.includes(':') && slot.end_time.split(':').length === 2 
        ? `${slot.end_time}:00` 
        : slot.end_time;

      return {
        day_of_week: day.day_of_week,
        start_time,
        end_time,
        is_available: true,
      };
    });
  });
}

export function initializeAvailabilities(dayNames: DayName[]): DayAvailability[] {
  return dayNames.map((day) => ({
    day_of_week: day.id,
    is_available: false, // Default all days to unavailable initially
    time_slots: [{ ...defaultTimeSlot }],
  }));
}