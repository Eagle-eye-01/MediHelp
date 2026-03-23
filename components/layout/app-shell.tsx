"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, FileText, FlaskConical, LayoutDashboard, LogOut, MapPin, Menu, Pill, Settings, TestTube2, Upload, User, X, Activity } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { BillingStatusModal } from "@/components/BillingStatusModal";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Clinical Trials", href: "/trials", icon: FlaskConical },
  { name: "Hospital", href: "/hospital", icon: MapPin },
  { name: "Labs", href: "/labs", icon: TestTube2 },
  { name: "Medicines", href: "/medicines", icon: Pill }
];

const notifications = [
  {
    id: "notify-1",
    title: "New AI summary ready",
    body: "Your latest uploaded report has been organized into a plain-language summary."
  },
  {
    id: "notify-2",
    title: "Medicine reminder",
    body: "Your tracked refill window starts in the next 5 days."
  },
  {
    id: "notify-3",
    title: "Nearby lab availability",
    body: "Two partner labs have same-day morning slots open near your location."
  }
];

export function AppShell({
  children,
  name,
  email
}: {
  children: React.ReactNode;
  name?: string | null;
  email?: string | null;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const initials = getInitials(name || email);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [isMobile, pathname]);

  async function handleSignOut() {
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      router.push("/auth/login?forceLogin=1");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign out");
    }
  }

  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF4FF_100%)] selection:bg-blue-500/20">
      {isMobile && sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white/96 backdrop-blur transition-transform duration-300 ${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <Link className="flex items-center gap-3" href="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-400 shadow-[0_16px_40px_-18px_rgba(37,99,235,0.75)]">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-950">MediHelp</p>
              <p className="text-xs text-slate-500">Your Health, Organised.</p>
            </div>
          </Link>
          {isMobile ? (
            <button
              className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 active:scale-95"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (pathname !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
                href={item.href}
                key={item.name}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {isActive ? <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_100%)] p-4">
            <p className="text-sm font-semibold text-slate-950">Protected workspace</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Records, appointments, and care suggestions stay in one secure flow.
            </p>
          </div>
        </div>
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${!isMobile ? "ml-72" : ""}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {isMobile ? (
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:scale-95"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">Care workspace</p>
                <h1 className="text-lg font-semibold capitalize tracking-tight text-slate-950 sm:text-xl">
                  {pathname === "/" ? "Home" : pathname.replace("/", "").replace("-", " ")}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  className="relative rounded-full text-slate-600 hover:text-slate-950"
                  onClick={() => setNotificationsOpen((value) => !value)}
                  size="icon"
                  variant="ghost"
                >
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                  <Bell className="h-5 w-5" />
                </Button>
                {notificationsOpen ? (
                  <div className="absolute right-0 mt-3 w-[22rem] rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Notifications</p>
                        <p className="text-xs text-slate-500">Recent updates that need your attention.</p>
                      </div>
                      <button
                        className="rounded-full px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 active:scale-95"
                        onClick={() => {
                          setNotificationsOpen(false);
                          toast.success("Notifications marked as reviewed.");
                        }}
                        type="button"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {notifications.map((item) => (
                        <button
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:border-blue-200 hover:bg-blue-50 active:scale-[0.99]"
                          key={item.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            toast.message(item.title, { description: item.body });
                          }}
                          type="button"
                        >
                          <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 pr-3 shadow-sm active:scale-95"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  type="button"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                    {initials}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-slate-950">{name || "MediHelp User"}</p>
                    <p className="text-xs text-slate-500">{email || "Health workspace"}</p>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
                {profileMenuOpen ? (
                  <div className="absolute right-0 mt-3 w-60 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
                    <Link
                      className="flex min-h-[44px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      href="/profile"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      className="flex min-h-[44px] items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      href="/profile#password-section"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setBillingOpen(true);
                      }}
                      type="button"
                    >
                      <FileText className="h-4 w-4" />
                      Billing Status
                    </button>
                    <button
                      className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                      onClick={handleSignOut}
                      type="button"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <BillingStatusModal onClose={() => setBillingOpen(false)} open={billingOpen} />
    </div>
  );
}
