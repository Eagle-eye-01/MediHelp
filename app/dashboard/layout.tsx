import { getCurrentUserProfile } from "@/lib/data";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      {children}
    </AppShell>
  );
}
