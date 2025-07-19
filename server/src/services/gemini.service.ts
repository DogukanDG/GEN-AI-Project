import { GoogleGenerativeAI } from "@google/generative-ai";

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

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  reason?: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // YÖNTEM 1: Gemini'nin kendi dil yeteneklerini kullan
  private getCurrentDateContext(): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return `
Current Date Context:
- Today is: ${
      today.toISOString().split("T")[0]
    } (${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")})
- Tomorrow is: ${tomorrow.toISOString().split("T")[0]}
- Current year: ${today.getFullYear()}
- Current month: ${today.getMonth() + 1}
- Current day: ${today.getDate()}
`;
  }

  // YÖNTEM 2: Çok dilli tarih normalizasyonu için ayrı API çağrısı
  private async normalizeDateExpression(userPrompt: string): Promise<string> {
    const dateContext = this.getCurrentDateContext();

    const normalizationPrompt = `
${dateContext}

You are a multilingual date expression normalizer. Convert ANY date-related expressions in the following text to ISO date format (YYYY-MM-DD).

Text: "${userPrompt}"

Rules:
1. Understand date expressions in ANY language (Turkish, English, Spanish, French, German, etc.)
2. Convert relative dates: "tomorrow/yarın/mañana/demain" → actual ISO date
3. Convert specific dates: "15 July/15 temmuz/15 julio" → ISO format with current year if not specified
4. Keep non-date parts of the text unchanged
5. If no date expressions found, return the text as-is

Examples:
- "yarın için 30 kişilik oda" → "2025-07-16 için 30 kişilik oda"
- "15 temmuz toplantı" → "2025-07-15 toplantı"
- "mañana necesito sala" → "2025-07-16 necesito sala"
- "demain salle pour 20" → "2025-07-16 salle pour 20"
- "next week meeting" → "2025-07-22 meeting"

Return ONLY the normalized text, no explanations.
`;

    try {
      const result = await this.model.generateContent(normalizationPrompt);
      const response = await result.response;
      const normalizedText = response.text().trim();

      console.log("Date normalization:", userPrompt, "→", normalizedText);
      return normalizedText;
    } catch (error) {
      console.error("Error normalizing date:", error);
      // Hata durumunda orijinal metni döndür
      return userPrompt;
    }
  }

  // YÖNTEM 3: JavaScript Date parsing kütüphanesi kullan
  private async parseWithDateLibrary(userPrompt: string): Promise<string> {
    // Bu örnekte chrono-node benzeri bir kütüphane kullanılabilir
    // npm install chrono-node

    try {
      // Örnek: chrono-node kullanımı (kurulu değilse çalışmaz)
      /*
      const chrono = require('chrono-node');
      const parsed = chrono.parseDate(userPrompt);
      if (parsed) {
        const isoDate = parsed.toISOString().split('T')[0];
        return userPrompt.replace(/yarın|tomorrow|mañana|demain/gi, isoDate);
      }
      */

      // Basit JavaScript Date parsing
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return userPrompt
        .replace(
          /yarın|tomorrow|mañana|demain|завтра|明日/gi,
          tomorrow.toISOString().split("T")[0]
        )
        .replace(
          /bugün|today|hoy|aujourd'hui|сегодня|今日/gi,
          today.toISOString().split("T")[0]
        );
    } catch (error) {
      console.error("Error parsing with date library:", error);
      return userPrompt;
    }
  }

  async validateRoomRequest(userPrompt: string): Promise<ValidationResult> {
    console.log("=== Validating room request ===");
    console.log("User prompt:", userPrompt);

    const validationPrompt = `
    You are a multilingual room booking system validator. Analyze the following user request in ANY language and determine if it's a legitimate room booking request.

    User request: "${userPrompt}"

    A valid room booking request should contain:
    - Intent to book, reserve, or find a room/space (in any language)
    - Some indication of use (meeting, study, class, presentation, etc.)
    - May include: number of people, equipment needs, time, date, features

    Invalid requests include:
    - Completely unrelated topics (cooking, shopping, nature, etc.)
    - Nonsensical or gibberish text
    - Requests that have nothing to do with rooms or bookings

    Return ONLY a JSON object with this structure:
    {
      "isValid": true/false,
      "confidence": 0-100,
      "reason": "brief explanation if not valid"
    }

    Examples:
    - "I need a room for 10 people" → {"isValid": true, "confidence": 95}
    - "10 kişilik oda lazım" → {"isValid": true, "confidence": 95}
    - "necesito sala para 10 personas" → {"isValid": true, "confidence": 95}
    - "I want to cook dinner" → {"isValid": false, "confidence": 95, "reason": "About cooking, not room booking"}
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

      console.log("Validation result:", validation);
      return validation;
    } catch (error) {
      console.error("Error validating request:", error);
      return {
        isValid: false,
        confidence: 0,
        reason: "Unable to validate request",
      };
    }
  }

  async parseRoomRequest(userPrompt: string): Promise<RoomRequirements> {
    console.log("=== Gemini parseRoomRequest started ===");
    console.log("User prompt:", userPrompt);

    // Önce prompt'u validate et
    const validation = await this.validateRoomRequest(userPrompt);

    if (!validation.isValid || validation.confidence < 70) {
      throw new Error(
        `Invalid room booking request: ${
          validation.reason ||
          "Request does not appear to be related to room booking"
        }`
      );
    }

    // SEÇENEK 1: Tarih normalizasyonu yap (önerilen)
    const normalizedPrompt = await this.normalizeDateExpression(userPrompt);

    // SEÇENEK 2: Veya JavaScript parsing kullan
    // const normalizedPrompt = await this.parseWithDateLibrary(userPrompt);

    const dateContext = this.getCurrentDateContext();

    const prompt = `
    You are a multilingual AI assistant for a room booking system. Parse the following user request in ANY language and extract room requirements.

    ${dateContext}

    User request: "${normalizedPrompt}"

    IMPORTANT: 
    - Understand requests in ANY language (Turkish, English, Spanish, French, German, etc.)
    - The date expressions have been normalized to ISO format if present
    - Extract room-related information regardless of language

    Please extract the following information and return ONLY a valid JSON object:
    - capacity: number of people (if mentioned in any language)
    - hasProjector: true/false/null (if projector/projektör/proyector mentioned)
    - hasAirConditioner: true/false/null (if AC/klima/aire acondicionado mentioned)
    - hasMicrophone: true/false/null (if microphone/mikrofon/micrófono mentioned)
    - hasCamera: true/false/null (if camera/kamera/cámara mentioned)
    - hasNoiseCancelling: true/false/null (if quiet/sessiz/silencioso mentioned)
    - hasNaturalLight: true/false/null (if natural light/doğal ışık/luz natural mentioned)
    - roomType: "classroom" or "study_room" or null (meeting/toplantı/reunión = study_room, lecture/ders/clase = classroom)
    - date: ISO date string (YYYY-MM-DD) - should be normalized already
    - startTime: time string (HH:MM format)
    - endTime: time string (HH:MM format)
    - purpose: brief description of purpose

    Language examples:
    - "yarın 30 kişilik oda" → {"capacity": 30, "date": "2025-07-16"}
    - "tomorrow room for 30 people" → {"capacity": 30, "date": "2025-07-16"}
    - "mañana sala para 30 personas" → {"capacity": 30, "date": "2025-07-16"}
    - "demain salle pour 30 personnes" → {"capacity": 30, "date": "2025-07-16"}

    Return only the JSON object without any additional text or formatting.
    `;

    try {
      console.log("Calling Gemini API...");
      const result = await this.model.generateContent(prompt);
      console.log("Gemini API response received");

      const response = await result.response;
      const text = response.text();
      console.log("Raw Gemini response:", text);

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      console.log("Cleaned response:", cleanedText);

      const parsedRequirements = JSON.parse(cleanedText);
      console.log("Parsed requirements:", parsedRequirements);

      if (!this.hasValidRoomRequirements(parsedRequirements)) {
        throw new Error("No valid room requirements found in the request");
      }

      return parsedRequirements;
    } catch (error) {
      console.error("Error parsing room request with Gemini:", error);
      throw new Error("Failed to parse room requirements");
    }
  }

  private hasValidRoomRequirements(requirements: RoomRequirements): boolean {
    const hasCapacity = !!requirements.capacity && requirements.capacity > 0;
    const hasFeatures =
      !!requirements.hasProjector ||
      !!requirements.hasAirConditioner ||
      !!requirements.hasMicrophone ||
      !!requirements.hasCamera ||
      !!requirements.hasNoiseCancelling ||
      !!requirements.hasNaturalLight;
    const hasRoomType = !!requirements.roomType;
    const hasTimeInfo =
      !!requirements.date || !!requirements.startTime || !!requirements.endTime;
    const hasPurpose =
      !!requirements.purpose && requirements.purpose.trim().length > 0;

    return (
      hasCapacity || hasFeatures || hasRoomType || hasTimeInfo || hasPurpose
    );
  }

  // Diğer metodlar aynı kalıyor...
  async rankRooms(
    requirements: RoomRequirements,
    availableRooms: any[]
  ): Promise<any[]> {
    // Mevcut kod aynı
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

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const rankedRooms = JSON.parse(cleanedText);

      return rankedRooms;
    } catch (error) {
      console.error("Error ranking rooms with Gemini:", error);
      throw new Error("Failed to rank rooms");
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
    Purpose: ${reservation.purpose || "Not specified"}
    
    Make it professional but friendly, and include any important details about the room.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating confirmation message:", error);
      return "Your room has been successfully booked!";
    }
  }
}

export default new GeminiService();
