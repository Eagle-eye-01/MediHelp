import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({
      request
    });
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set({
          name,
          value,
          ...options
        });

        response = NextResponse.next({
          request
        });

        response.cookies.set({
          name,
          value,
          ...options
        });
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.set({
          name,
          value: "",
          ...options
        });

        response = NextResponse.next({
          request
        });

        response.cookies.set({
          name,
          value: "",
          ...options
        });
      }
    }
  });

  await supabase.auth.getUser();

  return response;
}
