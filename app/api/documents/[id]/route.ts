import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { demoDocuments } from "@/lib/mock-data";

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
