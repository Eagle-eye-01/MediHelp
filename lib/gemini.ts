import "server-only";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(
  prompt: string,
  imageBase64?: string,
  mimeType?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
}

export const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));
