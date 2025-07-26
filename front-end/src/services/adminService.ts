import api from "./api";

export interface TableInfo {
  name: string;
  count: number;
  fields: string[];
}

export interface DatabaseStats {
  totalUsers: number;
  totalReservations: number;
  totalRooms: number;
  recentReservations: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const adminService = {
  // Get database statistics
  getStats: async (): Promise<DatabaseStats> => {
    const response = await api.get("/admin/stats");
    return response.data.data;
  },

  // Get all tables info
  getTables: async (): Promise<TableInfo[]> => {
    const response = await api.get("/admin/tables");
    return response.data.data;
  },

  // User management
  getUsers: async (page: number = 1, limit: number = 50): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateUser: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Reservation management
  getReservations: async (page: number = 1, limit: number = 50): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/admin/reservations?page=${page}&limit=${limit}`);
    return response.data;
  },

  createReservation: async (data: any): Promise<any> => {
    const response = await api.post(`/admin/reservations`, data);
    return response.data.data;
  },

  updateReservation: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/admin/reservations/${id}`, data);
    return response.data.data;
  },

  deleteReservation: async (id: number): Promise<void> => {
    await api.delete(`/admin/reservations/${id}`);
  },

  // Room features management (RoomFeature table)
  getRoomFeatures: async (page: number = 1, limit: number = 50): Promise<PaginatedResponse<any>> => {
    const response = await api.get(`/admin/room-features?page=${page}&limit=${limit}`);
    return response.data;
  },

  createRoomFeature: async (data: any): Promise<any> => {
    const response = await api.post(`/admin/room-features`, data);
    return response.data.data;
  },

  updateRoomFeature: async (id: number, data: any): Promise<any> => {
    const response = await api.put(`/admin/room-features/${id}`, data);
    return response.data.data;
  },

  deleteRoomFeature: async (id: number): Promise<void> => {
    await api.delete(`/admin/room-features/${id}`);
  },
};
