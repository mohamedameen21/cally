import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TimeSlotItem } from './TimeSlotItem';
import type { DayAvailability as DayAvailabilityType } from '@/types/availability';
import type { TimeError } from '@/types/availability';

interface DayAvailabilityProps {
  day: DayAvailabilityType;
  dayIndex: number;
  dayName: string;
  timeError: TimeError | null;
  saving: boolean;
  onToggleAvailability: (dayIndex: number) => void;
  onTimeChange: (dayIndex: number, slotIndex: number, field: 'start_time' | 'end_time', value: string) => void;
  onAddTimeSlot: (dayIndex: number) => void;
  onRemoveTimeSlot: (dayIndex: number, slotIndex: number) => void;
}

export const DayAvailabilityComponent: React.FC<DayAvailabilityProps> = ({
  day,
  dayIndex,
  dayName,
  timeError,
  saving,
  onToggleAvailability,
  onTimeChange,
  onAddTimeSlot,
  onRemoveTimeSlot
}) => {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 items-start border-b pb-4 last:border-b-0 last:pb-0">
      {/* Day column */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{dayName}</span>
        <Switch
          checked={day.is_available}
          onChange={() => onToggleAvailability(dayIndex)}
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
              <TimeSlotItem
                key={slotIndex}
                slot={slot}
                slotIndex={slotIndex}
                canRemove={day.time_slots.length > 1}
                onTimeChange={(slotIndex, field, value) => 
                  onTimeChange(dayIndex, slotIndex, field, value)
                }
                onRemove={(slotIndex) => 
                  onRemoveTimeSlot(dayIndex, slotIndex)
                }
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => onAddTimeSlot(dayIndex)}
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
  );
};