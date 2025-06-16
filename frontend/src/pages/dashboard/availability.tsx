import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { availabilityService } from "@/services/availability";
import { X, Plus, Clock } from "lucide-react";

interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
}

interface DayAvailability {
  day_of_week: string;
  is_available: boolean;
  time_slots: TimeSlot[];
}

const dayNames = [
  { id: "monday", label: "M", fullName: "Monday" },
  { id: "tuesday", label: "T", fullName: "Tuesday" },
  { id: "wednesday", label: "W", fullName: "Wednesday" },
  { id: "thursday", label: "T", fullName: "Thursday" },
  { id: "friday", label: "F", fullName: "Friday" },
  { id: "saturday", label: "S", fullName: "Saturday" },
  { id: "sunday", label: "S", fullName: "Sunday" },
];

// Default time slot is 9:00-17:00
const defaultTimeSlot = { start_time: "09:00", end_time: "17:00" };

// Additional time slots for the + button
const additionalTimeSlots = [
  { start_time: "17:00", end_time: "23:00" },
  { start_time: "23:00", end_time: "09:00" },
];

const DashboardAvailabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeError, setTimeError] = useState<{
    dayIndex: number;
    message: string;
  } | null>(null);
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>(
    dayNames.map((day) => ({
      day_of_week: day.id,
      is_available: day.id !== "saturday" && day.id !== "sunday",
      time_slots: [{ ...defaultTimeSlot }],
    }))
  );

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setLoading(true);
        const data = await availabilityService.getAvailabilities();

        // Group availabilities by day
        const groupedByDay: Record<string, any[]> = {};
        data.forEach((item) => {
          if (!groupedByDay[item.day_of_week]) {
            groupedByDay[item.day_of_week] = [];
          }
          groupedByDay[item.day_of_week].push(item);
        });

        // Format data for our state
        const formattedAvailabilities = dayNames.map((day) => {
          const dayData = groupedByDay[day.id] || [];

          if (dayData.length === 0) {
            return {
              day_of_week: day.id,
              is_available: day.id !== "saturday" && day.id !== "sunday",
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

        setAvailabilities(formattedAvailabilities);
      } catch (error) {
        console.error("Failed to fetch availabilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, []);

  // Check if time slots overlap
  const checkForOverlaps = (dayIndex: number, slots: TimeSlot[]): boolean => {
    // Convert time strings to minutes for easier comparison
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const convertedSlots = slots.map((slot) => ({
      start: timeToMinutes(slot.start_time),
      end: timeToMinutes(slot.end_time),
    }));

    // Handle overnight slots (end time < start time)
    convertedSlots.forEach((slot) => {
      if (slot.end < slot.start) {
        slot.end += 24 * 60; // Add 24 hours in minutes
      }
    });

    // Check for overlaps
    for (let i = 0; i < convertedSlots.length; i++) {
      for (let j = i + 1; j < convertedSlots.length; j++) {
        const a = convertedSlots[i];
        const b = convertedSlots[j];

        // Check if slot a overlaps with slot b
        if (
          (a.start < b.end && a.end > b.start) ||
          (b.start < a.end && b.end > a.start)
        ) {
          setTimeError({
            dayIndex,
            message: `Time slots ${i + 1} and ${
              j + 1
            } overlap. Please adjust the times.`,
          });
          return true;
        }
      }
    }

    // No overlaps found
    if (timeError?.dayIndex === dayIndex) {
      setTimeError(null);
    }
    return false;
  };

  // Check if any day has overlapping time slots
  const hasAnyOverlaps = (): boolean => {
    for (let dayIndex = 0; dayIndex < availabilities.length; dayIndex++) {
      const day = availabilities[dayIndex];
      if (day.is_available) {
        // Use the existing checkForOverlaps function but don't set the error state
        // We just want to know if there's an overlap
        const timeToMinutes = (time: string): number => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const convertedSlots = day.time_slots.map(slot => ({
          start: timeToMinutes(slot.start_time),
          end: timeToMinutes(slot.end_time)
        }));

        // Handle overnight slots (end time < start time)
        convertedSlots.forEach(slot => {
          if (slot.end < slot.start) {
            slot.end += 24 * 60; // Add 24 hours in minutes
          }
        });

        // Check for overlaps
        for (let i = 0; i < convertedSlots.length; i++) {
          for (let j = i + 1; j < convertedSlots.length; j++) {
            const a = convertedSlots[i];
            const b = convertedSlots[j];

            // Check if slot a overlaps with slot b
            if ((a.start < b.end && a.end > b.start) || 
                (b.start < a.end && b.end > a.start)) {
              return true; // Found an overlap
            }
          }
        }
      }
    }
    return false; // No overlaps found
  };

  // Validate that end_time is not less than start_time
  const validateTimeOrder = (startTime: string, endTime: string): boolean => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    // If end time is less than start time, it could be an overnight slot
    // In this case, we consider it valid
    // Return true if valid (either end > start or it's an overnight slot)
    return endMinutes > startMinutes || endMinutes < startMinutes;
  };
  
  // Convert time string to minutes for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].time_slots[slotIndex][field] = value;
    
    const slot = newAvailabilities[dayIndex].time_slots[slotIndex];
    
    // Validate that end_time is not less than start_time (unless it's an overnight slot)
    if ((field === "end_time" && value === slot.start_time) || 
        (field === "start_time" && value === slot.end_time)) {
      // Start and end times cannot be the same
      setTimeError({
        dayIndex,
        message: `Start time and end time cannot be the same.`,
      });
      setAvailabilities(newAvailabilities);
      return;
    }
    
    // Check for time order validity
    if (!validateTimeOrder(slot.start_time, slot.end_time)) {
      setTimeError({
        dayIndex,
        message: `End time must be different from start time.`,
      });
      setAvailabilities(newAvailabilities);
      return;
    }
    
    // Check for overlaps after updating the time
    checkForOverlaps(dayIndex, newAvailabilities[dayIndex].time_slots);

    setAvailabilities(newAvailabilities);
  };

  const handleToggleAvailability = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].is_available =
      !newAvailabilities[dayIndex].is_available;
    setAvailabilities(newAvailabilities);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    const newAvailabilities = [...availabilities];
    // Get the next time slot from additionalTimeSlots based on current count
    const currentSlotCount = newAvailabilities[dayIndex].time_slots.length;
    const nextTimeSlotIndex =
      (currentSlotCount - 1) % additionalTimeSlots.length;
    const nextTimeSlot = additionalTimeSlots[nextTimeSlotIndex];
    
    // Add the new time slot
    newAvailabilities[dayIndex].time_slots.push({ ...nextTimeSlot });
    
    // Check for overlaps after adding the time slot
    checkForOverlaps(dayIndex, newAvailabilities[dayIndex].time_slots);
    
    // Validate the time order of the new slot
    const newSlotIndex = newAvailabilities[dayIndex].time_slots.length - 1;
    const newSlot = newAvailabilities[dayIndex].time_slots[newSlotIndex];
    
    if (!validateTimeOrder(newSlot.start_time, newSlot.end_time)) {
      setTimeError({
        dayIndex,
        message: `End time must be different from start time in the new slot.`,
      });
    }
    
    setAvailabilities(newAvailabilities);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[dayIndex].time_slots.splice(slotIndex, 1);
    if (newAvailabilities[dayIndex].time_slots.length === 0) {
      newAvailabilities[dayIndex].time_slots.push({ ...defaultTimeSlot });
    }
    setAvailabilities(newAvailabilities);
    // Clear any error when removing a time slot
    if (timeError?.dayIndex === dayIndex) {
      setTimeError(null);
    }
  };

  const handleSaveAvailabilities = async () => {
    // Check all days for overlaps before saving
    let hasOverlaps = false;
    availabilities.forEach((day, index) => {
      if (day.is_available && checkForOverlaps(index, day.time_slots)) {
        hasOverlaps = true;
      }
    });

    if (hasOverlaps) {
      alert("Please fix overlapping time slots before saving.");
      return;
    }

    try {
      setSaving(true);

      // Format data for API
      const formattedData = availabilities.flatMap((day) => {
        if (!day.is_available) {
          // If day is not available, create one record with is_available=false
          return [
            {
              day_of_week: day.day_of_week,
              start_time: "00:00",
              end_time: "00:00",
              is_available: false,
            },
          ];
        }

        // Otherwise, create a record for each time slot
        return day.time_slots.map((slot) => ({
          day_of_week: day.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
          is_available: true,
        }));
      });

      await availabilityService.updateAvailabilities(formattedData);
      alert("Availability updated successfully!");
    } catch (error) {
      console.error("Failed to save availabilities:", error);
      alert("Failed to update availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Availability Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="mb-4">Working hours (default)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availabilities.map((day, dayIndex) => (
                <div
                  key={day.day_of_week}
                  className="grid grid-cols-[200px_1fr] gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0"
                >
                  {/* Day column */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {dayNames.find((d) => d.id === day.day_of_week)?.fullName}
                    </span>
                    <Switch
                      checked={day.is_available}
                      onChange={() => handleToggleAvailability(dayIndex)}
                    />
                  </div>

                  {/* Time slots column */}
                  <div>
                    {day.is_available ? (
                      <div className="space-y-2">
                        {timeError?.dayIndex === dayIndex && (
                          <div className="text-red-500 text-sm mb-2">
                            {timeError.message}
                          </div>
                        )}
                        {day.time_slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-1 flex items-center gap-2">
                              <TimePicker
                                value={slot.start_time}
                                onChange={(value) =>
                                  handleTimeChange(
                                    dayIndex,
                                    slotIndex,
                                    "start_time",
                                    value
                                  )
                                }
                              />
                              <span>-</span>
                              <TimePicker
                                value={slot.end_time}
                                onChange={(value) =>
                                  handleTimeChange(
                                    dayIndex,
                                    slotIndex,
                                    "end_time",
                                    value
                                  )
                                }
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveTimeSlot(dayIndex, slotIndex)
                              }
                              disabled={day.time_slots.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => handleAddTimeSlot(dayIndex)}
                          disabled={timeError?.dayIndex === dayIndex || saving}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add time slot
                        </Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        Not available
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveAvailabilities} disabled={saving || hasAnyOverlaps() || timeError !== null}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAvailabilityPage;
