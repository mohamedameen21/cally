import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Clock, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { bookingService, type CreateBookingData } from '@/services/booking';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BookingFormProps {
  hostUsername: string;
  hostName: string;
  selectedDate: string;
  selectedTimeSlot: {
    time: string;
    displayTime: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

interface BookingFormData {
  notes: string;
}

interface FormErrors {
  general?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  hostUsername,
  hostName,
  selectedDate,
  selectedTimeSlot,
  onBack,
  onSuccess
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    notes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    return true;
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, notes: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Parse the time slot to get start time
      const [startTime] = selectedTimeSlot.time.split(' - ');
      
      // Combine date and time into a single timestamp
      const bookingDateTime = new Date(`${selectedDate}T${startTime}:00`);
      const bookingTimeISO = bookingDateTime.toISOString();
      
      const bookingData: CreateBookingData = {
        username: hostUsername,
        booking_time: bookingTimeISO,
        notes: formData.notes.trim() || undefined
      };

      await bookingService.createBooking(bookingData);
      
      toast.success('Booking request sent successfully!');
      onSuccess();
      
    } catch (error: any) {    
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('conflict') || 
            error.response.data.message.includes('already booked')) {
          setErrors({ general: 'This time slot is no longer available. Please select a different time.' });
        } else {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: 'Failed to create booking. Please try again.' });
      }
      
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSelectedDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Book with {hostName}</h2>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatSelectedDate(selectedDate)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{selectedTimeSlot.displayTime}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Meeting with {hostName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error */}
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.general}
              </div>
            )}

            {/* User Info Display */}
            <div className="space-y-2">
              <Label>Booking as:</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4" />
                  Additional Notes (Optional)
                </div>
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional information or special requests..."
                value={formData.notes}
                onChange={(e) => handleInputChange(e.target.value)}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
        <p>
          By submitting this booking request, you agree to attend the scheduled meeting. 
          You will receive a confirmation email with meeting details once the host approves your request.
        </p>
      </div>
    </div>
  );
};

export default BookingForm;