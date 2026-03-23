import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isGeminiConfigured } from "@/lib/supabase";
import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse, makeSuggestedDocumentName } from "@/lib/utils";

async function analyzeDocument(base64: string, mimeType: string) {
  if (!isGeminiConfigured()) {
    return {
      patientName: "Patient",
      diseaseName: "Medical Record",
      summary:
        "Medical document uploaded successfully. Configure Gemini to extract richer insights automatically.",
      suggestedFilename: `Patient_MedicalRecord_${new Date().toISOString().slice(0, 10)}`
    };
  }

  const rawText = await callGemini(
    'You are a medical document analyzer. Extract from this document:\n   1. Patient name\n   2. Disease or condition name\n   3. A 2-3 sentence plain-language summary\n   4. A suggested filename in format: PatientName_DiseaseName_YYYY-MM-DD\n   Respond in JSON only, no markdown: { patientName, diseaseName, summary, suggestedFilename }',
    base64,
    mimeType
  );

  return JSON.parse(cleanJsonResponse(rawText));
}

export async function POST(request: Request) {
  try {
    const { name, mimeType, size, base64 } = await request.json();

    if (!name || !mimeType || !size || !base64) {
      return NextResponse.json({ error: "Missing upload payload." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await analyzeDocument(base64, mimeType);
    const uploadDate = new Date().toISOString();
    const fileName =
      analysis.suggestedFilename ||
      makeSuggestedDocumentName(analysis.patientName, analysis.diseaseName, uploadDate);

    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        file_name: fileName,
        original_name: name,
        file_url: `data:${mimeType};base64,${base64}`,
        file_type: mimeType,
        file_size: size,
        ai_summary: analysis.summary || "",
        disease_name: analysis.diseaseName || "",
        patient_name: analysis.patientName || user.user_metadata?.name || "Patient",
        upload_date: uploadDate,
        is_compressed: false
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ document: data });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to upload document"
      },
      { status: 500 }
    );
  }
}
