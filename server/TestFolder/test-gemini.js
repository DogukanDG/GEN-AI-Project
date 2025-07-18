const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Extract room requirements from: I need a room for 5 people with a projector. Return JSON with capacity and hasProjector fields only.";
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text);
    
    // Try to parse as JSON
    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      console.log('Parsed JSON:', parsed);
    } catch (parseError) {
      console.log('Could not parse as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('Error testing Gemini:', error);
  }
}

testGemini();
