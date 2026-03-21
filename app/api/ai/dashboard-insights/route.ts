import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse } from "@/lib/utils";
import { isGeminiConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { summaries } = await request.json();
    const normalizedSummaries = (summaries || []).filter(Boolean);

    if (!normalizedSummaries.length) {
      return NextResponse.json({
        insights: [
          { title: "Start by uploading reports", description: "The more recent your documents, the better MediHelp can organize follow-ups." },
          { title: "Keep profile details updated", description: "A complete profile makes trial matching and appointment requests more accurate." },
          { title: "Use hospitals and labs shortcuts", description: "You can move from records to nearby care options from the dashboard." }
        ]
      });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        insights: [
          { title: "Review recent labs", description: "Check whether the newest report suggests any follow-up testing or repeat timelines." },
          { title: "Track recurring patterns", description: "Compare symptoms or deficiencies across uploads to spot ongoing themes." },
          { title: "Prepare for your next visit", description: "Keep the latest three summaries ready when reaching out to a doctor." }
        ]
      });
    }

    const rawText = await callGemini(
      `Based on these medical document summaries from a patient: ${normalizedSummaries.join("\n")}.\n   Give exactly 3 short actionable health insights or reminders.\n   Respond in JSON only, no markdown: [{title, description}]`
    );

    const clean = cleanJsonResponse(rawText);
    const parsed = JSON.parse(clean);

    return NextResponse.json({ insights: parsed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create insights" },
      { status: 500 }
    );
  }
}
