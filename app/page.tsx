import { MediHelpLanding } from "@/components/marketing/medihelp-landing";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function HomePage() {
  let authenticated = false;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const {
      data: { session }
    } = await supabase.auth.getSession();

    authenticated = Boolean(session);
  }

  return <MediHelpLanding authenticated={authenticated} />;
}
