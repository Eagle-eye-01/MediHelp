export interface UserProfile {
  id: string;
  name: string;
  gender: string;
  dob: string;
  email: string;
  created_at?: string;
}

export interface MedicalDocument {
  id: string;
  user_id: string;
  file_name: string;
  original_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  ai_summary: string;
  disease_name: string;
  patient_name: string;
  upload_date: string;
  is_compressed: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: string;
  rating: number;
  bed_vacancy: number;
  specializations: string[];
}

export interface Doctor {
  id: string;
  hospital_id: string;
  name: string;
  specialization: string;
  experience_years: number;
  success_rate: number;
  contact: string;
}

export interface HospitalWithDoctors extends Hospital {
  doctors: Doctor[];
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: string;
  rating: number;
  vacancy: number;
  date_available: string;
}

export interface LabTest {
  id: string;
  lab_id: string;
  test_name: string;
  test_type: string;
  price: number;
  reviews: Review[];
}

export interface LabWithTests extends Lab {
  tests: LabTest[];
}

export interface MedicineAvailability {
  name: string;
  price: number;
  available: boolean;
}

export interface MedicineStore {
  id: string;
  name: string;
  location: string;
  contact: string;
  rating: number;
  medicines: MedicineAvailability[];
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  medical_history_sent: boolean;
  message: string;
  status: "pending" | "confirmed" | "done";
}

export interface HealthInsight {
  title: string;
  description: string;
}

export interface TrialResult {
  nctId?: string;
  trialName: string;
  matchScore: number;
  status: string;
  location: string;
  contact: string;
  description: string;
  sponsor?: string;
  eligibilitySummary?: string;
  trialUrl?: string;
}
