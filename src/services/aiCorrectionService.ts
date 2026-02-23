import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function getTypingCorrection(typedText: string, targetText: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. AI correction will not work.");
    return null;
  }

  try {
    const prompt = `Given the target Arabic sentence: "${targetText}" and the user's typed Arabic text: "${typedText}", identify any mistakes (wrong letters, missing letters, extra letters) and provide a corrected version of the user's input. Focus only on the Arabic text. If the typed text is correct, just return the target text.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using a flash model for quick responses
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 100,
      },
    });

    return response.text || null;
  } catch (error) {
    console.error("Error getting AI correction:", error);
    return null;
  }
}

export async function getDetailedTypingCorrection(typedText: string, targetText: string): Promise<{ correctedText: string, feedback: string } | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Detailed AI correction will not work.");
    return null;
  }

  try {
    const prompt = `Compare the TARGET Arabic sentence: "${targetText}" with the USER'S TYPED Arabic text: "${typedText}".
    Provide a JSON object with two fields:
    1. 'correctedText': The user's typed text with corrections applied to match the target. Highlight changes using HTML <u> for additions and <del> for deletions/replacements. Example: "السلام <u>عليكم</u>" or "مرحبا <del>بك</del> <u>يا</u> صديقي".
    2. 'feedback': A brief, encouraging explanation of the mistakes found, if any, focusing on specific letters or words. If no mistakes, state that the typing is perfect.
    Ensure the 'correctedText' is a complete Arabic sentence, even if the user's input is incomplete.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 200,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            feedback: { type: Type.STRING },
          },
          required: ["correctedText", "feedback"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse;
  } catch (error) {
    console.error("Error getting detailed AI correction:", error);
    return null;
  }
}
