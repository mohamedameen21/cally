import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { DayAvailability } from '@/types/availability';
import { formatTimeForDisplay } from '@/utils/timeUtils';

interface PublicDayAvailabilityProps {
  day: DayAvailability;
  dayName: string;
}

export const PublicDayAvailability: React.FC<PublicDayAvailabilityProps> = ({
  day,
  dayName,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{dayName}</h3>
          <div className="text-sm font-medium">
            {day.is_available ? 'Available' : 'Not Available'}
          </div>
        </div>

        {day.is_available && day.time_slots.length > 0 && (
          <div className="mt-4 space-y-2">
            {day.time_slots.map((slot, index) => (
              <div key={index} className="flex items-center text-sm bg-muted p-2 rounded-md">
                <div className="flex-1">
                  {formatTimeForDisplay(slot.start_time)} - {formatTimeForDisplay(slot.end_time)}
                </div>
              </div>
            ))}
          </div>
        )}

        {!day.is_available && (
          <div className="mt-4 text-sm text-muted-foreground">
            Not available on this day
          </div>
        )}
      </CardContent>
    </Card>
  );
};