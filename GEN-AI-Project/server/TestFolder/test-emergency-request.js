const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testEmergencyRequest() {
  try {
    console.log('Testing Emergency Request: "Aliens attacked the school and took one of the rooms hostage. I urgently need an air-conditioned room for 10 people."');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const userPrompt = "Aliens attacked the school and took one of the rooms hostage. I urgently need an air-conditioned room for 10 people.";
    
    const prompt = `
You are an AI assistant for a ROOM BOOKING SYSTEM. Your ONLY job is to extract room booking requirements.

User request: "${userPrompt}"

CRITICAL VALIDATION RULES:
1. ONLY process requests related to room booking, meeting rooms, study rooms, classrooms, or office spaces
2. REJECT requests about: animals, pets, cages, personal items, food, shopping, emergencies, fictional scenarios, or any non-room topics
3. REJECT requests containing: violence, emergencies, aliens, disasters, hostage situations, or fictional scenarios
4. Look for LEGITIMATE room booking context: meetings, studies, conferences, presentations, work sessions
5. If the request is NOT about legitimate room booking, return: {"isValidRoomRequest": false}
6. If request mentions room but in wrong context (emergency, fictional, violence), return: {"isValidRoomRequest": false}

ROOM BOOKING KEYWORDS TO LOOK FOR (in legitimate context):
- "meeting room", "study room", "classroom", "conference room" for work/study purposes
- "booking", "reservation", "schedule a meeting", "book a room" for legitimate purposes
- "people", "students", "attendees", "participants" for meetings/study sessions
- Equipment: "projector", "screen", "microphone", "air conditioning" for work purposes

KEYWORDS TO IMMEDIATELY REJECT:
- Violence/Emergency: "attack", "emergency", "urgent", "hostage", "disaster"
- Fictional: "aliens", "monsters", "zombies"
- Inappropriate: "hide", "escape", "run", "save"
- Animals: "cat", "dog", "pet", "animal", "cage", "kennel"
- Food: "restaurant", "kitchen", "food", "meal"
- Shopping: "buy", "purchase", "shop", "store"

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
        console.log('✅ SUCCESS: Emergency request correctly rejected');
        console.log('Reason:', parsed.reason);
      } else {
        console.log('❌ FAILED: Emergency request was incorrectly accepted as valid');
      }
    } catch (parseError) {
      console.log('Parse error:', parseError.message);
      console.log('Cleaned text:', cleanedText);
    }
    
  } catch (error) {
    console.error('Error testing emergency request:', error);
  }
}

testEmergencyRequest();
