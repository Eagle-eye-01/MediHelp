"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivitySquare,
  ClipboardCheck,
  FlaskConical,
  LayoutDashboard,
  MapPinned,
  Pill,
  UploadCloud,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: UploadCloud },
  { label: "Check & Edit", href: "/documents", icon: ClipboardCheck },
  { label: "Clinical Trial Finder", href: "/trials", icon: ActivitySquare },
  { label: "Hospital", href: "/hospital", icon: MapPinned },
  { label: "Labs", href: "/labs", icon: FlaskConical },
  { label: "Medicines", href: "/medicines", icon: Pill }
];

export function Sidebar({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <p className="text-xl font-semibold text-primary">MediHelp</p>
            <p className="text-xs text-slate-500">Personal health companion</p>
          </div>
          <Button className="lg:hidden" onClick={onClose} variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium transition-colors active:scale-95",
                  active
                    ? "bg-blue-50 text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                href={item.href}
                key={item.href}
                onClick={onClose}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 px-4 py-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Need care fast?</p>
            <p className="mt-1 text-xs text-slate-600">
              Upload recent reports and head to hospitals to share history quickly.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
