import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { isGeminiConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { summaries } = await request.json();
    const normalizedSummaries = (summaries || []).filter(Boolean);

    if (!normalizedSummaries.length) {
      return NextResponse.json({ summary: "Upload documents to prepare a health overview." });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        summary:
          "This patient has a set of recent medical documents stored in MediHelp. Review the individual summaries to prepare a more complete overall health snapshot."
      });
    }

    const summary = await callGemini(
      `Summarize this patient's overall health history in 2-3 sentences based on\n   these document summaries: ${normalizedSummaries.join(" ")}. Keep it clear and non-alarming.\n   Respond with plain text only.`
    );

    return NextResponse.json({ summary: summary.trim() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare summary" },
      { status: 500 }
    );
  }
}
