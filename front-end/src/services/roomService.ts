import api from "./api";

export interface RoomSearchRequest {
  prompt: string;
}

export interface RoomRequirements {
  capacity?: number;
  hasProjector?: boolean;
  hasAirConditioner?: boolean;
  hasMicrophone?: boolean;
  hasCamera?: boolean;
  hasNoiseCancelling?: boolean;
  hasNaturalLight?: boolean;
  roomType?: "classroom" | "study_room";
  date?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
}

export interface RoomMatch {
  roomNumber: string;
  matchScore: number;
  matchReasons: string[];
  room: {
    id: number;
    roomNumber: string;
    floor: number;
    roomType: string;
    capacity: number;
    areaSqm: number;
    hasProjector: boolean;
    hasAirConditioner: boolean;
    hasMicrophone: boolean;
    hasCamera: boolean;
    hasNoiseCancelling: boolean;
    hasNaturalLight: boolean;
  };
}

export interface RoomSearchResponse {
  requirements: RoomRequirements;
  rooms: RoomMatch[];
  message: string;
}

export interface CreateReservationRequest {
  roomNumber: string;
  userName: string;
  userEmail: string;
  startDatetime: string;
  endDatetime: string;
  purpose?: string;
}

export interface Reservation {
  id: number;
  roomNumber: string;
  userName: string;
  userEmail: string;
  startDatetime: string;
  endDatetime: string;
  bookingStatus: string;
  status: string;
  purpose?: string;
  createdAt: string;
  room: {
    id: number;
    roomNumber: string;
    name: string;
    location: string;
    roomType: string;
    capacity: number;
    floor: number;
    areaSqm: number;
    hasProjector: boolean;
    hasAirConditioner: boolean;
    hasMicrophone: boolean;
    hasCamera: boolean;
    hasNoiseCancelling: boolean;
    hasNaturalLight: boolean;
  };
  roomFeature?: {
    roomNumber: string;
    roomType: string;
    capacity: number;
    floor: number;
  };
}

export interface CheckAvailabilityRequest {
  roomNumber: string;
  startDatetime: string;
  endDatetime: string;
}

// Reservation delete
export const deleteReservation = async (id: number) => {
  await api.delete(`/reservations/${id}`);
};

export const roomService = {
  // AI-powered room search
  updateReservation: async (
    id: number,
    data: Partial<Reservation>
  ): Promise<Reservation> => {
    const response = await api.put(`/reservations/${id}`, data);
    return response.data.data;
  },
  deleteReservation: async (id: number): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },
  searchRoomsWithAI: async (
    request: RoomSearchRequest
  ): Promise<RoomSearchResponse> => {
    const response = await api.post("/reservations/search-ai", request);
    return response.data.data;
  },
  getReservedSlots: async ({
    roomNumber,
    date,
  }: {
    roomNumber: string;
    date: string;
  }): Promise<string[]> => {
    const response = await api.get(
      `/reservations/reserved-slots?roomNumber=${encodeURIComponent(
        roomNumber
      )}&date=${encodeURIComponent(date)}`
    );
    return response.data.data;
  },
  // Check room availability
  checkAvailability: async (
    request: CheckAvailabilityRequest
  ): Promise<boolean> => {
    const response = await api.post(
      "/reservations/check-availability",
      request
    );
    return response.data.data.isAvailable;
  },

  // Create reservation
  createReservation: async (
    request: CreateReservationRequest
  ): Promise<{ reservation: Reservation; confirmationMessage: string }> => {
    const response = await api.post("/reservations", request);
    return response.data.data;
  },

  // Get user reservations
  getUserReservations: async (userEmail: string): Promise<Reservation[]> => {
    const response = await api.get(
      `/reservations/user/${encodeURIComponent(userEmail)}`
    );
    return response.data.data;
  },

  // Cancel reservation
  cancelReservation: async (reservationId: number): Promise<Reservation> => {
    const response = await api.patch(`/reservations/${reservationId}/cancel`);
    return response.data.data;
  },

  // Get all reservations with filters
  getReservations: async (filters?: {
    roomNumber?: string;
    userEmail?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Reservation[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await api.get(`/reservations?${params.toString()}`);
    return response.data.data;
  },

  // Get upcoming reservations
  getUpcomingReservations: async (limit?: number): Promise<Reservation[]> => {
    const response = await api.get(
      `/reservations/upcoming${limit ? `?limit=${limit}` : ""}`
    );
    return response.data.data;
  },
  getAllRooms: async (): Promise<any[]> => {
    const response = await api.get('/rooms');
    return response.data.data;
  },

  // Add new room
  addRoom: async (roomData: any): Promise<any> => {
    const response = await api.post('/rooms', roomData);
    return response.data.data;
  },

  // Update room
  updateRoom: async (roomId: number, roomData: any): Promise<any> => {
    const response = await api.put(`/rooms/${roomId}`, roomData);
    return response.data.data;
  },

  // Delete room
  deleteRoom: async (roomId: number): Promise<void> => {
    await api.delete(`/rooms/${roomId}`);
  },

  // Get all users for admin
  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get('/users');
    return response.data.data;
  },

  // Add new user
  addUser: async (userData: any): Promise<any> => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  // Update user
  updateUser: async (userId: number, userData: any): Promise<any> => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  // Force delete reservation (admin only)
  forceDeleteReservation: async (reservationId: number): Promise<void> => {
    await api.delete(`/admin/reservations/${reservationId}`);
  },

  // Update reservation status (admin only)
  updateReservationStatus: async (reservationId: number, status: string): Promise<Reservation> => {
    const response = await api.patch(`/admin/reservations/${reservationId}/status`, { status });
    return response.data.data;
  },
};
