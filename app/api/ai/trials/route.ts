import { NextResponse } from "next/server";

import { callGemini } from "@/lib/gemini";
import { cleanJsonResponse } from "@/lib/utils";
import { isGeminiConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { condition, city, ageRange } = await request.json();

    if (!condition) {
      return NextResponse.json({ error: "Condition is required" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        trials: [
          {
            trialName: `${condition} Lifestyle Management Study`,
            matchScore: 91,
            status: "Recruiting",
            location: `${city}, India`,
            contact: "+91 80 4000 1111",
            description: "Evaluates routine monitoring plus standard care for adults with similar symptoms."
          },
          {
            trialName: `${condition} Medication Adherence Program`,
            matchScore: 86,
            status: "Screening",
            location: `${city}, India`,
            contact: "+91 80 4000 2222",
            description: "Looks at how guided follow-ups improve outcomes in adults managing this condition."
          },
          {
            trialName: `${condition} Early Detection Registry`,
            matchScore: 79,
            status: "Open",
            location: `${city}, India`,
            contact: "+91 80 4000 3333",
            description: "Collects participant history and test trends to support future treatment research."
          }
        ]
      });
    }

    const age = `${ageRange?.[0] || 18}-${ageRange?.[1] || 60}`;
    const rawText = await callGemini(
      `Generate 3 realistic clinical trial listings for a patient with ${condition},\n   aged ${age}, in ${city}, India. Each must have: trialName, matchScore (number 0-100),\n   status, location, contact, description (1 sentence).\n   Respond in JSON array only, no markdown.`
    );

    const clean = cleanJsonResponse(rawText);
    const parsed = JSON.parse(clean);

    return NextResponse.json({ trials: parsed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate trials" },
      { status: 500 }
    );
  }
}
