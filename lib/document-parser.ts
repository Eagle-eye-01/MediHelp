"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { ParsedDocument } from "@/types";

export async function parseAndStoreDocument(
  documentId: string,
  fileUrl: string,
  supabase: SupabaseClient
): Promise<ParsedDocument | null> {
  try {
    const response = await fetch("/api/parse-document", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl })
    });

    const data = await response.json();

    if (!response.ok || !data.parsed) {
      return null;
    }

    // TODO: Trigger via Supabase Edge Function webhook in production for async processing
    const { error } = await supabase
      .from("documents")
      .update({
        parsed_data: data.parsed,
        disease_name: data.parsed.disease || data.parsed.title || "",
        patient_name: data.parsed.patientName || data.parsed.patient || ""
      })
      .eq("id", documentId);

    if (error) {
      throw error;
    }

    return data.parsed as ParsedDocument;
  } catch {
    return null;
  }
}
