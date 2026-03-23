import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const candidateModels = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002"
].filter(Boolean) as string[];

export async function callGemini(
  prompt: string,
  imageBase64?: string,
  mimeType?: string
): Promise<string> {
  let lastError: unknown;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      if (imageBase64 && mimeType) {
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType
            }
          }
        ]);

        return result.response.text();
      }

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini request failed for all configured model candidates.");
}

export const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));
