import { GoogleGenAI } from '@google/genai';


const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT_ID || 'election-edu-assistant',
  location: "us-central1",
});

async function test() {
  console.log('Testing AI connection with Project ID:', process.env.GCP_PROJECT_ID || 'election-edu-assistant');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
    });

    console.log('SUCCESS!');
    console.log('Full Response Structure:', JSON.stringify(response, null, 2));
    console.log('Extracted Text:', response.text);
  } catch (error) {
    console.error('--- AI TEST FAILED ---');
    console.error(error);
    console.error('-----------------------');
  }
}

test();
