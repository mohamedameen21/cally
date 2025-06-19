import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, User, Mail, ArrowLeft } from 'lucide-react';

interface BookingSuccessProps {
  hostName: string;
  selectedDate: string;
  selectedTimeSlot: {
    time: string;
    displayTime: string;
  };
  guestEmail: string;
  onBack: () => void;
  onNewBooking: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  hostName,
  selectedDate,
  selectedTimeSlot,
  guestEmail,
  onBack,
  onNewBooking
}) => {
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
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Booking Request Sent!
          </h2>
          <p className="text-muted-foreground">
            Your booking request has been successfully submitted.
          </p>
        </div>
      </div>

      {/* Booking Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Booking Summary</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Meeting with:</span> {hostName}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Date:</span> {formatSelectedDate(selectedDate)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Time:</span> {selectedTimeSlot.displayTime}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Confirmation will be sent to:</span> {guestEmail}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What happens next?</h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Pending Review</p>
                <p>Your booking request is currently pending approval from {hostName}.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Email Confirmation</p>
                <p>You'll receive an email confirmation once {hostName} approves your booking request.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Meeting Details</p>
                <p>The confirmation email will include meeting details and any additional instructions.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendar
        </Button>
        
        <Button
          onClick={onNewBooking}
          className="flex-1"
        >
          Book Another Time
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
        <p className="font-medium mb-1">Need to make changes?</p>
        <p>
          If you need to modify or cancel this booking request, please contact {hostName} directly 
          or wait for the confirmation email which may include instructions for managing your booking.
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess;