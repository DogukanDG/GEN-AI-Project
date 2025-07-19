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

// Option 1: More Strict Validation (Recommended)
async validateRoomRequest(userPrompt: string): Promise<ValidationResult> {
  console.log("=== Validating room request ===");
  console.log("User prompt:", userPrompt);

  const validationPrompt = `
  You are a multilingual room booking system validator. Analyze the following user request in ANY language and determine if it's a legitimate room booking request.

  User request: "${userPrompt}"

   IMPORTANT VALIDATION RULES:
  
  HIGH CONFIDENCE (80-95%) - Strong room booking indicators:
  - Explicit booking intent: "book room", "reserve", "need room", "oda rezervasyonu"
  - Capacity + room words: "30 people room", "30 kişilik oda", "sala para 30 personas"
  - Specific room requests: "meeting room", "classroom", "conference room"
  - Time-based requests: "room for tomorrow", "yarın için oda"

  MEDIUM CONFIDENCE (60-79%) - Clear but incomplete:
  - Capacity mentions: "30 people capacity", "30 kişi kapasiteli", "para 30 personas"
  - Equipment requests: "room with projector", "projektörlü oda"
  - Basic room mentions: "need space", "alan lazım"

  LOW CONFIDENCE (40-59%) - Vague but potentially valid:
  - Generic room mentions without specifics
  - Unclear intent but room-related words

  INVALID (0-39%) - Not room booking requests:
  - Completely unrelated topics
  - Personal conversations
  - Other services

  KEY INSIGHT: A request mentioning "30 people capacity" is HIGHLY LIKELY to be a room booking request. 
  Even without explicit booking words, capacity specification is a strong indicator.
  Someone asking about "30 people capacity" is clearly looking for a space to accommodate 30 people.

  EXAMPLES:
  ✓ "30 people capacity" → Should be 75-80% confidence (clear capacity need)
  ✓ "I need a room for 30 people" → Should be 90-95% confidence
  ✓ "30 kişilik oda" → Should be 85-90% confidence
  ✓ "sala para 30 personas" → Should be 85-90% confidence
  ✗ "what's the weather like" → 0% confidence
  ✗ "hello how are you" → 0% confidence

  Return ONLY a JSON object:
  {
    "isValid": true/false,
    "confidence": 0-100,
    "reason": "brief explanation"
  }

  Remember: Capacity specification is a STRONG indicator of room booking intent.
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
    
    // REMOVED: The problematic override logic
    // Only return the AI's decision
    return validation;
    
  } catch (error) {
    console.error("Error validating request:", error);
    
    // More strict fallback - only if very clear keywords
    const hasStrongRoomKeywords = this.hasStrongRoomKeywords(userPrompt);
    
    return {
      isValid: hasStrongRoomKeywords,
      confidence: hasStrongRoomKeywords ? 50 : 0,
      reason: hasStrongRoomKeywords ? "Fallback validation - strong room keywords detected" : "Unable to validate request and no clear room keywords found",
    };
  }
}

// Option 2: Stricter Keyword Detection
private hasStrongRoomKeywords(text: string): boolean {
  const strongRoomKeywords = [
    // Strong room booking indicators only
    'room booking', 'reserve room', 'book room', 'oda rezervasyon', 'sala reserva',
    'meeting room', 'toplantı odası', 'sala de reunión', 'salle de réunion',
    'classroom', 'sınıf', 'clase', 'aula',
    'conference room', 'konferans odası'
  ];

  const capacityIndicators = [
    'people', 'kişi', 'personas', 'personnes', 'personen'
  ];

  const lowerText = text.toLowerCase();
  
  // Must have either strong room keywords OR (room word + capacity)
  const hasStrongKeyword = strongRoomKeywords.some(keyword => lowerText.includes(keyword));
  const hasRoomAndCapacity = 
    ['room', 'oda', 'sala', 'salle', 'raum'].some(room => lowerText.includes(room)) &&
    capacityIndicators.some(cap => lowerText.includes(cap));

  return hasStrongKeyword || hasRoomAndCapacity;
}

  async parseRoomRequest(userPrompt: string): Promise<RoomRequirements> {
   console.log("=== Gemini parseRoomRequest started ===");
  console.log("User prompt:", userPrompt);

  // Validate the request first
  const validation = await this.validateRoomRequest(userPrompt);

  // More strict validation check
  if (!validation.isValid || validation.confidence < 75) { // Increased threshold
    console.log("Validation failed:", validation);
    throw new Error(
      `Invalid room booking request: ${
        validation.reason ||
        "Request does not appear to be related to room booking"
      }. Confidence: ${validation.confidence}%`
    );
  }

  // Add additional check: if confidence is low but valid, double-check
  if (validation.isValid && validation.confidence < 80) {
    console.log("Low confidence validation, double-checking...");
    
    // Simple keyword verification
    if (!this.hasStrongRoomKeywords(userPrompt)) {
      throw new Error(
        `Low confidence room booking request (${validation.confidence}%) and no strong room keywords detected`
      );
    }
  }

  // Continue with the rest of your parsing logic...
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

 async rankRooms(
    requirements: RoomRequirements,
    availableRooms: any[]
  ): Promise<any[]> {
    const roomsData = JSON.stringify(availableRooms, null, 2);
    const requirementsData = JSON.stringify(requirements, null, 2);

    const prompt = `
    You are an AI assistant for a room booking system. Rank the following rooms based on how well they match the user requirements with SPECIAL FOCUS ON CAPACITY MATCHING.

    User Requirements:
    ${requirementsData}

    Available Rooms:
    ${roomsData}

    CAPACITY SCORING RULES (Most Important - 60% of total score):
    ${requirements.capacity ? `
    - Requested capacity: ${requirements.capacity} people
    - Perfect match (exact capacity): 60 points
    - Close match (±2 people): 50-55 points  
    - Acceptable range (±5 people): 40-45 points
    - Over capacity but usable (up to +50%): 30-35 points
    - Under capacity (cannot fit everyone): 0 points
    - Heavily over capacity (more than 2x needed): 10-20 points
    
    Example scoring for ${requirements.capacity} people:
    - Room for ${requirements.capacity} people: 60 points
    - Room for ${requirements.capacity - 1}-${requirements.capacity + 1} people: 55 points
    - Room for ${requirements.capacity - 2}-${requirements.capacity + 2} people: 50 points
    - Room for ${requirements.capacity - 5}-${requirements.capacity + 5} people: 45 points
    - Room for ${Math.ceil(requirements.capacity * 1.5)} people: 30 points
    - Room for ${requirements.capacity * 2} people: 15 points
    ` : 'No capacity specified - give equal weight to other features'}

    OTHER FEATURES SCORING (40% of total score):
    ONLY score for explicitly requested features:
    - Required features match: +10 points each (only if user requested)
    - Room type match: +10 points (only if user specified)
    - Time/date availability: +10 points (only if user specified)
    - DO NOT give bonus points for unrequested features
    - If no other features requested, give full 40 points to capacity-only requests

    Please rank the rooms from best to worst match and return a JSON array with the following structure:
    [
      {
        "roomNumber": "room_number",
        "matchScore": 0-100,
        "capacityScore": 0-60,
        "featuresScore": 0-40,
        "matchReasons": ["reason1", "reason2"],
        "room": { original room object }
      }
    ]

    IMPORTANT: 
    - If user ONLY specified capacity, focus 100% on capacity matching
    - Only give points for features the user explicitly requested
    - DO NOT give bonus points for extra features user didn't ask for
    - Calculate capacity score first (0-60 points if other features requested, 0-100 if only capacity)
    - Then calculate features score ONLY for requested features
    - Sort by total score (highest first)

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

  // Alternatif olarak, JavaScript ile de kapacity scoring yapabiliriz
  private calculateCapacityScore(
    requestedCapacity: number, 
    roomCapacity: number, 
    isOnlyCapacity: boolean = false
  ): number {
    console.log(`calculateCapacityScore called:`, {
      requestedCapacity,
      roomCapacity, 
      isOnlyCapacity,
      hasRequestedCapacity: !!requestedCapacity,
      hasRoomCapacity: !!roomCapacity
    });

    if (!requestedCapacity || !roomCapacity) {
      const defaultScore = isOnlyCapacity ? 50 : 30;
      console.log(`Missing capacity data, returning default: ${defaultScore}`);
      return defaultScore;
    }

    const maxScore = isOnlyCapacity ? 100 : 60; // Eğer sadece kapasite isteniyorsa tam puan
    const difference = Math.abs(roomCapacity - requestedCapacity);

    console.log(`Capacity calculation:`, {
      maxScore,
      difference,
      ratio: roomCapacity / requestedCapacity
    });

    // Oda çok küçükse (herkesi alamazsa)
    if (roomCapacity < requestedCapacity) {
      console.log(`Room too small: ${roomCapacity} < ${requestedCapacity}, returning 0`);
      return 0;
    }

    // Mükemmel eşleşme
    if (difference === 0) {
      console.log(`Perfect match, returning ${maxScore}`);
      return maxScore;
    }

    // Yakın eşleşme (±1-2 kişi)
    if (difference <= 2) {
      const score = Math.round(maxScore * 0.9) - (difference * 2);
      console.log(`Close match (±2), returning ${score}`);
      return score;
    }

    // Kabul edilebilir aralık (±3-5 kişi)
    if (difference <= 5) {
      const score = Math.round(maxScore * 0.75) - (difference * 2);
      console.log(`Acceptable range (±5), returning ${score}`);
      return score;
    }

    // Kapasitesi fazla ama kullanılabilir
    const ratio = roomCapacity / requestedCapacity;
    if (ratio <= 1.5) {
      const score = Math.max(Math.round(maxScore * 0.5), Math.round(maxScore * 0.75) - difference);
      console.log(`Over capacity but usable (ratio: ${ratio}), returning ${score}`);
      return score;
    }

    // Çok büyük oda (2 katından fazla)
    if (ratio > 2) {
      const score = Math.round(maxScore * 0.1);
      console.log(`Way over capacity (ratio: ${ratio}), returning ${score}`);
      return score;
    }

    const score = Math.max(Math.round(maxScore * 0.25), Math.round(maxScore * 0.6) - difference);
    console.log(`Default case, returning ${score}`);
    return score;
  }

  // Ana ranking fonksiyonu - önce AI dener, başarısız olursa JavaScript fallback
  async rankRoomsWithFallback(
    requirements: RoomRequirements,
    availableRooms: any[]
  ): Promise<any[]> {
    try {
      // Önce AI ile ranking yap
      const aiRanked = await this.rankRooms(requirements, availableRooms);
      return aiRanked;
    } catch (error) {
      console.warn("AI ranking failed, using fallback JavaScript scoring:");
      
      // Fallback: JavaScript ile scoring
      const scored = availableRooms.map(room => {
        let totalScore = 0;
        let reasons: string[] = [];
        
        // Sadece talep edilen özellikler sayılır - boolean tipine çevir
        const onlyCapacityRequested: boolean = Boolean(
          requirements.capacity && 
          !requirements.hasProjector && 
          !requirements.hasAirConditioner && 
          !requirements.hasMicrophone && 
          !requirements.hasCamera && 
          !requirements.roomType && 
          !requirements.date
        );

        // Kapasite scoring
        if (requirements.capacity) {
          const capacityScore = this.calculateCapacityScore(
            requirements.capacity, 
            room.capacity, 
            onlyCapacityRequested
          );
          
          // Debug logs
          console.log(`Room ${room.roomNumber || room.id}:`, {
            requestedCapacity: requirements.capacity,
            roomCapacity: room.capacity,
            onlyCapacityRequested,
            capacityScore,
            maxScorePossible: onlyCapacityRequested ? 100 : 60
          });
          
          totalScore += capacityScore;
          
          if (capacityScore >= (onlyCapacityRequested ? 90 : 55)) {
            reasons.push(`Perfect capacity match (${room.capacity} people)`);
          } else if (capacityScore >= (onlyCapacityRequested ? 75 : 40)) {
            reasons.push(`Good capacity match (${room.capacity} people)`);
          } else if (capacityScore === 0) {
            reasons.push(`Insufficient capacity (${room.capacity} < ${requirements.capacity})`);
          } else {
            reasons.push(`Acceptable capacity (${room.capacity} people)`);
          }
        } else {
          // Kapasite belirtilmemişse sabit skor ver
          const defaultScore = 40;
          totalScore += defaultScore;
          console.log(`Room ${room.roomNumber || room.id}: No capacity requirement, default score: ${defaultScore}`);
        }

        // Sadece talep edilen özellikler için puan ver
        let featuresScore = 0;
        if (requirements.hasProjector === true && room.hasProjector) {
          featuresScore += 10;
          reasons.push("Has required projector");
        }
        if (requirements.hasAirConditioner === true && room.hasAirConditioner) {
          featuresScore += 10;
          reasons.push("Has required air conditioner");
        }
        if (requirements.hasMicrophone === true && room.hasMicrophone) {
          featuresScore += 10;
          reasons.push("Has required microphone");
        }
        if (requirements.hasCamera === true && room.hasCamera) {
          featuresScore += 10;
          reasons.push("Has required camera");
        }
        if (requirements.roomType && room.roomType === requirements.roomType) {
          featuresScore += 10;
          reasons.push(`Matches room type: ${requirements.roomType}`);
        }

        // Eğer sadece kapasite isteniyorsa, features score ekleme
        if (!onlyCapacityRequested) {
          totalScore += featuresScore;
        }

        return {
          roomNumber: room.roomNumber || room.id,
          matchScore: Math.min(totalScore, 100),
          capacityScore: requirements.capacity ? 
            this.calculateCapacityScore(requirements.capacity, room.capacity, onlyCapacityRequested) : 50,
          featuresScore: onlyCapacityRequested ? 0 : featuresScore,
          matchReasons: reasons,
          room: room
        };
      });

      // Skora göre sırala
      return scored.sort((a, b) => b.matchScore - a.matchScore);
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
