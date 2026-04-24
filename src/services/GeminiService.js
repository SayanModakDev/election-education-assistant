import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
// Priority 1: Cloud Run Runtime (window.ENV)
// Priority 2: Volatile Browser Memory (sessionStorage) - Best for secure local testing
// Priority 3: Build-time environment variables (import.meta.env)
const API_KEY = (window.ENV && window.ENV.VITE_API_KEY) || 
                sessionStorage.getItem('VITE_API_KEY') || 
                import.meta.env.VITE_API_KEY || '';

let genAI = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

/**
 * Sanitizes user input before sending it to the Gemini model.
 * Removes HTML tags, trims whitespace, and limits length.
 * 
 * @param {string} input - The raw user input
 * @returns {string} The sanitized input string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  // Strip potential HTML tags to prevent prompt injection or strange formatting
  let sanitized = input.replace(/<[^>]*>?/gm, '');

  // Trim leading/trailing whitespace
  sanitized = sanitized.trim();

  // Limit length to a reasonable threshold for the app context (e.g., 2000 chars)
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized;
};

// In-memory cache to avoid redundant API calls for repeated questions
const promptCache = new Map();

/**
 * Sends a sanitized prompt to the Gemini model and retrieves the response.
 * Implements robust error handling to gracefully degrade if the API fails.
 * Returns cached responses for previously asked questions.
 * 
 * @param {string} prompt - The user's query
 * @param {string} modelName - The Gemini model to use (defaults to 'gemini-2.5-flash-lite')
 * @returns {Promise<string>} The model's response text
 */
export const generateGeminiResponse = async (prompt, modelName = 'gemini-2.5-flash-lite') => {
  if (!API_KEY || !genAI) {
    throw new Error('Gemini API key is not configured. Please inject VITE_API_KEY into sessionStorage or your environment.');
  }

  const sanitizedPrompt = sanitizeInput(prompt);
  if (!sanitizedPrompt) {
    throw new Error('Input is empty or invalid after sanitization.');
  }

  // 1. Capture the exact live date and time when the user hits 'Send'
  const currentDateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  // 2. Check cache before making an API call
  if (promptCache.has(sanitizedPrompt)) {
    return promptCache.get(sanitizedPrompt);
  }

  // 3. Inject time awareness, search grounding, generation tuning, and safety settings
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `You are a strictly non-partisan, highly accessible civic assistant specializing in the Indian electoral process. Educate users based on Election Commission of India (ECI) guidelines. 
    CRITICAL TIME AWARENESS: The user's current live date and time is ${currentDateTime}. Use your Google Search tool to fetch the absolute latest news, facts, and live election updates whenever a user asks about current events, today's news, or 2026 elections. Do not hallucinate past dates.
    
    OUTPUT STRATEGY (MANDATORY):
    All responses MUST follow this exact structure:
    1. Quick Overview (2-3 lines)
    2. Step-by-Step Explanation (numbered)
    3. Example (real-world or scenario)
    4. Key Takeaway (1-2 lines)
    5. Next Best Action (guidance for improvement or exploration)
    
    RESPONSE RULES:
    - Be strictly neutral (no political bias). If asked about political preferences, respond with neutral evaluation guidance.
    - Use simple, clean language. Avoid long paragraphs.
    - Keep responses between 120-180 words.
    - For processes/timelines, always use a guided, step-by-step flow.`,
    tools: [
      { googleSearch: {} } // <-- This single line gives the AI full internet access
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 800,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  });
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Call the API
      const result = await model.generateContent(sanitizedPrompt);
      const response = await result.response;
      const text = response.text();

      // Cache the successful response for future identical queries
      promptCache.set(sanitizedPrompt, text);
      return text;
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      const errorMessage = error.message || '';

      // If the error is a transient server error (500, 503, 504), we retry with backoff
      const isTransientError = /500|503|504/.test(errorMessage);

      if (isTransientError && !isLastAttempt) {
        const delay = Math.pow(2, i) * 1000;
        console.warn(`Gemini API transient error (${errorMessage}). Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Log the actual error for debugging, but we throw a user-friendly error
      console.error('GeminiService Error:', error);

      // Check for specific API errors
      if (errorMessage.includes('429')) {
        throw new Error('We are receiving too many requests. Please try again in a moment.');
      }

      throw new Error('Failed to generate a response from the AI. Please try again later.');
    }
  }
};
