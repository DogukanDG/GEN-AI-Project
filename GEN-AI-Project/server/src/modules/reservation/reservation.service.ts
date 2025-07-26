import reservationRepository from "./reservation.repository";
import geminiService, { RoomRequirements } from "../../services/gemini.service";
import {
  CreateReservationDto,
  UpdateReservationDto,
  ReservationQuery,
} from "../../types/reservation";
import { HttpError } from "../../types/errors";
import { RoomFeatureRepository } from "../roomFeature/roomFeature.repository";

const roomFeatureRepository = new RoomFeatureRepository();

export class ReservationService {
  async createReservation(data: CreateReservationDto) {
    // Kullanıcının aynı gün için mevcut rezervasyonu var mı kontrol et
    const startDate = new Date(data.startDatetime);
    const userReservations = await reservationRepository.findMany({
      userEmail: data.userEmail,
      startDate: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ),
      endDate: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        23,
        59,
        59
      ),
      status: "confirmed",
    });

    if (userReservations.length > 0) {
      throw new HttpError(409, "You can only make one reservation per day.");
    }

    // Check if room exists
    const room = await roomFeatureRepository.findAll();
    const roomExists = room.find((r) => r.roomNumber === data.roomNumber);
    if (!roomExists) {
      throw new HttpError(404, "Room not found");
    }

    // Check room availability
    const isAvailable = await reservationRepository.checkRoomAvailability(
      data.roomNumber,
      data.startDatetime,
      data.endDatetime
    );

    if (!isAvailable) {
      throw new HttpError(
        409,
        "Room is not available for the selected time slot"
      );
    }

    // Create reservation
    const reservation = await reservationRepository.create(data);

    // Generate confirmation message
    try {
      const confirmationMessage =
        await geminiService.generateBookingConfirmation(reservation);
      return {
        reservation,
        confirmationMessage,
      };
    } catch (error) {
      // Return reservation even if confirmation message generation fails
      return {
        reservation,
        confirmationMessage: "Your room has been successfully booked!",
      };
    }
  }

  async getReservations(query: ReservationQuery = {}) {
    return await reservationRepository.findMany(query);
  }

  async getReservationById(id: number) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new HttpError(404, "Reservation not found");
    }
    return reservation;
  }

  async updateReservation(id: number, data: UpdateReservationDto) {
    const existingReservation = await reservationRepository.findById(id);
    if (!existingReservation) {
      throw new HttpError(404, "Reservation not found");
    }

    // If updating time, check availability
    if (data.startDatetime || data.endDatetime) {
      const startTime = data.startDatetime || existingReservation.startDatetime;
      const endTime = data.endDatetime || existingReservation.endDatetime;
      const isAvailable = await reservationRepository.checkRoomAvailability(
        existingReservation.roomNumber,
        startTime,
        endTime,
        id
      );

      if (!isAvailable) {
        throw new HttpError(
          409,
          "Room is not available for the selected time slot"
        );
      }
    }

    return await reservationRepository.update(id, data);
  }

  async cancelReservation(id: number) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new HttpError(404, "Reservation not found");
    }

    if (reservation.bookingStatus === "cancelled") {
      throw new HttpError(400, "Reservation is already cancelled");
    }

    return await reservationRepository.update(id, {
      bookingStatus: "cancelled",
    });
  }

  async deleteReservation(id: number) {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw new HttpError(404, "Reservation not found");
    }

    return await reservationRepository.delete(id);
  }

  async getUserReservations(userEmail: string) {
    return await reservationRepository.getUserReservations(userEmail);
  }

  async searchRoomsWithAI(userPrompt: string) {
    try {
      console.log("=== searchRoomsWithAI started ===");
      console.log("User prompt:", userPrompt);
      console.log("Current timestamp:", new Date().toISOString());

      // Ön kontrol: Prompt'un minimum uzunluğu kontrol et
      if (!userPrompt || userPrompt.trim().length < 3) {
        throw new HttpError(400, "Please provide a more detailed room request");
      }

      // Basit keyword kontrolü (opsiyonel ek güvenlik)
      const roomKeywords = [
        "room",
        "oda",
        "book",
        "reserve",
        "reservation",
        "study",
        "meeting",
        "class",
        "classroom",
      ];
      const hasRoomKeyword = roomKeywords.some((keyword) =>
        userPrompt.toLowerCase().includes(keyword)
      );

      if (!hasRoomKeyword) {
        console.log(
          "No room-related keywords found, proceeding with AI validation"
        );
      }

      // Parse user requirements using Gemini AI (validasyon dahil)
      console.log("About to call geminiService.parseRoomRequest...");
      let requirements: RoomRequirements;

      try {
        requirements = await geminiService.parseRoomRequest(userPrompt);
        console.log(
          "Successfully received requirements from Gemini:",
          JSON.stringify(requirements, null, 2)
        );
      } catch (error) {
        console.error("Gemini parsing error:", error);

        // Hata mesajını kontrol et ve kullanıcıya anlamlı mesaj döndür
        if (error instanceof Error) {
          if (error.message.includes("Invalid room booking request")) {
            throw new HttpError(
              400,
              "Your request does not appear to be related to room booking. Please provide a valid room reservation request."
            );
          }
          if (error.message.includes("No valid room requirements found")) {
            throw new HttpError(
              400,
              "Could not understand your room requirements. Please provide more specific details about the room you need."
            );
          }
        }

        throw new HttpError(
          400,
          "Unable to process your room request. Please ensure your request includes details such as desired date, time, room type, capacity, and any required features (e.g., projector, air conditioner)."
        );
      }

      // Get available rooms from database
      console.log("Fetching available rooms...");
      const availableRooms = await roomFeatureRepository.findAll();
      console.log("Available rooms count:", availableRooms.length);

      if (availableRooms.length === 0) {
        throw new HttpError(404, "No rooms available");
      }

      // Filter rooms based on basic requirements first
      let filteredRooms = availableRooms;
      console.log("Starting room filtering...");

      // Filter by capacity
      if (requirements.capacity) {
        console.log("Filtering by capacity:", requirements.capacity);
        filteredRooms = filteredRooms.filter(
          (room: any) => room.capacity >= requirements.capacity!
        );
        console.log("Rooms after capacity filter:", filteredRooms.length);
      }

      // Filter by room type
      if (requirements.roomType) {
        console.log("Filtering by room type:", requirements.roomType);
        filteredRooms = filteredRooms.filter(
          (room: any) => room.roomType === requirements.roomType
        );
        console.log("Rooms after room type filter:", filteredRooms.length);
      }

      // Filter by required features (sadece true olanlar için filtrele)
      if (requirements.hasProjector === true) {
        console.log("Filtering by projector requirement");
        filteredRooms = filteredRooms.filter((room: any) => room.hasProjector);
        console.log("Rooms after projector filter:", filteredRooms.length);
      }
      if (requirements.hasAirConditioner === true) {
        console.log("Filtering by air conditioner requirement");
        filteredRooms = filteredRooms.filter(
          (room: any) => room.hasAirConditioner
        );
        console.log(
          "Rooms after air conditioner filter:",
          filteredRooms.length
        );
      }
      if (requirements.hasMicrophone === true) {
        console.log("Filtering by microphone requirement");
        filteredRooms = filteredRooms.filter((room: any) => room.hasMicrophone);
        console.log("Rooms after microphone filter:", filteredRooms.length);
      }
      if (requirements.hasCamera === true) {
        console.log("Filtering by camera requirement");
        filteredRooms = filteredRooms.filter((room: any) => room.hasCamera);
        console.log("Rooms after camera filter:", filteredRooms.length);
      }
      if (requirements.hasNoiseCancelling === true) {
        console.log("Filtering by noise cancelling requirement");
        filteredRooms = filteredRooms.filter(
          (room: any) => room.hasNoiseCancelling
        );
        console.log(
          "Rooms after noise cancelling filter:",
          filteredRooms.length
        );
      }
      if (requirements.hasNaturalLight === true) {
        console.log("Filtering by natural light requirement");
        filteredRooms = filteredRooms.filter(
          (room: any) => room.hasNaturalLight
        );
        console.log("Rooms after natural light filter:", filteredRooms.length);
      }

      if (filteredRooms.length === 0) {
        return {
          requirements,
          rooms: [],
          message:
            "No rooms match your requirements. Please try adjusting your criteria.",
        };
      }

      // Use Gemini AI to rank the filtered rooms
      console.log("Ranking rooms with Gemini AI...");
      const rankedRooms = await geminiService.rankRooms(
        requirements,
        filteredRooms
      );
      console.log("Ranking complete. Rooms ranked:", rankedRooms.length);

      return {
        requirements,
        rooms: rankedRooms,
        message: `Found ${rankedRooms.length} rooms matching your criteria.`,
      };
    } catch (error) {
      console.error("Error in AI room search:", error);

      // HttpError'ları olduğu gibi geçir
      if (error instanceof HttpError) {
        throw error;
      }

      // Diğer hatalar için genel mesaj
      throw new HttpError(500, "Failed to search rooms. Please try again.");
    }
  }

  async getUpcomingReservations(limit: number = 10) {
    return await reservationRepository.getUpcomingReservations(limit);
  }

  async checkRoomAvailability(
    roomNumber: string,
    startDatetime: Date,
    endDatetime: Date
  ) {
    return await reservationRepository.checkRoomAvailability(
      roomNumber,
      startDatetime,
      endDatetime
    );
  }

  async getReservedSlots(roomNumber: string, date: string) {
    return await reservationRepository.getReservedSlots(roomNumber, date);
  }
}

export default new ReservationService();
