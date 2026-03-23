import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse } from "@/lib/utils";
import { isGeminiConfigured } from "@/lib/supabase";

function fallbackInsights(hasSummaries: boolean) {
  return hasSummaries
    ? [
        {
          title: "Review follow-up timelines",
          description: "Recent records suggest checking whether CBC, ferritin, or vitamin-related panels need another follow-up date."
        },
        {
          title: "Track recurring deficiencies",
          description: "Your uploaded reports point to recurring monitoring around iron, vitamin levels, and preventive screening."
        },
        {
          title: "Prepare the next consultation",
          description: "Keep the newest prescription and the last two lab summaries ready to help your doctor review trends quickly."
        }
      ]
    : [
        {
          title: "Start by uploading reports",
          description: "The more recent your documents, the better MediHelp can organize follow-ups."
        },
        {
          title: "Keep profile details updated",
          description: "A complete profile makes trial matching and appointment requests more accurate."
        },
        {
          title: "Use hospitals and labs shortcuts",
          description: "You can move from records to nearby care options from the dashboard."
        }
      ];
}

export async function POST(request: Request) {
  try {
    const { summaries } = await request.json();
    const normalizedSummaries = (summaries || []).filter(Boolean);

    if (!normalizedSummaries.length) {
      return NextResponse.json({ insights: fallbackInsights(false) });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({ insights: fallbackInsights(true) });
    }

    try {
      const rawText = await callGemini(
        `Based on these medical document summaries from a patient: ${normalizedSummaries.join("\n")}.\n   Give exactly 3 short actionable health insights or reminders.\n   Respond in JSON only, no markdown: [{title, description}]`
      );

      const clean = cleanJsonResponse(rawText);
      const parsed = JSON.parse(clean);

      if (!Array.isArray(parsed) || !parsed.length) {
        return NextResponse.json({ insights: fallbackInsights(true) });
      }

      return NextResponse.json({ insights: parsed });
    } catch {
      return NextResponse.json({ insights: fallbackInsights(true) });
    }
  } catch (error) {
    return NextResponse.json({ insights: fallbackInsights(true) });
  }
}
