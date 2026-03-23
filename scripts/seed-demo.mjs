import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const DEMO_EMAIL = "demo@medihelp.app";
const DEMO_PASSWORD = "MediHelpDemo123!";

const demoDocuments = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    file_name: "ananya_iron-deficiency_2026-02-09",
    original_name: "cbc-report-feb.png",
    file_url:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    file_type: "image/png",
    file_size: 360000,
    ai_summary:
      "CBC indicates mild iron deficiency and recommends a follow-up hemoglobin check in six weeks.",
    disease_name: "Iron deficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-09T10:00:00.000Z",
    is_compressed: true
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    file_name: "ananya_thyroid-screening_2026-02-27",
    original_name: "thyroid-panel.pdf",
    file_url:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    file_type: "application/pdf",
    file_size: 940000,
    ai_summary:
      "Thyroid levels are within the normal lab range, with a reminder to continue regular monitoring.",
    disease_name: "Thyroid screening",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-27T08:30:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    file_name: "ananya_vitamin-d_2026-03-11",
    original_name: "vitamin-d.jpeg",
    file_url:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
    file_type: "image/jpeg",
    file_size: 410000,
    ai_summary:
      "Vitamin D is borderline low and the report suggests more sunlight exposure plus supplementation review.",
    disease_name: "Vitamin D insufficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-11T13:10:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    file_name: "ananya_hba1c_followup_2026-01-18",
    original_name: "hba1c-jan-2026.pdf",
    file_url:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=800&q=80",
    file_type: "application/pdf",
    file_size: 780000,
    ai_summary:
      "HbA1c remains mildly elevated, suggesting blood sugar control is improving but still needs continued diet and medication consistency.",
    disease_name: "Prediabetes follow-up",
    patient_name: "Ananya Rao",
    upload_date: "2026-01-18T09:20:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    file_name: "ananya_lipid_panel_2025-12-03",
    original_name: "lipid-panel-dec.pdf",
    file_url:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    file_type: "application/pdf",
    file_size: 640000,
    ai_summary:
      "The lipid profile shows borderline LDL cholesterol with otherwise stable triglycerides, and the report recommends continued lifestyle changes.",
    disease_name: "Cholesterol monitoring",
    patient_name: "Ananya Rao",
    upload_date: "2025-12-03T11:45:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    file_name: "ananya_prescription_resp_2026-03-02",
    original_name: "respiratory-prescription.jpg",
    file_url:
      "https://images.unsplash.com/photo-1580281657527-47d2f2eacd6a?auto=format&fit=crop&w=800&q=80",
    file_type: "image/jpeg",
    file_size: 420000,
    ai_summary:
      "Prescription includes a short inhaler course and antihistamine support for seasonal respiratory irritation, with a follow-up if symptoms persist.",
    disease_name: "Seasonal respiratory irritation",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-02T16:25:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000007",
    file_name: "ananya_cbc_followup_2026-03-20",
    original_name: "cbc-followup-mar.png",
    file_url:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    file_type: "image/png",
    file_size: 355000,
    ai_summary:
      "Repeat CBC shows hemoglobin improving slightly after supplementation, though iron stores may still need continued monitoring.",
    disease_name: "Iron deficiency follow-up",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-20T08:05:00.000Z",
    is_compressed: true
  }
];

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");
  const values = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1).replace(/^['"]|['"]$/g, "");
    values[key] = value;
  }

  return values;
}

async function upsertDemoData(supabase, userId) {
  const { error: profileError } = await supabase.from("users_profile").upsert({
    id: userId,
    name: "Ananya Rao",
    gender: "Female",
    dob: "1994-08-21",
    email: DEMO_EMAIL
  });

  if (profileError) {
    throw profileError;
  }

  const documentsPayload = demoDocuments.map((document) => ({
    ...document,
    user_id: userId
  }));

  const { error: documentsError } = await supabase.from("documents").upsert(documentsPayload);

  if (documentsError) {
    throw documentsError;
  }
}

async function ensureDemoUser(supabase) {
  const {
    data: { users },
    error: listUsersError
  } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });

  if (listUsersError) {
    throw listUsersError;
  }

  const existingUser = users.find((user) => user.email?.toLowerCase() === DEMO_EMAIL);

  if (existingUser) {
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        name: "Ananya Rao",
        gender: "Female",
        dob: "1994-08-21"
      }
    });

    if (updateUserError) {
      throw updateUserError;
    }

    return existingUser.id;
  }

  const { data, error: createUserError } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      name: "Ananya Rao",
      gender: "Female",
      dob: "1994-08-21"
    }
  });

  if (createUserError) {
    throw createUserError;
  }

  if (!data.user?.id) {
    throw new Error("Supabase did not return a demo user id.");
  }

  return data.user.id;
}

async function main() {
  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase URL or service role key in .env.local");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const userId = await ensureDemoUser(supabase);
  await upsertDemoData(supabase, userId);

  const { count: documentCount, error: documentsCountError } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (documentsCountError) {
    throw documentsCountError;
  }

  console.log("Demo seed complete.");
  console.log(`Email: ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
  console.log(`User id: ${userId}`);
  console.log(`Seeded documents: ${documentCount ?? demoDocuments.length}`);
}

main().catch((error) => {
  console.error("Seed failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
