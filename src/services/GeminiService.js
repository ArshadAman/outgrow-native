// GeminiService.js
// Service for interacting with Google Gemini API for quiz/tip generation

// GeminiService.js
// Service for interacting with Google Gemini API for quiz/tip generation

const GEMINI_API_KEY = 'AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI'; // TODO: Replace with your Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiService {
  // Call Gemini API with a prompt and return the result
  static async generateQuizOrTip(prompt) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      const data = await response.json();
      // Parse Gemini response for generated content
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      return result;
    } catch (error) {
      console.error('Gemini API error:', error);
      return null;
    }
  }
}

export default GeminiService;
