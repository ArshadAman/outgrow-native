// GeminiService.js
// Service for interacting with Google Gemini API for quiz/tip generation

// GeminiService.js
// Service for interacting with Google Gemini API for quiz/tip generation

const GEMINI_API_KEY = 'AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI'; // TODO: Replace with your Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class GeminiService {
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
      // Log the full Gemini API response for debugging
      console.log('[GeminiService] Full Gemini API response:', JSON.stringify(data));
      // Return the raw text part for downstream parsing
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      return result;
    } catch (error) {
      console.error('Gemini API error:', error);
      return null;
    }
  }
}


// Individual feed item generators for useDailyFeed.js
export async function fetchGeminiTip(techStack) {
  // Request a random, general tech tip (not language-specific)
  const prompt = `Give me a single, practical coding tip for developers. Do not mention any specific programming language. Make it actionable and relevant for modern software engineers. Respond in one or two sentences, no markdown, no stars.`;
  let result = await GeminiService.generateQuizOrTip(prompt);
  // Remove markdown and stars
  result = result ? result.replace(/[*`#>\-]/g, '').trim() : 'Always write clean, modular code.';
  return {
    title: 'Gemini Tip of the Day',
    content: result,
    xp: 10,
    desc: result
  };
}

export async function fetchGeminiQuiz(techStack) {
  // Request a multiple-choice question only (no answer/explanation)
  const prompt = `Generate a single multiple-choice question for software developers. Only provide the question and 4 options. Do not include the answer or any explanation. Make it relevant for coding, dev, AI, ML, or DevOps. Respond in plain text, no markdown, no stars.`;
  let result = await GeminiService.generateQuizOrTip(prompt);
  // Remove markdown and stars
  result = result ? result.replace(/[*`#>\-]/g, '').trim() : `What is the main advantage of using ${techStack[0]}?\nA) Performance\nB) Scalability\nC) Ease of use\nD) Security`;
  // Parse question and options
  let question = '', options = [];
  const lines = result.split('\n').filter(Boolean);
  if (lines.length >= 5) {
    question = lines[0];
    options = lines.slice(1, 5).map(opt => opt.replace(/^[A-D][).]?\s*/, ''));
  } else {
    question = result;
    options = ['Performance', 'Scalability', 'Ease of use', 'Security'];
  }
  return {
    title: 'Daily Quiz',
    content: {
      question,
      options,
      // answer: null (will be set after user selects)
    },
    xp: 15
  };
}

export async function fetchGeminiChallenge(techStack) {
  // Request a practical coding challenge, no markdown
  const prompt = `Give me a practical coding challenge for developers. Make it suitable for 15-30 minutes. Do not use markdown, stars, or language-specific details. Respond in plain text.`;
  let result = await GeminiService.generateQuizOrTip(prompt);
  result = result ? result.replace(/[*`#>\-]/g, '').trim() : `Build a simple app that prints 'Hello World'.`;
  return {
    title: 'Coding Challenge',
    content: result,
    xp: 20
  };
}

export async function fetchGeminiResource(techStack) {
  // Request a curated resource for dev/AI/ML/DevOps, with why and benefit
  const prompt = `Suggest a single curated online resource (URL + description) for developers, AI, ML, or DevOps. Explain why it's useful and what users can gain. Respond in plain text, no markdown, no stars.`;
  let result = await GeminiService.generateQuizOrTip(prompt);
  result = result ? result.replace(/[*`#>\-]/g, '').trim() : `https://www.example.com - A great resource for developers to learn best practices.`;
  // Parse URL and description
  let url = '', desc = '';
  const urlMatch = result.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    url = urlMatch[1];
    desc = result.replace(url, '').replace(/[-–—]/, '').trim();
  } else {
    url = 'https://www.example.com';
    desc = result;
  }
  return {
    title: 'Curated Resource',
    content: {
      url,
      desc
    },
    xp: 10
  };
}
