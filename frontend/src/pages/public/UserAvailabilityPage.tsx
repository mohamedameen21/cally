import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/lib/api/axios';
import { formatTimeForDisplay } from '@/utils/timeUtils';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { BookingForm, BookingSuccess } from '@/components/booking';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface UserData {
  id: number;
  name: string;
  username: string;
}

interface DayData {
  date: string;
  is_available: boolean;
  time_slots: string[]; // Array of time strings like ["09:00:00", "09:30:00"]
}

// API Response structure matching the provided JSON
interface ApiMonthResponse {
  success: boolean;
  message: string | null;
  data: {
    user: UserData;
    available_time_slots: DayData[];
  };
}

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayData: DayData | null;
}

interface GeneratedTimeSlot {
  time: string;
  displayTime: string;
}

type BookingStep = 'calendar' | 'booking-form' | 'booking-success';

interface BookingState {
  step: BookingStep;
  selectedTimeSlot: GeneratedTimeSlot | null;
  guestEmail: string;
}

// ============================================================================
// Custom Hooks
// ============================================================================

const useUserAvailability = (username: string | undefined, selectedDate: Date) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [monthData, setMonthData] = useState<DayData[]>([]);

  const fetchUserAvailability = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      setError(null);
      
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      
      const response = await axiosInstance.get<ApiMonthResponse>('/availabilities/month', {
        params: { year, month, username }
      });
      
      console.log('API Response:', response.data);
      
      // Handle different possible response structures
      if (response.data?.data) {
        // Standard API response with nested data
        setUserData(response.data.data.user);
        setMonthData(response.data.data.available_time_slots || []);
      } else if (response.data?.user) {
        // Direct response structure
        setUserData(response.data.user);
        setMonthData(response.data.available_time_slots || []);
      } else {
        // Fallback - log the structure and throw error
        console.error('Unexpected API response structure:', response.data);
        throw new Error('Invalid API response structure');
      }
      
    } catch (err: any) {
      console.error('Failed to fetch user availability:', err);
      setError(err.response?.data?.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, [username, selectedDate.getFullYear(), selectedDate.getMonth()]);

  useEffect(() => {
    fetchUserAvailability();
  }, [fetchUserAvailability]);

  return { loading, error, userData, monthData, refetch: fetchUserAvailability };
};

