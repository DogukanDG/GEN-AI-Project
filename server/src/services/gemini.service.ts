import { GoogleGenerativeAI } from '@google/generative-ai';

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

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = 'AIzaSyDCOgQTMHGHe4PqGWAUobLpP1fcVgRsri4';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async parseRoomRequest(userPrompt: string): Promise<RoomRequirements> {
    console.log('=== Gemini parseRoomRequest started ===');
    console.log('User prompt:', userPrompt);

    const prompt = `
    You are an AI assistant for a room booking system. Parse the following user request and extract the room requirements in JSON format.

    User request: "${userPrompt}"

    Please extract the following information and return ONLY a valid JSON object:
    - capacity: number of people (if mentioned)
    - hasProjector: true/false (if projector, presentation, display mentioned)
    - hasAirConditioner: true/false (if air conditioning, AC, cooling mentioned)
    - hasMicrophone: true/false (if microphone, mic, audio mentioned)
    - hasCamera: true/false (if camera, recording, video mentioned)
    - hasNoiseCancelling: true/false (if quiet, noise cancelling, silent mentioned)
    - hasNaturalLight: true/false (if natural light, window, daylight mentioned)
    - roomType: "classroom" or "study_room" (if lecture/presentation = classroom, if study/meeting = study_room)
    - date: ISO date string (if date mentioned)
    - startTime: time string (if start time mentioned)
    - endTime: time string (if end time mentioned)
    - purpose: brief description of the purpose

    Return only the JSON object without any additional text or formatting.
    `;

    try {
      console.log('Calling Gemini API...');
      const result = await this.model.generateContent(prompt);
      console.log('Gemini API response received');

      const response = await result.response;
      const text = response.text();
      console.log('Raw Gemini response:', text);

      // Clean the response and parse JSON
      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      console.log('Cleaned response:', cleanedText);

      const parsedRequirements = JSON.parse(cleanedText);
      console.log('Parsed requirements:', parsedRequirements);

      return parsedRequirements;
    } catch (error) {
      console.error('Error parsing room request with Gemini:', error);
      throw new Error('Failed to parse room requirements');
    }
  }

  async rankRooms(
    requirements: RoomRequirements,
    availableRooms: any[]
  ): Promise<any[]> {
    const roomsData = JSON.stringify(availableRooms, null, 2);
    const requirementsData = JSON.stringify(requirements, null, 2);

    const prompt = `
    You are an AI assistant for a room booking system. Rank the following rooms based on how well they match the user requirements.

    User Requirements:
    ${requirementsData}

    Available Rooms:
    ${roomsData}

    Please rank the rooms from best to worst match and return a JSON array with the following structure:
    [
      {
        "roomNumber": "room_number",
        "matchScore": 0-100,
        "matchReasons": ["reason1", "reason2"],
        "room": { original room object }
      }
    ]

    Ranking criteria:
    1. Capacity: Must accommodate the required number of people
    2. Required features: Must have all explicitly requested features
    3. Room type: Should match if specified
    4. Additional features: Bonus points for extra useful features

    Return only the JSON array without any additional text or formatting.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean the response and parse JSON
      const cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const rankedRooms = JSON.parse(cleanedText);

      return rankedRooms;
    } catch (error) {
      console.error('Error ranking rooms with Gemini:', error);
      throw new Error('Failed to rank rooms');
    }
  }

  async generateBookingConfirmation(reservation: any): Promise<string> {
    const prompt = `
    Generate a friendly booking confirmation message for the following reservation:
    
    Room: ${reservation.roomNumber}
    User: ${reservation.userName}
    Date: ${new Date(reservation.startDatetime).toLocaleDateString()}
    Time: ${new Date(
      reservation.startDatetime
    ).toLocaleTimeString()} - ${new Date(
      reservation.endDatetime
    ).toLocaleTimeString()}
    Purpose: ${reservation.purpose || 'Not specified'}
    
    Make it professional but friendly, and include any important details about the room.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating confirmation message:', error);
      return 'Your room has been successfully booked!';
    }
  }
}

export default new GeminiService();
