import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { doctorId, message } = await request.json();

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor is required" }, { status: 400 });
    }

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

    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      doctor_id: doctorId,
      appointment_date: new Date(Date.now() + 86400000).toISOString(),
      medical_history_sent: true,
      message,
      status: "pending"
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create appointment" },
      { status: 500 }
    );
  }
}
