import "server-only";

import type {
  Doctor,
  HospitalWithDoctors,
  LabTest,
  LabWithTests,
  MedicalDocument,
  MedicineStore,
  UserProfile
} from "@/types";
import { demoDocuments, demoProfile, hospitalData, labData, medicineStoreData } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function getCurrentUserProfile() {
  if (!isSupabaseConfigured()) {
    return {
      profile: demoProfile,
      userId: demoProfile.id,
      demoMode: true
    };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
      userId: null,
      demoMode: false
    };
  }

  const { data: profile } = await supabase
    .from("users_profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    profile:
      profile || {
        id: user.id,
        name: user.user_metadata?.name || "MediHelp User",
        gender: user.user_metadata?.gender || "",
        dob: user.user_metadata?.dob || "",
        email: user.email || "",
        created_at: new Date().toISOString()
      },
    userId: user.id,
    demoMode: false
  };
}

export async function getUserDocuments(limit?: number) {
  if (!isSupabaseConfigured()) {
    return limit ? demoDocuments.slice(0, limit) : demoDocuments;
  }

  const { userId } = await getCurrentUserProfile();

  if (!userId) {
    return [] as MedicalDocument[];
  }

  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("upload_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data as MedicalDocument[]) || [];
}

export async function getHospitals() {
  if (!isSupabaseConfigured()) {
    return hospitalData;
  }

  const supabase = createServerSupabaseClient();
  const [{ data: hospitals }, { data: doctors }] = await Promise.all([
    supabase.from("hospitals").select("*"),
    supabase.from("doctors").select("*")
  ]);

  if (!hospitals?.length) {
    return hospitalData;
  }

  return (hospitals as HospitalWithDoctors[]).map((hospital) => ({
    ...hospital,
    doctors: ((doctors as Doctor[]) || []).filter((doctor) => doctor.hospital_id === hospital.id)
  }));
}

export async function getLabs() {
  if (!isSupabaseConfigured()) {
    return labData;
  }

  const supabase = createServerSupabaseClient();
  const [{ data: labs }, { data: tests }] = await Promise.all([
    supabase.from("labs").select("*"),
    supabase.from("lab_tests").select("*")
  ]);

  if (!labs?.length) {
    return labData;
  }

  return (labs as LabWithTests[]).map((lab) => ({
    ...lab,
    tests: ((tests as LabTest[]) || []).filter((test) => test.lab_id === lab.id)
  }));
}

export async function getMedicineStores() {
  if (!isSupabaseConfigured()) {
    return medicineStoreData;
  }

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("medicine_stores").select("*");

  return (data as MedicineStore[])?.length ? (data as MedicineStore[]) : medicineStoreData;
}
