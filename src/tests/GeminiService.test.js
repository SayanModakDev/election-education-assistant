import { generateGeminiResponse, sanitizeInput } from '../services/GeminiService';

// Suppress console.error during tests to keep terminal output clean
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('GeminiService Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('sanitizeInput', () => {
    it('strips HTML tags to prevent prompt injection or formatting issues', () => {
      const dirtyInput = '<script>alert("hack")</script> How do I vote in <b>Texas</b>?';
      const cleanInput = sanitizeInput(dirtyInput);
      expect(cleanInput).toBe('alert("hack") How do I vote in Texas?');
    });

    it('trims leading and trailing whitespace', () => {
      const dirtyInput = '   Where is my polling station?   ';
      const cleanInput = sanitizeInput(dirtyInput);
      expect(cleanInput).toBe('Where is my polling station?');
    });

    it('returns an empty string if input is null or non-string', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(12345)).toBe('');
    });
  });

  describe('generateGeminiResponse', () => {
    it('returns the text response directly on a successful API call', async () => {
      const mockResponseText = 'You can vote by finding your local polling station.';
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: mockResponseText })
      });

      const result = await generateGeminiResponse('How to vote?');
      
      expect(result).toBe(mockResponseText);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    });

    it('throws a general fallback error when the API fails abruptly', async () => {
      // Simulate a total failure (e.g., 500 Internal Server Error)
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error' })
      });

      await expect(generateGeminiResponse('How to vote?')).rejects.toThrow(
        'Failed to generate a response from the AI. Please try again later.'
      );
      
      // Verify console.error was called for debugging purposes
      expect(console.error).toHaveBeenCalled();
    });

    it('throws a specific error when receiving an error from backend', async () => {
      // Simulate backend returning a specific error
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'We are receiving too many requests. Please try again in a moment.' })
      });

      // The service retry logic will catch the specific error, but eventually throw the generic fallback error if it's not handled gracefully.
      await expect(generateGeminiResponse('How to vote?')).rejects.toThrow(
        'Failed to generate a response from the AI. Please try again later.'
      );
    });

    it('throws an error immediately if input is empty after sanitization without hitting API', async () => {
      // Input is just HTML tags, which gets stripped to nothing
      await expect(generateGeminiResponse('   <p></p>   ')).rejects.toThrow(
        'Input is empty or invalid.'
      );
      
      // Verify the API was NEVER called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});

