import React from 'react';
import { TimePicker } from '@/components/ui/time-picker';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { TimeSlot } from '@/types/availability.ts';

interface TimeSlotItemProps {
  slot: TimeSlot;
  slotIndex: number;
  canRemove: boolean;
  onTimeChange: (slotIndex: number, field: 'start_time' | 'end_time', value: string) => void;
  onRemove: (slotIndex: number) => void;
}

export const TimeSlotItem: React.FC<TimeSlotItemProps> = ({
  slot,
  slotIndex,
  canRemove,
  onTimeChange,
  onRemove
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        <TimePicker
          value={slot.start_time}
          onChange={(value) => onTimeChange(slotIndex, 'start_time', value)}
        />
        <span>-</span>
        <TimePicker
          value={slot.end_time}
          onChange={(value) => onTimeChange(slotIndex, 'end_time', value)}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(slotIndex)}
        disabled={!canRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};