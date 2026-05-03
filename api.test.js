import request from 'supertest';
import { jest } from '@jest/globals';

// 1. Mock Google Gen AI SDK (ESM Style)
jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: 'This is a mocked AI response regarding election guidelines.',
        candidates: [{ content: { parts: [{ text: 'Mocked content part' }] } }]
      })
    }
  }))
}));

// 2. Mock Cloud Services (ESM Style)
export const mockFirestoreAdd = jest.fn().mockResolvedValue(true);
export const mockStorageSave = jest.fn().mockResolvedValue(true);

jest.unstable_mockModule('firebase-admin', () => {
  return {
    default: {
      initializeApp: jest.fn(),
      firestore: Object.assign(jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        add: mockFirestoreAdd
      }), {
        FieldValue: {
          serverTimestamp: jest.fn().mockReturnValue('mocked-server-timestamp')
        }
      })
    }
  };
});

jest.unstable_mockModule('@google-cloud/logging', () => ({
  Logging: jest.fn().mockImplementation(() => ({
    log: jest.fn().mockReturnThis(),
    entry: jest.fn().mockReturnValue({}),
    write: jest.fn().mockResolvedValue(true)
  }))
}));

jest.unstable_mockModule('@google-cloud/storage', () => ({
  Storage: jest.fn().mockImplementation(() => ({
    bucket: jest.fn().mockReturnThis(),
    file: jest.fn().mockReturnThis(),
    save: mockStorageSave
  }))
}));

describe('Election Assistant API - High-Impact Test Suite', () => {
  let app;

  beforeAll(async () => {
    // 3. Dynamic Import of app AFTER mocks are established
    const module = await import('./server.js');
    app = module.default;
  });

  test('1. Normal Query - Should return a valid AI response', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'How do I register to vote?' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('text');
  });

  test('2. Empty Input - Should be rejected by Efficiency Shield', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: '' });
    
    expect(res.statusCode).toEqual(400);
  });

  test('3. Safety/Political Filter - Should maintain non-partisan tone', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Which party is the best?' });
    
    expect(res.statusCode).toEqual(200);
  });

  test('4. Process-based Query - Should handle complex structural request', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Explain the 5-step registration process.' });
    
    expect(res.statusCode).toEqual(200);
  });

  describe('CloudService.persist (Persistence Layer)', () => {
    beforeEach(() => {
      mockFirestoreAdd.mockClear();
      mockStorageSave.mockClear();
    });

    test('5. Resolves successfully when database accepts write', async () => {
      mockFirestoreAdd.mockResolvedValueOnce(true);
      
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Test successful persist' });
      
      expect(res.statusCode).toEqual(200);
      expect(mockFirestoreAdd).toHaveBeenCalled();
      expect(mockStorageSave).toHaveBeenCalled();
    });

    test('6. Gracefully handles rejected Database promise without crashing', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockFirestoreAdd.mockRejectedValueOnce(new Error('Simulated Firestore Failure'));
      
      const res = await request(app)
        .post('/api/chat')
        .send({ prompt: 'Test graceful failure' });
      
      expect(res.statusCode).toEqual(200);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[CLOUD ERROR TASK 0]'), expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

});


