import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Mail, MessageSquare, Video } from "lucide-react";
import { bookingService, type Booking, type BookingFilters } from "@/services/booking";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

const DashboardBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BookingFilters>({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings(filters);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getDisplayUserInfo = (booking: Booking) => {
    if (!user) return { name: 'Unknown User', email: 'No email', role: 'unknown' };
    
    // If current user is the host, show guest info
    if (user.id === booking.host_user_id) {
      return {
        name: booking.guest_user?.name || 'Unknown Guest',
        email: booking.guest_user?.email || 'No email',
        role: 'guest'
      };
    }
    
    // If current user is the guest, show host info
    if (user.id === booking.guest_user_id) {
      return {
        name: booking.host_user?.name || 'Unknown Host',
        email: booking.host_user?.email || 'No email',
        role: 'host'
      };
    }
    
    // Fallback (shouldn't happen in normal cases)
    return {
      name: 'Unknown User',
      email: 'No email',
      role: 'unknown'
    };
  };

  const renderBookingCard = (booking: Booking) => {
    const status = booking.cancelled_at ? 'cancelled' : 'confirmed';
    const displayUser = getDisplayUserInfo(booking);
    const roleLabel = displayUser.role === 'guest' ? 'Guest' : displayUser.role === 'host' ? 'Host' : 'User';

    return (
      <Card key={booking.id} className="mb-4">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{displayUser.name}</span>
              <Badge variant="outline" className="text-xs">
                {roleLabel}
              </Badge>
              <Badge variant={getStatusBadgeVariant(status)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{displayUser.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(booking.booking_time), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{format(parseISO(booking.booking_time), 'HH:mm')} - {(() => {
                  const bookingDateTime = parseISO(booking.booking_time);
                  const endTime = new Date(bookingDateTime.getTime() + 30 * 60 * 1000);
                  return format(endTime, 'HH:mm');
                })()}</span>
              </div>
              
              {booking.notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <span className="text-sm">{booking.notes}</span>
                </div>
              )}
              
              {booking.meeting_link && (
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <a 
                    href={booking.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {booking.created_at && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              Booked on {format(parseISO(booking.created_at), 'MMM d, yyyy \\at h:mm a')}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {/* All Bookings */}
      {bookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Bookings ({bookings.length})</h2>
          <div className="space-y-4">
            {bookings.map(renderBookingCard)}
          </div>
        </div>
      )}

      {/* No bookings */}
      {bookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any bookings yet. Share your availability link to start receiving bookings.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardBookingsPage;