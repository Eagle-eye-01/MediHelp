import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { demoDocuments } from "@/lib/mock-data";
import { extractStoragePathFromPublicUrl } from "@/lib/utils";

export async function PATCH(
  request: Request,
  {
    params
  }: {
    params: { id: string };
  }
) {
  try {
    const payload = await request.json();

    if (!isSupabaseConfigured()) {
      const current = demoDocuments.find((item) => item.id === params.id);
      return NextResponse.json({
        document: {
          ...current,
          ...payload
        }
      });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("documents")
      .update(payload)
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ document: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  {
    params
  }: {
    params: { id: string };
  }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true });
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existing, error: existingError } = await supabase
      .from("documents")
      .select("id, file_url")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const storagePath = extractStoragePathFromPublicUrl(existing.file_url);

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("medical-documents")
        .remove([storagePath]);

      if (storageError) {
        throw storageError;
      }
    }

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete document" },
      { status: 500 }
    );
  }
}
