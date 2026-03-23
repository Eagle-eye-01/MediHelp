import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { getCurrentUserProfile } from "@/lib/data";

export default async function ProfilePage() {
  const { profile } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6 pb-12">
        <InternalPageHeader
          backHref="/dashboard"
          backLabel="Back to Dashboard"
          description="Update your account details, password, and access settings from one clear place."
          eyebrow="Account"
          title="Profile settings"
        />
        <ProfileSettings profile={profile} />
      </div>
    </AppShell>
  );
}
