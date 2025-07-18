const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Import the updated service interface
const RoomRequirements = {
  capacity: undefined,
  hasProjector: undefined,
  hasAirConditioner: undefined,
  hasMicrophone: undefined,
  hasCamera: undefined,
  hasNoiseCancelling: undefined,
  hasNaturalLight: undefined,
  roomType: undefined,
  date: undefined,
  startTime: undefined,
  endTime: undefined,
  purpose: undefined
};

async function testUpdatedGemini() {
  try {
    console.log('Testing Updated Gemini API with irrelevant input...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Test cases with irrelevant content
    const testCases = [
      "Hello! Good morning. I hope you're doing well. By the way, I need a room for 5 people with a projector for a presentation. Thank you so much!",
      "Hi there! Can you help me find something? I'm looking for a study room. Oh, and I like coffee. The room should have natural light if possible.",
      "Hey, how are you today? The weather is nice. I need a quiet room for 10 students. Also, I forgot to mention I need a microphone for the session.",
      "Good afternoon! I hope this message finds you well. Could you assist me? I'm organizing a meeting and need a room with air conditioning for 8 people. Have a great day!"
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      console.log(`\n--- Test Case ${i + 1} ---`);
      console.log('Input:', testCases[i]);
      
      const prompt = `
      You are an AI assistant for a room booking system. Your task is to extract ONLY room-related requirements from the user's request. Ignore any irrelevant information, casual conversation, or unrelated topics.

      User request: "${testCases[i]}"

      IMPORTANT RULES:
      1. Focus ONLY on room booking requirements
      2. Ignore greetings, pleasantries, or unrelated conversation
      3. If no specific requirements are mentioned, leave fields as null/undefined
      4. Only set boolean fields to true if explicitly mentioned or clearly implied
      5. Be conservative - don't assume requirements that aren't stated

      Extract ONLY the following room requirements and return a valid JSON object:

      - capacity: number (only if people count is mentioned)
      - hasProjector: boolean (true only if projector/presentation/display equipment explicitly mentioned)
      - hasAirConditioner: boolean (true only if air conditioning/AC/cooling explicitly mentioned)  
      - hasMicrophone: boolean (true only if microphone/mic/audio equipment explicitly mentioned)
      - hasCamera: boolean (true only if camera/recording/video equipment explicitly mentioned)
      - hasNoiseCancelling: boolean (true only if quiet/noise cancelling/silent environment explicitly mentioned)
      - hasNaturalLight: boolean (true only if natural light/window/daylight explicitly mentioned)
      - roomType: string (only "classroom" for lectures/presentations or "study_room" for meetings/study - leave null if unclear)
      - date: string (ISO date format only if specific date mentioned)
      - startTime: string (time format only if specific start time mentioned)
      - endTime: string (time format only if specific end time mentioned)
      - purpose: string (brief description only if purpose is clearly stated)

      Return ONLY the JSON object with no additional text, markdown formatting, or explanations.
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
      } catch (parseError) {
        console.log('Parse error:', parseError.message);
        console.log('Cleaned text:', cleanedText);
      }
    }
    
  } catch (error) {
    console.error('Error testing updated Gemini:', error);
  }
}

testUpdatedGemini();
