const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testInvalidRequest() {
  try {
    console.log('Testing Invalid Request: "Kedileri ve köpekleri çok seviyorum. 45 kedilik bir kafes istiyorum"');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const userPrompt = "Kedileri ve köpekleri çok seviyorum. 45 kedilik bir kafes istiyorum";
    
    const prompt = `
    You are an AI assistant for a ROOM BOOKING SYSTEM. Your ONLY job is to extract room booking requirements.

    User request: "${userPrompt}"

    CRITICAL VALIDATION RULES:
    1. ONLY process requests related to room booking, meeting rooms, study rooms, classrooms, or office spaces
    2. REJECT requests about: animals, pets, cages, personal items, food, shopping, or any non-room topics
    3. Look for these ROOM-RELATED keywords: room, meeting, study, classroom, office, space, booking, reservation, conference
    4. If the request is NOT about room booking, return: {"isValidRoomRequest": false}
    5. If request is valid but has no specific requirements, return: {"isValidRoomRequest": true}

    ROOM BOOKING KEYWORDS TO LOOK FOR:
    - "room", "meeting room", "study room", "classroom", "conference room"
    - "booking", "reservation", "need a space", "book a room"
    - "people", "students", "attendees", "participants" (in context of meetings)
    - Equipment: "projector", "screen", "microphone", "air conditioning"

    NON-ROOM KEYWORDS TO REJECT:
    - Animals: "cat", "dog", "pet", "animal", "cage", "kennel", "kedi", "köpek", "kafes"
    - Food: "restaurant", "kitchen", "food", "meal", "restoran", "yemek"
    - Shopping: "buy", "purchase", "shop", "store", "satın", "alışveriş"
    - Personal items: "house", "apartment", "car", "furniture", "ev", "araba"

    If this is a valid room booking request, extract requirements and return JSON:
    {
      "isValidRoomRequest": true,
      "capacity": number (only if people count mentioned for meetings/study),
      "hasProjector": boolean (true only if projector/presentation equipment mentioned),
      "hasAirConditioner": boolean (true only if AC/cooling mentioned),
      "hasMicrophone": boolean (true only if microphone/audio mentioned),
      "hasCamera": boolean (true only if camera/video mentioned),
      "hasNoiseCancelling": boolean (true only if quiet environment mentioned),
      "hasNaturalLight": boolean (true only if natural light mentioned),
      "roomType": "classroom" | "study_room" | null,
      "date": string (only if specific date mentioned),
      "startTime": string (only if start time mentioned),
      "endTime": string (only if end time mentioned),
      "purpose": string (only if meeting/study purpose mentioned)
    }

    If this is NOT a room booking request, return:
    {
      "isValidRoomRequest": false,
      "reason": "Brief explanation why this is not a room booking request"
    }

    Return ONLY the JSON object with no additional text.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text);
    
    // Clean the response
    let cleanedText = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^\s*\n/, '')
      .trim();
    
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    }
    
    try {
      const parsed = JSON.parse(cleanedText);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
      
      if (parsed.isValidRoomRequest === false) {
        console.log('✅ SUCCESS: Request correctly rejected as invalid');
        console.log('Reason:', parsed.reason);
      } else {
        console.log('❌ FAILED: Request was incorrectly accepted as valid');
      }
    } catch (parseError) {
      console.log('Parse error:', parseError.message);
      console.log('Cleaned text:', cleanedText);
    }
    
  } catch (error) {
    console.error('Error testing invalid request:', error);
  }
}

testInvalidRequest();
