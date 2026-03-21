"use client";

import { useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({
  children,
  name,
  email
}: {
  children: React.ReactNode;
  name?: string | null;
  email?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar email={email} name={name} onMenuClick={() => setIsOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
