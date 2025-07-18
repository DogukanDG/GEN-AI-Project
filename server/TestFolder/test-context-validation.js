const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testContextBasedValidation() {
  try {
    console.log('Testing Context-Based Validation Approach...\n');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const testCases = [
      {
        name: "Alien Attack (Original Problem)",
        prompt: "Aliens attacked the school and took one of the rooms hostage. I urgently need an air-conditioned room for 10 people.",
        expectedResult: "REJECT"
      },
      {
        name: "Dragon Attack (New Fictional Scenario)",
        prompt: "Dragons have taken over the city! I want a room for 15 people for a meeting of wizards.",
        expectedResult: "REJECT"
      },
      {
        name: "Time Travel Meeting",
        prompt: "We will have a meeting with robots from the future, I need a room for 20 people in the year 2080.",
        expectedResult: "REJECT"
      },
      {
        name: "Zombie Apocalypse",
        prompt: "A zombie outbreak has started, find a quiet room to hide.",
        expectedResult: "REJECT"
      },
      {
        name: "Normal Meeting",
        prompt: "We have a client meeting tomorrow, I want to reserve a projector-equipped room for 8 people.",
        expectedResult: "ACCEPT"
      },
      {
        name: "Study Session",
        prompt: "We are preparing for the final exam, we want a quiet study room for 5 students.",
        expectedResult: "ACCEPT"
      }
    ];
    
    const contextPrompt = `
You are an AI assistant for a ROOM BOOKING SYSTEM. Your ONLY job is to extract room booking requirements.

User request: "{{USER_REQUEST}}"

CONTEXT-BASED VALIDATION APPROACH:
Analyze the INTENT and CONTEXT of the request. Ask yourself:
1. Is this a genuine request for booking a physical meeting/study room in a normal business/academic setting?
2. Does this request involve normal, everyday workplace or educational activities?
3. Is the requester looking for a space for legitimate professional, academic, or study purposes?

AUTOMATICALLY REJECT if the request involves:
- Any fictional, fantasy, or sci-fi scenarios (regardless of specific words used)
- Emergency, crisis, or urgent situations that seem unrealistic or dramatic
- Non-human entities or supernatural elements
- Any context that doesn't align with normal room booking in offices/schools/universities
- Requests that seem like creative writing, jokes, or hypothetical scenarios
- Any purpose that isn't genuine meeting, study, conference, presentation, or work-related

ACCEPT ONLY if the request is:
- A straightforward room booking for meetings, studies, conferences, presentations
- Contains realistic business or academic context
- Mentions normal human activities in professional/educational settings
- Has a legitimate, practical purpose

LEGITIMATE ROOM BOOKING EXAMPLES:
✓ "Need a meeting room for 10 people tomorrow"
✓ "Book a study room with projector for presentation"
✓ "Conference room for client meeting next week"
✓ "Classroom for training session"

REJECT EXAMPLES (without listing specific keywords):
✗ Any request involving fictional scenarios, emergencies, or non-business contexts
✗ Creative or imaginative scenarios that aren't realistic room bookings
✗ Requests that seem like storytelling or hypothetical situations

Use your natural language understanding to determine if this is a GENUINE, REALISTIC room booking request.

If this is a valid room booking request, extract requirements and return JSON:
{
  "isValidRoomRequest": true,
  "capacity": number,
  "hasProjector": boolean,
  "hasAirConditioner": boolean,
  "purpose": string
}

If this is NOT a room booking request, return:
{
  "isValidRoomRequest": false,
  "reason": "Brief explanation why this is not a room booking request"
}

Return ONLY the JSON object with no additional text.
    `;
    
    for (const testCase of testCases) {
      console.log(`--- Testing: ${testCase.name} ---`);
      console.log(`Input: "${testCase.prompt}"`);
      
      const prompt = contextPrompt.replace('{{USER_REQUEST}}', testCase.prompt);
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response
        let cleanedText = text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        
        const jsonStart = cleanedText.indexOf('{');
        const jsonEnd = cleanedText.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
        }
        
        const parsed = JSON.parse(cleanedText);
        
        const actualResult = parsed.isValidRoomRequest ? "ACCEPT" : "REJECT";
        const isCorrect = actualResult === testCase.expectedResult;
        
        console.log(`Expected: ${testCase.expectedResult}, Got: ${actualResult} ${isCorrect ? '✅' : '❌'}`);
        if (!parsed.isValidRoomRequest) {
          console.log(`Reason: ${parsed.reason}`);
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('Error testing context-based validation:', error);
  }
}

testContextBasedValidation();
