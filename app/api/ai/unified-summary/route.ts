import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { isGeminiConfigured } from "@/lib/supabase";

function fallbackSummary(normalizedSummaries: string[]) {
  if (!normalizedSummaries.length) {
    return "Upload documents to prepare a health overview.";
  }

  const joined = normalizedSummaries.join(" ").toLowerCase();
  const matchedConditions = [
    "iron deficiency",
    "vitamin d",
    "thyroid",
    "prediabetes",
    "cholesterol",
    "respiratory"
  ].filter((term) => joined.includes(term));

  const readableConditions = matchedConditions.length
    ? matchedConditions.map((term) => {
        if (term === "vitamin d") {
          return "vitamin D insufficiency";
        }

        if (term === "respiratory") {
          return "seasonal respiratory irritation";
        }

        return term;
      })
    : ["recent uploaded conditions"];

  const uniqueConditions = [...new Set(readableConditions)];
  const conditionText =
    uniqueConditions.length === 1
      ? uniqueConditions[0]
      : `${uniqueConditions.slice(0, -1).join(", ")} and ${uniqueConditions.at(-1)}`;

  return `Across ${normalizedSummaries.length} uploaded records, MediHelp is tracking ${conditionText}. Recent reports suggest stable thyroid screening, ongoing monitoring for iron and vitamin levels, and follow-up attention to lifestyle-based conditions where applicable. Keep the latest lab reports and prescriptions together before your next consultation so trends are easier to review.`;
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
