import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DayAvailabilityComponent } from "@/components/availability/DayAvailability";
import { ShareAvailabilityLink } from "@/components/availability/ShareAvailabilityLink";
import { useAvailability } from "@/hooks/useAvailability";
import { useAuth } from "@/contexts/AuthContext";
import { dayNames } from "@/constants/availability";

const DashboardAvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const {
    saving,
    timeError,
    availabilities,
    handleTimeChange,
    handleToggleAvailability,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleSaveAvailabilities,
    hasAnyOverlaps
  } = useAvailability({ dayNames });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Availability Settings</h1>
      
      {user&& user.username && <ShareAvailabilityLink username={user.username} />}

      <Card>
        <CardHeader>
          <CardTitle className="mb-4">Working hours (default)</CardTitle>

        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilities.map((day, dayIndex) => (
              <DayAvailabilityComponent
                key={day.day_of_week}
                day={day}
                dayIndex={dayIndex}
                dayName={dayNames.find((d) => d.id === day.day_of_week)?.fullName || ''}
                timeError={timeError}
                saving={saving}
                onToggleAvailability={handleToggleAvailability}
                onTimeChange={handleTimeChange}
                onAddTimeSlot={handleAddTimeSlot}
                onRemoveTimeSlot={handleRemoveTimeSlot}
              />
            ))}
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSaveAvailabilities} 
                disabled={saving || hasAnyOverlaps() || timeError !== null}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAvailabilityPage;
