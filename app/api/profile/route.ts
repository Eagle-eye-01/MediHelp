import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrl
} from "@/lib/supabase";

export async function DELETE() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 501 });
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Account deletion requires SUPABASE_SERVICE_ROLE_KEY." },
        { status: 501 }
      );
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase.from("users_profile").delete().eq("id", user.id);
    await supabase.from("documents").delete().eq("user_id", user.id);

    const admin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete account" },
      { status: 500 }
    );
  }
}
