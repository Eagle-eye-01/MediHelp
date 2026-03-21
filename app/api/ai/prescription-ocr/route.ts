import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse } from "@/lib/utils";
import { isGeminiConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { base64, mimeType } = await request.json();

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: "Missing image payload" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({ medicines: [] });
    }

    const rawText = await callGemini(
      'This is a medical prescription. Extract all medicine names written on it.\n   Respond in JSON array only, no markdown: ["MedicineName1", "MedicineName2"]',
      base64,
      mimeType
    );

    const clean = cleanJsonResponse(rawText);
    const parsed = JSON.parse(clean);

    return NextResponse.json({ medicines: parsed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to extract medicines" },
      { status: 500 }
    );
  }
}
