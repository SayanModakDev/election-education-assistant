// Mock the import.meta.env before importing the service to prevent Vite ESM errors in Jest
global.import = { meta: { env: { API_KEY: 'test_mock_key' } } };

import { generateGeminiResponse, sanitizeInput } from '../services/GeminiService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock the official Google Generative AI SDK
jest.mock('@google/generative-ai', () => {
  const mGenerateContent = jest.fn();
  const mGetGenerativeModel = jest.fn(() => ({
    generateContent: mGenerateContent
  }));
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: mGetGenerativeModel
    }))
  };
});

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
      
      // Setup the SDK mock to resolve successfully
      const genAIInstance = new GoogleGenerativeAI();
      const mockModel = genAIInstance.getGenerativeModel();
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => mockResponseText
        }
      });

      const result = await generateGeminiResponse('How to vote?');
      
      expect(result).toBe(mockResponseText);
      expect(mockModel.generateContent).toHaveBeenCalledWith('How to vote?');
    });

    it('throws a general fallback error when the API fails abruptly', async () => {
      const genAIInstance = new GoogleGenerativeAI();
      const mockModel = genAIInstance.getGenerativeModel();
      
      // Simulate a total failure (e.g., 500 Internal Server Error)
      mockModel.generateContent.mockRejectedValue(new Error('Internal Server Error'));

      await expect(generateGeminiResponse('How to vote?')).rejects.toThrow(
        'Failed to generate a response from the AI. Please try again later.'
      );
      
      // Verify console.error was called for debugging purposes
      expect(console.error).toHaveBeenCalled();
    });

    it('throws a specific rate-limit error when receiving a 429 status', async () => {
      const genAIInstance = new GoogleGenerativeAI();
      const mockModel = genAIInstance.getGenerativeModel();
      
      // Simulate hitting the API rate limit
      mockModel.generateContent.mockRejectedValue(new Error('429 Too Many Requests'));

      await expect(generateGeminiResponse('How to vote?')).rejects.toThrow(
        'We are receiving too many requests. Please try again in a moment.'
      );
    });

    it('throws an error immediately if input is empty after sanitization without hitting API', async () => {
      const genAIInstance = new GoogleGenerativeAI();
      const mockModel = genAIInstance.getGenerativeModel();

      // Input is just HTML tags, which gets stripped to nothing
      await expect(generateGeminiResponse('   <p></p>   ')).rejects.toThrow(
        'Input is empty or invalid after sanitization.'
      );
      
      // Verify the API was NEVER called
      expect(mockModel.generateContent).not.toHaveBeenCalled();
    });
  });
});
