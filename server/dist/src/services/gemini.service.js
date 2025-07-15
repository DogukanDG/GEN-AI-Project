"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    genAI;
    model;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    // Önce prompt'un oda rezervasyonu ile ilgili olup olmadığını kontrol et
    async validateRoomRequest(userPrompt) {
        const validationPrompt = `
    You are a room booking system validator. Analyze the following user request and determine if it's a legitimate room booking request.

    User request: "${userPrompt}"

    A valid room booking request should:
    1. Be related to booking/reserving a room, office, classroom, or meeting space
    2. Include reasonable requirements (capacity, equipment, time, etc.)
    3. Be related to work, study, meetings, presentations, or similar professional/educational activities
    4. Not include completely unrelated topics (like planting trees, cooking, shopping, etc.)

    Return ONLY a JSON object with this structure:
    {
      "isValid": true/false,
      "reason": "brief explanation of why it's valid or invalid"
    }

    Examples of INVALID requests:
    - "I want to plant trees in a room"
    - "Book me a restaurant for dinner"
    - "I need a room to cook pasta"
    - "Find me a room to sleep"
    - Random text or gibberish

    Examples of VALID requests:
    - "I need a room for 10 people with a projector"
    - "Book a study room for tomorrow"
    - "I want a classroom for a presentation"
    - "Need a quiet room for a meeting"
    `;
        try {
            const result = await this.model.generateContent(validationPrompt);
            const response = await result.response;
            const text = response.text();
            const cleanedText = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const validation = JSON.parse(cleanedText);
            return {
                isValid: validation.isValid,
                message: validation.reason,
            };
        }
        catch (error) {
            console.error("Error validating room request:", error);
            // Hata durumunda güvenli tarafta kalıp geçersiz say
            return {
                isValid: false,
                message: "Unable to validate request format",
            };
        }
    }
    // Oda gereksinimlerini doğrula ve mantık kontrolü yap
    validateRequirements(requirements) {
        // Kapasite kontrolü
        if (requirements.capacity &&
            (requirements.capacity < 1 || requirements.capacity > 1000)) {
            return {
                isValid: false,
                message: "Room capacity must be between 1 and 1000 people",
            };
        }
        // Tarih kontrolü
        if (requirements.date) {
            const date = new Date(requirements.date);
            const today = new Date();
            if (date < today) {
                return {
                    isValid: false,
                    message: "Cannot book rooms for past dates",
                };
            }
        }
        // Saat kontrolü
        if (requirements.startTime && requirements.endTime) {
            const start = new Date(`2000-01-01T${requirements.startTime}`);
            const end = new Date(`2000-01-01T${requirements.endTime}`);
            if (start >= end) {
                return {
                    isValid: false,
                    message: "End time must be after start time",
                };
            }
        }
        return { isValid: true };
    }
    async parseRoomRequest(userPrompt) {
        // Önce prompt'un geçerli olup olmadığını kontrol et
        const validation = await this.validateRoomRequest(userPrompt);
        if (!validation.isValid) {
            console.log("Invalid room request detected:", validation.message);
            return {
                isValid: false,
                errorMessage: `This doesn't appear to be a valid room booking request. ${validation.message}`,
            };
        }
        const prompt = `
    You are an AI assistant for a room booking system. Parse the following VALIDATED room booking request and extract the room requirements in JSON format.

    User request: "${userPrompt}"

    Please extract the following information and return ONLY a valid JSON object:
    - capacity: number of people (if mentioned, must be reasonable 1-1000)
    - hasProjector: true/false (if projector, presentation, display mentioned)
    - hasAirConditioner: true/false (if air conditioning, AC, cooling mentioned)
    - hasMicrophone: true/false (if microphone, mic, audio mentioned)
    - hasCamera: true/false (if camera, recording, video mentioned)
    - hasNoiseCancelling: true/false (if quiet, noise cancelling, silent mentioned)
    - hasNaturalLight: true/false (if natural light, window, daylight mentioned)
    - roomType: "classroom" or "study_room" (if lecture/presentation = classroom, if study/meeting = study_room)
    - date: ISO date string (if date mentioned, format: YYYY-MM-DD)
    - startTime: time string (if start time mentioned, format: HH:MM)
    - endTime: time string (if end time mentioned, format: HH:MM)
    - purpose: brief description of the purpose (work/study related only)

    IMPORTANT: Only include fields that are explicitly mentioned or can be reasonably inferred from the request.
    Do not make up information that wasn't mentioned.

    Return only the JSON object without any additional text or formatting.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean the response and parse JSON
            const cleanedText = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            console.log("Cleaned response:", cleanedText);
            const parsedRequirements = JSON.parse(cleanedText);
            console.log("Parsed requirements:", parsedRequirements);
            // Çıkarılan gereksinimleri doğrula
            const requirementsValidation = this.validateRequirements(parsedRequirements);
            if (!requirementsValidation.isValid) {
                return {
                    isValid: false,
                    errorMessage: requirementsValidation.message,
                };
            }
            return {
                isValid: true,
                requirements: parsedRequirements,
            };
        }
        catch (error) {
            console.error("Error parsing room request with Gemini:", error);
            return {
                isValid: false,
                errorMessage: "Failed to parse room requirements. Please make sure your request is clear and specific.",
            };
        }
    }
    async rankRooms(requirements, availableRooms) {
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
    1. Capacity: Must accommodate the required number of people (MANDATORY)
    2. Required features: Must have all explicitly requested features (HIGH PRIORITY)
    3. Room type: Should match if specified (MEDIUM PRIORITY)
    4. Additional features: Bonus points for extra useful features (LOW PRIORITY)

    IMPORTANT: 
    - If a room cannot accommodate the required capacity, give it a score of 0
    - If a room doesn't have required features, significantly lower the score
    - Only return rooms that make sense for the given requirements

    Return only the JSON array without any additional text or formatting.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean the response and parse JSON
            const cleanedText = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const rankedRooms = JSON.parse(cleanedText);
            // Düşük skorlu odaları filtrele
            return rankedRooms.filter((room) => room.matchScore > 10);
        }
        catch (error) {
            console.error("Error ranking rooms with Gemini:", error);
            throw new Error("Failed to rank rooms");
        }
    }
    async generateBookingConfirmation(reservation) {
        const prompt = `
    Generate a friendly booking confirmation message for the following reservation:
    
    Room: ${reservation.roomNumber}
    User: ${reservation.userName}
    Date: ${new Date(reservation.startDatetime).toLocaleDateString()}
    Time: ${new Date(reservation.startDatetime).toLocaleTimeString()} - ${new Date(reservation.endDatetime).toLocaleTimeString()}
    Purpose: ${reservation.purpose || "Not specified"}
    
    Make it professional but friendly, and include any important details about the room.
    Keep it concise and informative.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error("Error generating confirmation message:", error);
            return "Your room has been successfully booked!";
        }
    }
}
exports.default = new GeminiService();
