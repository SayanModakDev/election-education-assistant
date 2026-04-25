/**
 * Sanitizes user input before sending it to the model.
 * 
 * @param {string} input - The raw user input
 * @returns {string} The sanitized input string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  let sanitized = input.replace(/<[^>]*>?/gm, '').trim();
  return sanitized.length > 2000 ? sanitized.substring(0, 2000) : sanitized;
};

// Persistence-aware cache to avoid redundant API calls
const PROMPT_CACHE_KEY = 'gemini_prompt_cache';
const getPromptCache = () => {
  try {
    const cached = sessionStorage.getItem(PROMPT_CACHE_KEY);
    return cached ? new Map(JSON.parse(cached)) : new Map();
  } catch {
    return new Map();
  }
};

const savePromptCache = (cache) => {
  try {
    sessionStorage.setItem(PROMPT_CACHE_KEY, JSON.stringify(Array.from(cache.entries())));
  } catch {
    // Silently fail if storage is full
  }
};

const promptCache = getPromptCache();

/**
 * Sends a sanitized prompt to the backend proxy and retrieves the AI response.
 * Implements persistent caching and robust error handling.
 * 
 * @param {string} prompt - The user's query
 * @param {string} modelName - The Gemini model to use (defaults to 'gemini-2.5-flash-lite')
 * @returns {Promise<string>} The model's response text
 */
export const generateGeminiResponse = async (prompt, modelName = 'gemini-2.5-flash-lite') => {
  const sanitizedPrompt = sanitizeInput(prompt);
  if (!sanitizedPrompt) {
    throw new Error('Input is empty or invalid.');
  }

  // 1. Check persistent cache before making a network call
  if (promptCache.has(sanitizedPrompt)) {
    return promptCache.get(sanitizedPrompt);
  }

  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // 1. Retrieve volatile API key from browser storage
      const volatileApiKey = sessionStorage.getItem('VITE_API_KEY');

      // 2. Direct call to our secure backend proxy with volatile key injection
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: sanitizedPrompt, 
          modelName,
          apiKey: volatileApiKey // Inject volatile key
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const text = data.text;

      // 2. Update persistent cache
      promptCache.set(sanitizedPrompt, text);
      savePromptCache(promptCache);

      return text;
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      if (isLastAttempt) {
        console.error('GeminiService Error:', error);
        throw new Error('Failed to generate a response from the AI. Please try again later.');
      }

      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
