const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testStudySession() {
  try {
    console.log('Testing specific study session request...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const userPrompt = "We are preparing for the final exam. We need a quiet study room for 5 students.";
    
    const prompt = `
You are an AI assistant for a ROOM BOOKING SYSTEM. Your ONLY job is to extract room booking requirements.

User request: "${userPrompt}"

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
✓ "Study room for exam preparation"
✓ "We are preparing for the final exam. We need a study room for 5 students."
✓ "Group study session for university students"

REJECT EXAMPLES (without listing specific keywords):
✗ Any request involving fictional scenarios, emergencies, or non-business contexts
✗ Creative or imaginative scenarios that aren't realistic room bookings
✗ Requests that seem like storytelling or hypothetical situations

Use your natural language understanding to determine if this is a GENUINE, REALISTIC room booking request.

If this is a valid room booking request, extract requirements and return JSON:
{
  "isValidRoomRequest": true,
  "capacity": 5,
  "hasNoiseCancelling": true,
  "roomType": "study_room",
  "purpose": "exam preparation"
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
      .trim();
    
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    }
    
    try {
      const parsed = JSON.parse(cleanedText);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
      
      if (parsed.isValidRoomRequest === true) {
        console.log('✅ Gemini correctly identifies this as a valid request');
      } else {
        console.log('❌ Gemini incorrectly rejects this request');
        console.log('Reason:', parsed.reason);
      }
    } catch (parseError) {
      console.log('Parse error:', parseError.message);
      console.log('Cleaned text:', cleanedText);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testStudySession();
