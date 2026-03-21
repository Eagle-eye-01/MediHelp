import { AppShell } from "@/components/layout/AppShell";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { getCurrentUserProfile } from "@/lib/data";

export default async function ProfilePage() {
  const { profile } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <ProfileSettings profile={profile} />
    </AppShell>
  );
}
