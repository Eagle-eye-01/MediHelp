import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { name, email, password, gender, dob } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured for registration." },
        { status: 501 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          gender,
          dob
        }
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("users_profile").upsert({
        id: data.user.id,
        name,
        gender,
        dob,
        email
      });

      if (profileError) {
        throw profileError;
      }
    }

    return NextResponse.json({
      success: true,
      hasSession: Boolean(data.session),
      redirectTo: data.session ? "/dashboard" : "/auth/login",
      message: data.session
        ? "Account created successfully."
        : "Account created. Check your email to confirm before signing in."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create your account right now."
      },
      { status: 500 }
    );
  }
}
