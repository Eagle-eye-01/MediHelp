import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { isGeminiConfigured } from "@/lib/supabase";

function fallbackSummary(normalizedSummaries: string[]) {
  if (!normalizedSummaries.length) {
    return "Upload documents to prepare a health overview.";
  }

  return `MediHelp found ${normalizedSummaries.length} document summary${
    normalizedSummaries.length === 1 ? "" : "ies"
  } for this patient. Review the uploaded reports together to understand recent conditions, medications, and likely follow-up needs.`;
}

export async function POST(request: Request) {
  try {
    const { summaries } = await request.json();
    const normalizedSummaries = (summaries || []).filter(Boolean);

    if (!normalizedSummaries.length) {
      return NextResponse.json({ summary: fallbackSummary(normalizedSummaries) });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({ summary: fallbackSummary(normalizedSummaries) });
    }

    try {
      const summary = await callGemini(
        `Summarize this patient's overall health history in 2-3 sentences based on\n   these document summaries: ${normalizedSummaries.join(" ")}. Keep it clear and non-alarming.\n   Respond with plain text only.`
      );

      return NextResponse.json({ summary: summary.trim() || fallbackSummary(normalizedSummaries) });
    } catch {
      return NextResponse.json({ summary: fallbackSummary(normalizedSummaries) });
    }
  } catch (error) {
    return NextResponse.json({ summary: fallbackSummary([]) });
  }
}
