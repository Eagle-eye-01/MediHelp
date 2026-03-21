import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { demoDocuments } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { makeSuggestedDocumentName } from "@/lib/utils";
import type { MedicalDocument } from "@/types";

function renameDocuments(documents: MedicalDocument[]) {
  return documents.map((document) => ({
    ...document,
    file_name: makeSuggestedDocumentName(
      document.patient_name,
      document.disease_name,
      document.upload_date
    )
  }));
}

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        documents: renameDocuments(demoDocuments)
      });
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id);

    const renamed = renameDocuments((data as MedicalDocument[]) || []);

    await Promise.all(
      renamed.map((document) =>
        supabase
          .from("documents")
          .update({ file_name: document.file_name })
          .eq("id", document.id)
      )
    );

    return NextResponse.json({ documents: renamed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to rename documents" },
      { status: 500 }
    );
  }
}
