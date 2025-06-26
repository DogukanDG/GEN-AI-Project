import api from './api';

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
  roomType?: 'classroom' | 'study_room';
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

export const roomService = {
  // AI-powered room search
  searchRoomsWithAI: async (request: RoomSearchRequest): Promise<RoomSearchResponse> => {
    const response = await api.post('/reservations/search-ai', request);
    return response.data.data;
  },

  // Check room availability
  checkAvailability: async (request: CheckAvailabilityRequest): Promise<boolean> => {
    const response = await api.post('/reservations/check-availability', request);
    return response.data.data.isAvailable;
  },

  // Create reservation
  createReservation: async (request: CreateReservationRequest): Promise<{ reservation: Reservation; confirmationMessage: string }> => {
    const response = await api.post('/reservations', request);
    return response.data.data;
  },

  // Get user reservations
  getUserReservations: async (userEmail: string): Promise<Reservation[]> => {
    const response = await api.get(`/reservations/user/${encodeURIComponent(userEmail)}`);
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
    const response = await api.get(`/reservations/upcoming${limit ? `?limit=${limit}` : ''}`);
    return response.data.data;
  }
};
