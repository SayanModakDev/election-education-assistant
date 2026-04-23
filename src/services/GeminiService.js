import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API using the Vite environment variable
// Fallback to empty string to prevent immediate crash if env var is missing during setup
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

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

/**
 * Sends a sanitized prompt to the Gemini model and retrieves the response.
 * Implements robust error handling to gracefully degrade if the API fails.
 * 
 * @param {string} prompt - The user's query
 * @param {string} modelName - The Gemini model to use (defaults to 'gemini-2.5-flash-lite')
 * @returns {Promise<string>} The model's response text
 */
export const generateGeminiResponse = async (prompt, modelName = 'gemini-2.5-flash-lite') => {
  if (!API_KEY || !genAI) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const sanitizedPrompt = sanitizeInput(prompt);
  if (!sanitizedPrompt) {
    throw new Error('Input is empty or invalid after sanitization.');
  }

  const model = genAI.getGenerativeModel({ model: modelName });
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Call the API
      const result = await model.generateContent(sanitizedPrompt);
      const response = await result.response;

      return response.text();
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
