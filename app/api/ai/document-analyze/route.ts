import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse } from "@/lib/utils";
import { isGeminiConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { base64, mimeType } = await request.json();

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: "Missing document payload" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        patientName: "Patient",
        diseaseName: "Medical Record",
        summary: "Medical document uploaded successfully. Configure Gemini to extract richer insights automatically.",
        suggestedFilename: `Patient_MedicalRecord_${new Date().toISOString().slice(0, 10)}`
      });
    }

    const rawText = await callGemini(
      'You are a medical document analyzer. Extract from this document:\n   1. Patient name\n   2. Disease or condition name\n   3. A 2-3 sentence plain-language summary\n   4. A suggested filename in format: PatientName_DiseaseName_YYYY-MM-DD\n   Respond in JSON only, no markdown: { patientName, diseaseName, summary, suggestedFilename }',
      base64,
      mimeType
    );

    const clean = cleanJsonResponse(rawText);
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Document analysis failed"
      },
      { status: 500 }
    );
  }
}
