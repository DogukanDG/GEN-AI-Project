export interface CreateReservationDto {
  roomNumber: string;
  userName: string;
  userEmail: string;
  startDatetime: Date;
  endDatetime: Date;
  purpose?: string;
  userId?: number;
}

export interface UpdateReservationDto {
  userName?: string;
  userEmail?: string;
  startDatetime?: Date;
  endDatetime?: Date;
  bookingStatus?: string;
  purpose?: string;
}

export interface ReservationQuery {
  roomNumber?: string;
  userEmail?: string;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}