const useCalendarNavigation = (initialDate: Date = new Date()) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const goToPreviousMonth = useCallback(() => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  }, []);

  const selectDay = useCallback((date: Date, dayData: DayData | null) => {
    if (!dayData?.is_available) return;
    setSelectedDate(date);
    setSelectedDay(dayData);
  }, []);

  const resetSelectedDay = useCallback(() => {
    setSelectedDay(null);
  }, []);

  return {
    selectedDate,
    selectedDay,
    goToPreviousMonth,
    goToNextMonth,
    selectDay,
    resetSelectedDay
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateCalendarDays = (selectedDate: Date, monthData: DayData[]): CalendarDay[] => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  
  // Get the first Monday of the calendar grid
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  startDate.setDate(firstDay.getDate() - daysToSubtract);
  
  const days: CalendarDay[] = [];
  const currentDate = new Date(startDate);
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = currentDate.getMonth() === month;
    const isToday = currentDate.toDateString() === today.toDateString();
    const dateString = formatDateString(currentDate);
    
    // Find matching day data
    const dayData = monthData.find(day => day.date === dateString) || null;
    
    days.push({
      date: new Date(currentDate),
      dayOfMonth: isCurrentMonth ? currentDate.getDate() : 0,
      isCurrentMonth,
      isToday,
      dayData
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

const generateTimeSlots = (selectedDay: DayData | null): GeneratedTimeSlot[] => {
  if (!selectedDay?.is_available || !selectedDay.time_slots) {
    return [];
  }

  // Handle both array and object formats for time_slots
  let timeSlots: string[];
  
  if (Array.isArray(selectedDay.time_slots)) {
    timeSlots = selectedDay.time_slots;
  } else if (typeof selectedDay.time_slots === 'object' && selectedDay.time_slots !== null) {
    // Convert object with numeric keys to array of values
    timeSlots = Object.values(selectedDay.time_slots);
    console.log('Converted time_slots object to array:', timeSlots);
  } else {
    console.error('time_slots is neither an array nor an object:', selectedDay.time_slots);
    return [];
  }

  const slots: GeneratedTimeSlot[] = [];
  
  timeSlots.forEach(timeSlot => {
    // Ensure timeSlot is a string
    if (typeof timeSlot !== 'string') {
      console.error('timeSlot is not a string:', timeSlot);
      return;
    }
    
    // timeSlot is already a string like "09:00:00" in local timezone
    const timeString = timeSlot.substring(0, 5); // Convert "09:00:00" to "09:00"
    slots.push({
      time: timeString,
      displayTime: formatTimeForDisplay(timeString)
    });
  });

  return slots;
};

// ============================================================================
// Components
// ============================================================================

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen">
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

interface UserNotFoundStateProps {
  username?: string;
}

const UserNotFoundState: React.FC<UserNotFoundStateProps> = ({ username }) => (
  <div className="flex justify-center items-center min-h-screen">
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p>
            {username 
              ? `The user "${username}" doesn't exist or has no availability set.`
              : "The user you're looking for doesn't exist or has no availability set."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

interface UserInfoSectionProps {
  userData: UserData;
  onBack: () => void;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({ userData, onBack }) => (
  <div className="mb-6">
    <Button variant="ghost" className="p-0 mb-4" onClick={onBack}>
      <ArrowLeft className="h-4 w-4 mr-1" />
      <span>Back</span>
    </Button>
    <h1 className="text-2xl font-bold">{userData.name}</h1>
    <h2 className="text-xl font-medium mb-2">30 Minute Meeting</h2>
    <div className="flex items-center text-sm text-muted-foreground mb-1">
      <Clock className="h-4 w-4 mr-2" />
      <span>30 min</span>
    </div>
    <p className="text-sm text-muted-foreground">
      Web conferencing details provided upon confirmation.
    </p>
  </div>
);

interface CalendarHeaderProps {
  selectedDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  selectedDate, 
  onPreviousMonth, 
  onNextMonth 
}) => (
  <div className="flex items-center justify-between mb-4">
    <Button variant="outline" size="icon" onClick={onPreviousMonth}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <h3 className="text-lg font-medium">{formatMonthYear(selectedDate)}</h3>
    <Button variant="outline" size="icon" onClick={onNextMonth}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  selectedDay: DayData | null;
  onSelectDay: (date: Date, dayData: DayData | null) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  calendarDays, 
  selectedDay, 
  onSelectDay 
}) => {
  const dayHeaders = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="grid grid-cols-7 gap-1 mb-4">
      {dayHeaders.map(day => (
        <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
          {day}
        </div>
      ))}
      
      {calendarDays.map((day, index) => {
        // Don't render anything for non-current month days (empty slots)
        if (!day.isCurrentMonth && day.dayOfMonth === 0) {
          return <div key={index} className="h-10 w-10"></div>;
        }
        
        const isAvailable = day.dayData?.is_available || false;
        const isSelected = selectedDay?.date === day.dayData?.date;
        
        return (
          <Button
            key={index}
            variant={isSelected ? "default" : "ghost"}
            className={cn(
              "h-10 w-10 p-0 rounded-full text-xs",
              day.isToday && "border border-primary",
              isAvailable && "hover:bg-primary hover:text-primary-foreground",
              isSelected && "bg-primary text-primary-foreground",
              !isAvailable && "cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400"
            )}
            disabled={!isAvailable}
            onClick={() => onSelectDay(day.date, day.dayData)}
          >
            {day.dayOfMonth}
          </Button>
        );
      })}
    </div>
  );
};

const TimeZoneInfo: React.FC = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return (
    <div className="mt-6">
      <div className="flex items-center text-sm mb-2">
        <span className="text-sm font-medium">Time zone</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <span>Your local time ({timeZone})</span>
      </div>
    </div>
  );
};

interface TimeSlotsProps {
  selectedDay: DayData | null;
  timeSlots: GeneratedTimeSlot[];
  onSelectTimeSlot?: (slot: GeneratedTimeSlot) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ 
  selectedDay, 
  timeSlots, 
  onSelectTimeSlot 
}) => {
  if (!selectedDay) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Please select an available day from the calendar.
      </div>
    );
  }

  const selectedDateFormatted = new Date(selectedDay.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  if (!selectedDay.is_available) {
    return (
      <>
        <h3 className="text-lg font-medium mb-4">{selectedDateFormatted}</h3>
        <div className="text-center py-8 text-muted-foreground">
          Not available on this day.
        </div>
      </>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <>
        <h3 className="text-lg font-medium mb-4">{selectedDateFormatted}</h3>
        <div className="text-center py-8 text-muted-foreground">
          No time slots available for this day.
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className="text-lg font-medium mb-4">{selectedDateFormatted}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {timeSlots.map((slot, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className="justify-center h-12 hover:border-primary hover:bg-primary/5 font-medium text-primary"
            onClick={() => onSelectTimeSlot?.(slot)}
          >
            {slot.displayTime}
          </Button>
        ))}
      </div>
    </>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const UserAvailabilityPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    selectedDate,
    selectedDay,
    goToPreviousMonth,
    goToNextMonth,
    selectDay,
    resetSelectedDay
  } = useCalendarNavigation();
  
  const { loading, error, userData, monthData, refetch } = useUserAvailability(username, selectedDate);
  
  // Booking state management
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 'calendar',
    selectedTimeSlot: null,
    guestEmail: ''
  });
  
  // Memoized calculations
  const calendarDays = useMemo(() => 
    generateCalendarDays(selectedDate, monthData), 
    [selectedDate, monthData]
  );
  
  const timeSlots = useMemo(() => 
    generateTimeSlots(selectedDay), 
    [selectedDay]
  );
  
  // Event handlers
  const handleBack = useCallback(() => {
    if (bookingState.step === 'calendar') {
      navigate(-1);
    } else {
      setBookingState(prev => ({ ...prev, step: 'calendar' }));
    }
  }, [navigate, bookingState.step]);
  
  const handleSelectDay = useCallback((date: Date, dayData: DayData | null) => {
    selectDay(date, dayData);
    // Reset booking state when selecting a new day
    setBookingState(prev => ({ ...prev, step: 'calendar', selectedTimeSlot: null }));
  }, [selectDay]);
  
  const handleSelectTimeSlot = useCallback((slot: GeneratedTimeSlot) => {
    setBookingState({
      step: 'booking-form',
      selectedTimeSlot: slot,
      guestEmail: ''
    });
  }, []);
  
  const handleBookingSuccess = useCallback(() => {
    setBookingState(prev => ({
      ...prev,
      step: 'booking-success',
      guestEmail: user?.email || ''
    }));
  }, [user?.email]);
  
  const handleNewBooking = useCallback(() => {
    setBookingState({
      step: 'calendar',
      selectedTimeSlot: null,
      guestEmail: ''
    });
    resetSelectedDay();
  }, [resetSelectedDay]);
  
  // Reset selected day when month changes
  useEffect(() => {
    resetSelectedDay();
    setBookingState(prev => ({ ...prev, step: 'calendar', selectedTimeSlot: null }));
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), resetSelectedDay]);
  
  // Render states
  if (loading) {
    return <LoadingState message="Loading availability..." />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }
  
  if (!userData) {
    return <UserNotFoundState username={username} />;
  }
  
  // Render booking form
  if (bookingState.step === 'booking-form' && bookingState.selectedTimeSlot && selectedDay && userData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <BookingForm
            hostUsername={username!}
            hostName={userData.name}
            selectedDate={selectedDay.date}
            selectedTimeSlot={bookingState.selectedTimeSlot}
            onBack={handleBack}
            onSuccess={handleBookingSuccess}
          />
        </div>
      </div>
    );
  }
  
  // Render booking success
  if (bookingState.step === 'booking-success' && bookingState.selectedTimeSlot && selectedDay && userData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <BookingSuccess
            hostName={userData.name}
            selectedDate={selectedDay.date}
            selectedTimeSlot={bookingState.selectedTimeSlot}
            guestEmail={bookingState.guestEmail}
            onBack={handleBack}
            onNewBooking={handleNewBooking}
          />
        </div>
      </div>
    );
  }
  
  // Render calendar view (default)
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Panel - User Info & Calendar */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
            <UserInfoSection userData={userData} onBack={handleBack} />
            <h3 className="text-lg font-medium mb-4">Select a Date & Time</h3>
            <CalendarHeader 
              selectedDate={selectedDate}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
            />
            <CalendarGrid 
              calendarDays={calendarDays}
              selectedDay={selectedDay}
              onSelectDay={handleSelectDay}
            />
          </div> {/* End Left Panel */}
          {/* Right Panel - Time Slots */}
          <div className="w-full md:w-1/2 p-6">
            <TimeSlots
              selectedDay={selectedDay}
              timeSlots={timeSlots}
              onSelectTimeSlot={handleSelectTimeSlot}
            />
            <TimeZoneInfo />
          </div> 
        </div> 
      </div> 
    </div> 
  );
};

export default UserAvailabilityPage;