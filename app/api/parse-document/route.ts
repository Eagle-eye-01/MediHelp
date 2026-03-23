import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { cleanJsonResponse } from "@/lib/utils";
import type { ParsedDocument } from "@/types";

const systemPrompt = `You are a medical document parser for MediHelp, a patient health platform.
Analyze the provided medical document (lab report, prescription, or clinical note) and return ONLY a valid JSON object with this exact structure. No markdown, no explanation, just the JSON.

{
  "title": "Human-readable document title (e.g. Iron deficiency follow-up)",
  "subtitle": "One-line clinical context (e.g. Repeat hematology review)",
  "documentType": "LAB_REPORT | PRESCRIPTION | CLINICAL_NOTE | SCAN | OTHER",
  "date": "DD/MM/YYYY extracted from document, or null",
  "patientName": "Patient name if found, or null",
  "tags": ["array of 2-4 short category tags"],
  "keyInsights": ["2-4 short insight chips e.g. Hemoglobin 11.4 g/dL", "Improving trend", "Continue supplementation"],
  "sections": [
    {
      "heading": "CLINICAL NOTE",
      "content": "2-3 sentence narrative extracted or inferred from the document."
    },
    {
      "heading": "LAB INTERPRETATION",
      "content": "2-3 sentence interpretation of lab values if present. Omit this section entirely if no lab values exist."
    },
    {
      "heading": "MEDICATIONS",
      "content": "List medications if a prescription is present. Omit if not applicable."
    },
    {
      "heading": "RECOMMENDATIONS",
      "content": "Any follow-up actions or recommendations mentioned. Omit if not present."
    }
  ],
  "disease": "Primary condition/diagnosis mentioned",
  "patient": "Patient name"
}

Only include sections that have actual content from the document. Always include CLINICAL NOTE.`;

function sanitizeParsedDocument(value: ParsedDocument): ParsedDocument {
  return {
    title: value.title || "Medical document",
    subtitle: value.subtitle || null,
    documentType: value.documentType || "OTHER",
    date: value.date || null,
    patientName: value.patientName || value.patient || null,
    tags: (value.tags || []).filter(Boolean).slice(0, 4),
    keyInsights: (value.keyInsights || []).filter(Boolean).slice(0, 4),
    sections: (value.sections || [])
      .filter((section) => section?.heading && section?.content)
      .map((section) => ({
        heading: section.heading,
        content: section.content
      })),
    disease: value.disease || null,
    patient: value.patient || value.patientName || null
  };
}

function extractMimeType(fileUrl: string) {
  if (fileUrl.endsWith(".pdf")) return "application/pdf";
  if (fileUrl.endsWith(".png")) return "image/png";
  if (fileUrl.endsWith(".webp")) return "image/webp";
  if (fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg")) return "image/jpeg";
  return "application/pdf";
}

async function loadFileAsBase64({
  fileUrl,
  base64,
  mimeType
}: {
  fileUrl?: string;
  base64?: string;
  mimeType?: string;
}) {
  if (base64 && mimeType) {
    return { base64Data: base64, mimeType };
  }

  if (!fileUrl) {
    throw new Error("Missing file source");
  }

  if (fileUrl.startsWith("data:")) {
    const [meta, data] = fileUrl.split(",", 2);
    const detectedMimeType = meta.match(/data:(.*?);base64/)?.[1] || mimeType || "application/pdf";

    if (!data) {
      throw new Error("Invalid data URL");
    }

    return { base64Data: data, mimeType: detectedMimeType };
  }

  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Unable to fetch document");
  }

  const arrayBuffer = await response.arrayBuffer();
  const detectedMimeType = response.headers.get("content-type") || extractMimeType(fileUrl);
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  return {
    base64Data,
    mimeType: detectedMimeType
  };
}

export async function POST(request: Request) {
  try {
    // TODO: Add rate limiting before production
    const { fileUrl, base64, mimeType } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "parse_failed" }, { status: 500 });
    }

    const { base64Data, mimeType: resolvedMimeType } = await loadFileAsBase64({
      fileUrl,
      base64,
      mimeType
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { inlineData: { data: base64Data, mimeType: resolvedMimeType } },
      { text: systemPrompt }
    ]);
    const parsed = JSON.parse(cleanJsonResponse(result.response.text())) as ParsedDocument;

    return NextResponse.json({ parsed: sanitizeParsedDocument(parsed) });
  } catch {
    return NextResponse.json({ error: "parse_failed" }, { status: 500 });
  }
}
