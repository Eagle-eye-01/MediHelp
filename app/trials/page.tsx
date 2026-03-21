import { AppShell } from "@/components/layout/AppShell";
import { TrialsExplorer } from "@/components/trials/TrialsExplorer";
import { getCurrentUserProfile } from "@/lib/data";
import { cityOptions, languageOptions } from "@/lib/mock-data";

export default async function TrialsPage() {
  const { profile } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Clinical Trial Finder</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Generate realistic trial leads based on condition, city, age range, and preferred language.
          </p>
        </div>
        <TrialsExplorer cities={cityOptions} languages={languageOptions} />
      </div>
    </AppShell>
  );
}
