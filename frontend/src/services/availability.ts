import axiosInstance from '@/lib/api/axios';

interface Availability {
  id?: number;
  user_id?: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export const availabilityService = {
  /**
   * Get the user's availabilities
   */
  getAvailabilities: async (): Promise<Availability[]> => {
    const response = await axiosInstance.get('/availabilities');
    return response.data;
  },

  /**
   * Update the user's availabilities
   */
  updateAvailabilities: async (availabilities: Availability[]): Promise<Availability[]> => {
    const response = await axiosInstance.post('/availabilities', { availabilities });
    return response.data;
  },
};