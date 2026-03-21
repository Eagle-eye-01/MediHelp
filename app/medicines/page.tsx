import { AppShell } from "@/components/layout/AppShell";
import { MedicineStoreExplorer } from "@/components/medicines/MedicineStoreExplorer";
import { getCurrentUserProfile, getMedicineStores } from "@/lib/data";

export default async function MedicinesPage() {
  const [{ profile }, stores] = await Promise.all([getCurrentUserProfile(), getMedicineStores()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Medicine stores</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Search a medicine directly or upload a prescription image to compare nearby stores.
          </p>
        </div>
        <MedicineStoreExplorer stores={stores} />
      </div>
    </AppShell>
  );
}
