import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase-middleware";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(_name: string, _value: string, _options: Record<string, unknown>) {},
      remove(_name: string, _options: Record<string, unknown>) {}
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const forceLogin = request.nextUrl.searchParams.get("forceLogin") === "1";
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = !isAuthRoute && pathname !== "/" && pathname !== "/pricing";

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isAuthRoute && !forceLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
};
