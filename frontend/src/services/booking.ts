import axiosInstance from "@/lib/api/axios";

interface Booking {
  id?: number;
  host_user_id: number;
  guest_user_id: number;
  booking_time: string;
  notes?: string;
  meeting_link?: string;
  cancelled_at?: string;
  created_at?: string;
  updated_at?: string;
  host_user?: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  guest_user?: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

interface CreateBookingData {
  username: string;
  booking_time: string;
  notes?: string;
}

interface UpdateBookingData {
  notes?: string;
  meeting_link?: string;
  cancelled_at?: string;
}

interface DashboardStats {
  total_bookings: number;
  upcoming_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
}

interface BookingFilters {
  start_date?: string;
  end_date?: string;
}

export const bookingService = {
  /**
   * Get all bookings for the authenticated user (as host)
   */
  getMyBookings: async (filters?: BookingFilters): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.status) params.append("status", filters.status);

    const queryString = params.toString();
    const url = queryString ? `/bookings?${queryString}` : "/bookings";

    const response = await axiosInstance.get(url);
    console.log("getMyBookings response:", response.data.bookings);

    return response.data.bookings;
  },

  /**
   * Get bookings for a specific user (public endpoint)
   */
  getUserBookings: async (
    userId: number,
    filters?: BookingFilters
  ): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.status) params.append("status", filters.status);

    const queryString = params.toString();
    const url = queryString
      ? `/public/users/${userId}/bookings?${queryString}`
      : `/public/users/${userId}/bookings`;

    const response = await axiosInstance.get(url);
    return response.data.data.bookings;
  },

  /**
   * Create a new booking (public endpoint)
   */
  createBooking: async (bookingData: CreateBookingData): Promise<Booking> => {
    const response = await axiosInstance.post("/bookings", bookingData);
    return response.data.data.booking;
  },

  /**
   * Get a specific booking by ID (only for host)
   */
  getBooking: async (bookingId: number): Promise<Booking> => {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data.data.booking;
  },
};

export type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  DashboardStats,
  BookingFilters,
};
