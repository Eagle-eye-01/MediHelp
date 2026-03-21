import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard");
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  redirect(session ? "/dashboard" : "/auth/login");
}
