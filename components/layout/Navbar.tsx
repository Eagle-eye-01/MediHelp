"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Settings, User, LogOut, Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { getInitials } from "@/lib/utils";

export function Navbar({
  onMenuClick,
  name,
  email
}: {
  onMenuClick: () => void;
  name?: string | null;
  email?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const initials = useMemo(() => getInitials(name || email), [email, name]);

  async function handleLogout() {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
      }
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log out");
    }
  }

  return (
    <nav className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:scale-95 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <span className="block font-semibold text-blue-600 text-lg">MediHelp</span>
          <span className="hidden text-xs text-slate-500 sm:block">
            Keep your records, visits, and care plans in one place.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="hidden sm:inline-flex" variant="ghost">
          <Bell className="h-4 w-4" />
          Updates
        </Button>
        <div className="relative">
          <button
            className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 active:scale-95"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-slate-900">{name || "Profile"}</span>
              <span className="block text-xs text-slate-500">{email || "Manage account"}</span>
            </span>
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
              <Link
                className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-700 hover:bg-slate-50"
                href="/profile"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm text-slate-700 hover:bg-slate-50"
                href="/profile?tab=settings"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
