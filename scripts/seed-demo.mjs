import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const DEMO_EMAIL = "demo@medihelp.app";
const DEMO_PASSWORD = "MediHelpDemo123!";

const demoDocuments = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    file_name: "ananya_iron-deficiency_2026-02-09",
    original_name: "cbc-report-feb-2026.pdf",
    file_url: "demo://documents/ananya_iron-deficiency_2026-02-09.pdf",
    file_type: "application/pdf",
    file_size: 360000,
    ai_summary:
      "CBC confirms mild iron deficiency with low ferritin, and the note recommends continuing oral iron with a repeat check after six weeks.",
    disease_name: "Iron deficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-09T10:00:00.000Z",
    is_compressed: true
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    file_name: "ananya_thyroid-screening_2026-02-27",
    original_name: "thyroid-panel.pdf",
    file_url: "demo://documents/ananya_thyroid-screening_2026-02-27.pdf",
    file_type: "application/pdf",
    file_size: 940000,
    ai_summary:
      "Thyroid markers are within normal limits and the report recommends continuing routine annual screening unless symptoms change.",
    disease_name: "Thyroid screening",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-27T08:30:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    file_name: "ananya_vitamin-d_2026-03-11",
    original_name: "vitamin-d-panel-mar-2026.pdf",
    file_url: "demo://documents/ananya_vitamin-d_2026-03-11.pdf",
    file_type: "application/pdf",
    file_size: 410000,
    ai_summary:
      "Vitamin D is in the insufficiency range, and the report suggests supplementation review along with improved sunlight exposure.",
    disease_name: "Vitamin D insufficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-11T13:10:00.000Z",
    is_compressed: false
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    file_name: "ananya_hba1c_followup_2026-01-18",
    original_name: "hba1c-jan-2026.pdf",
    file_url: "demo://documents/ananya_hba1c_followup_2026-01-18.pdf",
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
    file_url: "demo://documents/ananya_lipid_panel_2025-12-03.pdf",
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
    original_name: "respiratory-prescription-mar-2026.pdf",
    file_url: "demo://documents/ananya_prescription_resp_2026-03-02.pdf",
    file_type: "application/pdf",
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
    original_name: "cbc-followup-mar-2026.pdf",
    file_url: "demo://documents/ananya_cbc_followup_2026-03-20.pdf",
    file_type: "application/pdf",
    file_size: 355000,
    ai_summary:
      "Repeat CBC shows hemoglobin improving slightly after supplementation, though iron stores may still need continued monitoring.",
    disease_name: "Iron deficiency follow-up",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-20T08:05:00.000Z",
    is_compressed: true
  }
];

const demoHospitals = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    name: "SRM Medical College Hospital",
    location: "Kattankulathur, Chengalpattu",
    coordinates: { lat: 12.8232, lng: 80.0444 },
    contact: "+91 44 2745 5510",
    rating: 4.8,
    bed_vacancy: 26,
    specializations: ["Emergency Medicine", "Cardiology", "General Surgery"]
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    name: "Chengalpattu Government Medical College Hospital",
    location: "Chengalpattu",
    coordinates: { lat: 12.6819, lng: 79.9836 },
    contact: "+91 44 2743 2230",
    rating: 4.6,
    bed_vacancy: 31,
    specializations: ["Trauma Care", "Neurology", "ENT"]
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    name: "Hindu Mission Hospital",
    location: "Tambaram, Chennai",
    coordinates: { lat: 12.9249, lng: 80.1181 },
    contact: "+91 44 2239 0334",
    rating: 4.5,
    bed_vacancy: 18,
    specializations: ["Pulmonology", "Orthopedics", "Oncology"]
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    name: "Apollo Proton Cancer Centre",
    location: "Teynampet, Chennai",
    coordinates: { lat: 13.0418, lng: 80.2341 },
    contact: "+91 44 2829 0200",
    rating: 4.7,
    bed_vacancy: 12,
    specializations: ["Oncology", "General Surgery", "Gynecology"]
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    name: "Gleneagles HealthCity",
    location: "Perumbakkam, Chennai",
    coordinates: { lat: 12.9007, lng: 80.2078 },
    contact: "+91 44 4477 7000",
    rating: 4.4,
    bed_vacancy: 14,
    specializations: ["Nephrology", "Pediatrics", "Cardiology"]
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    name: "Deepam Hospital",
    location: "Tambaram West, Chennai",
    coordinates: { lat: 12.9265, lng: 80.1138 },
    contact: "+91 44 4399 3999",
    rating: 4.5,
    bed_vacancy: 17,
    specializations: ["General Medicine", "Orthopedics", "Emergency Medicine"]
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    name: "Kauvery Hospital",
    location: "Radial Road, Chennai",
    coordinates: { lat: 12.9357, lng: 80.1876 },
    contact: "+91 44 4000 6000",
    rating: 4.7,
    bed_vacancy: 15,
    specializations: ["Cardiology", "Pulmonology", "Neurology"]
  }
];

const demoDoctors = [
  { id: "30000000-0000-0000-0000-000000000001", hospital_id: "20000000-0000-0000-0000-000000000001", name: "Dr. Vivek Menon", specialization: "Cardiology", experience_years: 14, success_rate: 96, contact: "+91 98765 10001" },
  { id: "30000000-0000-0000-0000-000000000002", hospital_id: "20000000-0000-0000-0000-000000000001", name: "Dr. Lakshmi Narayanan", specialization: "Emergency Medicine", experience_years: 12, success_rate: 94, contact: "+91 98765 10002" },
  { id: "30000000-0000-0000-0000-000000000003", hospital_id: "20000000-0000-0000-0000-000000000001", name: "Dr. Farhan Ali", specialization: "General Surgery", experience_years: 9, success_rate: 91, contact: "+91 98765 10003" },
  { id: "30000000-0000-0000-0000-000000000004", hospital_id: "20000000-0000-0000-0000-000000000002", name: "Dr. Priya Raman", specialization: "Neurology", experience_years: 13, success_rate: 95, contact: "+91 98765 10011" },
  { id: "30000000-0000-0000-0000-000000000005", hospital_id: "20000000-0000-0000-0000-000000000002", name: "Dr. Harish Iyer", specialization: "ENT", experience_years: 10, success_rate: 90, contact: "+91 98765 10012" },
  { id: "30000000-0000-0000-0000-000000000006", hospital_id: "20000000-0000-0000-0000-000000000002", name: "Dr. Meera Shah", specialization: "Trauma Care", experience_years: 16, success_rate: 97, contact: "+91 98765 10013" },
  { id: "30000000-0000-0000-0000-000000000007", hospital_id: "20000000-0000-0000-0000-000000000003", name: "Dr. Sneha Bhat", specialization: "Oncology", experience_years: 18, success_rate: 93, contact: "+91 98765 10021" },
  { id: "30000000-0000-0000-0000-000000000008", hospital_id: "20000000-0000-0000-0000-000000000003", name: "Dr. Rahul Suresh", specialization: "Orthopedics", experience_years: 8, success_rate: 89, contact: "+91 98765 10022" },
  { id: "30000000-0000-0000-0000-000000000009", hospital_id: "20000000-0000-0000-0000-000000000003", name: "Dr. Aditi Kulkarni", specialization: "Pulmonology", experience_years: 12, success_rate: 92, contact: "+91 98765 10023" },
  { id: "30000000-0000-0000-0000-000000000010", hospital_id: "20000000-0000-0000-0000-000000000004", name: "Dr. Karthik Reddy", specialization: "Oncology", experience_years: 15, success_rate: 94, contact: "+91 98765 10031" },
  { id: "30000000-0000-0000-0000-000000000011", hospital_id: "20000000-0000-0000-0000-000000000004", name: "Dr. Lavanya Sen", specialization: "Gynecology", experience_years: 14, success_rate: 95, contact: "+91 98765 10032" },
  { id: "30000000-0000-0000-0000-000000000012", hospital_id: "20000000-0000-0000-0000-000000000004", name: "Dr. Manoj Dsouza", specialization: "General Surgery", experience_years: 17, success_rate: 96, contact: "+91 98765 10033" },
  { id: "30000000-0000-0000-0000-000000000013", hospital_id: "20000000-0000-0000-0000-000000000005", name: "Dr. Rekha Thomas", specialization: "Nephrology", experience_years: 12, success_rate: 91, contact: "+91 98765 10041" },
  { id: "30000000-0000-0000-0000-000000000014", hospital_id: "20000000-0000-0000-0000-000000000005", name: "Dr. Sunil Rao", specialization: "Pediatrics", experience_years: 9, success_rate: 88, contact: "+91 98765 10042" },
  { id: "30000000-0000-0000-0000-000000000015", hospital_id: "20000000-0000-0000-0000-000000000005", name: "Dr. Isha Nair", specialization: "Cardiology", experience_years: 13, success_rate: 93, contact: "+91 98765 10043" },
  { id: "30000000-0000-0000-0000-000000000016", hospital_id: "20000000-0000-0000-0000-000000000006", name: "Dr. Aarthi Shankar", specialization: "General Medicine", experience_years: 11, success_rate: 92, contact: "+91 98765 10051" },
  { id: "30000000-0000-0000-0000-000000000017", hospital_id: "20000000-0000-0000-0000-000000000006", name: "Dr. Naveen Babu", specialization: "Orthopedics", experience_years: 10, success_rate: 90, contact: "+91 98765 10052" },
  { id: "30000000-0000-0000-0000-000000000018", hospital_id: "20000000-0000-0000-0000-000000000006", name: "Dr. Jeswin Raj", specialization: "Emergency Medicine", experience_years: 9, success_rate: 91, contact: "+91 98765 10053" },
  { id: "30000000-0000-0000-0000-000000000019", hospital_id: "20000000-0000-0000-0000-000000000007", name: "Dr. Preetham Raj", specialization: "Cardiology", experience_years: 15, success_rate: 95, contact: "+91 98765 10061" },
  { id: "30000000-0000-0000-0000-000000000020", hospital_id: "20000000-0000-0000-0000-000000000007", name: "Dr. Shalini V", specialization: "Pulmonology", experience_years: 12, success_rate: 93, contact: "+91 98765 10062" },
  { id: "30000000-0000-0000-0000-000000000021", hospital_id: "20000000-0000-0000-0000-000000000007", name: "Dr. K. Varun", specialization: "Neurology", experience_years: 14, success_rate: 94, contact: "+91 98765 10063" }
];

const demoLabs = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    name: "SRM Diagnostics Centre",
    location: "Kattankulathur, Chengalpattu",
    coordinates: { lat: 12.8219, lng: 80.0428 },
    contact: "+91 44 4743 2100",
    rating: 4.8,
    vacancy: 12,
    date_available: "2026-03-18"
  },
  {
    id: "40000000-0000-0000-0000-000000000002",
    name: "Chengalpattu Precision Labs",
    location: "Chengalpattu",
    coordinates: { lat: 12.6918, lng: 79.9792 },
    contact: "+91 44 4743 2200",
    rating: 4.6,
    vacancy: 9,
    date_available: "2026-03-19"
  },
  {
    id: "40000000-0000-0000-0000-000000000003",
    name: "Tambaram MetroScan Diagnostics",
    location: "Tambaram, Chennai",
    coordinates: { lat: 12.9252, lng: 80.1165 },
    contact: "+91 44 4743 3300",
    rating: 4.4,
    vacancy: 16,
    date_available: "2026-03-18"
  },
  {
    id: "40000000-0000-0000-0000-000000000004",
    name: "OMR Zenith Path Labs",
    location: "Perumbakkam, Chennai",
    coordinates: { lat: 12.9003, lng: 80.2064 },
    contact: "+91 44 4743 4400",
    rating: 4.7,
    vacancy: 7,
    date_available: "2026-03-20"
  },
  {
    id: "40000000-0000-0000-0000-000000000005",
    name: "Guduvanchery Care Labs",
    location: "Guduvanchery, Chengalpattu",
    coordinates: { lat: 12.8431, lng: 80.0601 },
    contact: "+91 44 4743 5500",
    rating: 4.5,
    vacancy: 11,
    date_available: "2026-03-19"
  }
];

const demoLabTests = [
  { id: "50000000-0000-0000-0000-000000000001", lab_id: "40000000-0000-0000-0000-000000000001", test_name: "CBC", test_type: "Blood", price: 420, reviews: [{ author: "Nitin", rating: 5, comment: "Quick and neat sample collection." }] },
  { id: "50000000-0000-0000-0000-000000000002", lab_id: "40000000-0000-0000-0000-000000000001", test_name: "Thyroid Profile", test_type: "Hormone", price: 760, reviews: [{ author: "Asha", rating: 4, comment: "Reports came on time." }] },
  { id: "50000000-0000-0000-0000-000000000003", lab_id: "40000000-0000-0000-0000-000000000001", test_name: "Lipid Profile", test_type: "Blood", price: 880, reviews: [{ author: "Pranav", rating: 5, comment: "Good value." }] },
  { id: "50000000-0000-0000-0000-000000000004", lab_id: "40000000-0000-0000-0000-000000000001", test_name: "Vitamin D", test_type: "Vitamin", price: 1150, reviews: [{ author: "Divya", rating: 4, comment: "Friendly staff." }] },
  { id: "50000000-0000-0000-0000-000000000005", lab_id: "40000000-0000-0000-0000-000000000001", test_name: "HbA1c", test_type: "Cardiac", price: 680, reviews: [{ author: "Ritu", rating: 5, comment: "Very fast." }] },
  { id: "50000000-0000-0000-0000-000000000006", lab_id: "40000000-0000-0000-0000-000000000002", test_name: "Liver Function Test", test_type: "Blood", price: 900, reviews: [{ author: "Kiran", rating: 4, comment: "Good support desk." }] },
  { id: "50000000-0000-0000-0000-000000000007", lab_id: "40000000-0000-0000-0000-000000000002", test_name: "Kidney Function Test", test_type: "Blood", price: 820, reviews: [{ author: "Suma", rating: 5, comment: "Clean center." }] },
  { id: "50000000-0000-0000-0000-000000000008", lab_id: "40000000-0000-0000-0000-000000000002", test_name: "Urine Routine", test_type: "Blood", price: 320, reviews: [{ author: "Maya", rating: 4, comment: "Affordable." }] },
  { id: "50000000-0000-0000-0000-000000000009", lab_id: "40000000-0000-0000-0000-000000000002", test_name: "Chest X-Ray", test_type: "Imaging", price: 1350, reviews: [{ author: "Arun", rating: 5, comment: "Minimal wait time." }] },
  { id: "50000000-0000-0000-0000-000000000010", lab_id: "40000000-0000-0000-0000-000000000002", test_name: "ECG", test_type: "Cardiac", price: 580, reviews: [{ author: "Naveen", rating: 4, comment: "Smooth process." }] },
  { id: "50000000-0000-0000-0000-000000000011", lab_id: "40000000-0000-0000-0000-000000000003", test_name: "MRI Brain", test_type: "Imaging", price: 6100, reviews: [{ author: "Ajay", rating: 4, comment: "Detailed explanation by technician." }] },
  { id: "50000000-0000-0000-0000-000000000012", lab_id: "40000000-0000-0000-0000-000000000003", test_name: "CT Chest", test_type: "Imaging", price: 4100, reviews: [{ author: "Rhea", rating: 4, comment: "Comfortable facility." }] },
  { id: "50000000-0000-0000-0000-000000000013", lab_id: "40000000-0000-0000-0000-000000000003", test_name: "Dengue Panel", test_type: "Blood", price: 1750, reviews: [{ author: "Sanjay", rating: 5, comment: "Same-day report." }] },
  { id: "50000000-0000-0000-0000-000000000014", lab_id: "40000000-0000-0000-0000-000000000003", test_name: "CRP", test_type: "Blood", price: 640, reviews: [{ author: "Sonal", rating: 4, comment: "Easy booking." }] },
  { id: "50000000-0000-0000-0000-000000000015", lab_id: "40000000-0000-0000-0000-000000000003", test_name: "Ferritin", test_type: "Blood", price: 1080, reviews: [{ author: "Tanvi", rating: 5, comment: "Helpful front desk." }] },
  { id: "50000000-0000-0000-0000-000000000016", lab_id: "40000000-0000-0000-0000-000000000004", test_name: "Ultrasound Abdomen", test_type: "Imaging", price: 1500, reviews: [{ author: "Keerthi", rating: 5, comment: "Excellent radiologist." }] },
  { id: "50000000-0000-0000-0000-000000000017", lab_id: "40000000-0000-0000-0000-000000000004", test_name: "Pregnancy Test", test_type: "Hormone", price: 300, reviews: [{ author: "Ila", rating: 4, comment: "Discrete and quick." }] },
  { id: "50000000-0000-0000-0000-000000000018", lab_id: "40000000-0000-0000-0000-000000000004", test_name: "T3 T4 TSH", test_type: "Hormone", price: 780, reviews: [{ author: "Siddharth", rating: 4, comment: "Easy parking." }] },
  { id: "50000000-0000-0000-0000-000000000019", lab_id: "40000000-0000-0000-0000-000000000004", test_name: "Stool Routine", test_type: "Blood", price: 420, reviews: [{ author: "Kavya", rating: 5, comment: "Accurate reports." }] },
  { id: "50000000-0000-0000-0000-000000000020", lab_id: "40000000-0000-0000-0000-000000000004", test_name: "B12", test_type: "Vitamin", price: 1250, reviews: [{ author: "Vivek", rating: 5, comment: "Convenient home pickup." }] },
  { id: "50000000-0000-0000-0000-000000000021", lab_id: "40000000-0000-0000-0000-000000000005", test_name: "CBC", test_type: "Blood", price: 430, reviews: [{ author: "Lavanya", rating: 5, comment: "Very convenient for morning tests." }] },
  { id: "50000000-0000-0000-0000-000000000022", lab_id: "40000000-0000-0000-0000-000000000005", test_name: "Fasting Blood Sugar", test_type: "Blood", price: 180, reviews: [{ author: "Suresh", rating: 4, comment: "Quick sample collection." }] },
  { id: "50000000-0000-0000-0000-000000000023", lab_id: "40000000-0000-0000-0000-000000000005", test_name: "Thyroid Profile", test_type: "Hormone", price: 790, reviews: [{ author: "Devi", rating: 4, comment: "Reports arrived the same evening." }] },
  { id: "50000000-0000-0000-0000-000000000024", lab_id: "40000000-0000-0000-0000-000000000005", test_name: "ECG", test_type: "Cardiac", price: 560, reviews: [{ author: "Hari", rating: 5, comment: "Clean setup and smooth process." }] },
  { id: "50000000-0000-0000-0000-000000000025", lab_id: "40000000-0000-0000-0000-000000000005", test_name: "Vitamin B12", test_type: "Vitamin", price: 1180, reviews: [{ author: "Monica", rating: 4, comment: "Helpful front desk." }] }
];

const demoMedicineStores = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    name: "SRM Care Pharmacy",
    location: "Kattankulathur, Chengalpattu",
    contact: "+91 44 4500 1010",
    rating: 4.7,
    medicines: [
      { name: "Paracetamol", price: 25, available: true },
      { name: "Azithromycin", price: 110, available: true },
      { name: "Metformin", price: 68, available: true },
      { name: "Vitamin D3", price: 165, available: true },
      { name: "Levothyroxine", price: 92, available: true },
      { name: "Cetirizine", price: 38, available: true },
      { name: "Omeprazole", price: 74, available: true },
      { name: "Ibuprofen", price: 43, available: true },
      { name: "Amoxicillin", price: 95, available: false },
      { name: "Iron Supplement", price: 155, available: true }
    ]
  },
  {
    id: "60000000-0000-0000-0000-000000000002",
    name: "Guduvanchery MediMart",
    location: "Guduvanchery, Chengalpattu",
    contact: "+91 44 4500 2020",
    rating: 4.5,
    medicines: [
      { name: "Paracetamol", price: 22, available: true },
      { name: "Azithromycin", price: 118, available: true },
      { name: "Metformin", price: 64, available: true },
      { name: "Vitamin D3", price: 170, available: true },
      { name: "Levothyroxine", price: 88, available: true },
      { name: "Cetirizine", price: 36, available: true },
      { name: "Omeprazole", price: 71, available: true },
      { name: "Ibuprofen", price: 40, available: true },
      { name: "Amoxicillin", price: 98, available: true },
      { name: "Iron Supplement", price: 149, available: true }
    ]
  },
  {
    id: "60000000-0000-0000-0000-000000000003",
    name: "Chengalpattu Wellness Pharmacy",
    location: "Chengalpattu",
    contact: "+91 44 4500 3030",
    rating: 4.8,
    medicines: [
      { name: "Paracetamol", price: 24, available: true },
      { name: "Azithromycin", price: 105, available: true },
      { name: "Metformin", price: 69, available: false },
      { name: "Vitamin D3", price: 160, available: true },
      { name: "Levothyroxine", price: 90, available: true },
      { name: "Cetirizine", price: 35, available: true },
      { name: "Omeprazole", price: 69, available: true },
      { name: "Ibuprofen", price: 42, available: true },
      { name: "Amoxicillin", price: 91, available: true },
      { name: "Iron Supplement", price: 152, available: true }
    ]
  },
  {
    id: "60000000-0000-0000-0000-000000000004",
    name: "Tambaram Health Pharmacy",
    location: "Tambaram, Chennai",
    contact: "+91 44 4500 4040",
    rating: 4.6,
    medicines: [
      { name: "Paracetamol", price: 23, available: true },
      { name: "Azithromycin", price: 112, available: true },
      { name: "Metformin", price: 66, available: true },
      { name: "Vitamin D3", price: 162, available: true },
      { name: "Levothyroxine", price: 89, available: true },
      { name: "Cetirizine", price: 37, available: true },
      { name: "Omeprazole", price: 72, available: true },
      { name: "Ibuprofen", price: 41, available: true },
      { name: "Amoxicillin", price: 94, available: true },
      { name: "Iron Supplement", price: 150, available: true }
    ]
  },
  {
    id: "60000000-0000-0000-0000-000000000005",
    name: "Urapakkam Family Pharmacy",
    location: "Urapakkam, Chengalpattu",
    contact: "+91 44 4500 5050",
    rating: 4.4,
    medicines: [
      { name: "Paracetamol", price: 21, available: true },
      { name: "Azithromycin", price: 109, available: true },
      { name: "Metformin", price: 67, available: true },
      { name: "Vitamin D3", price: 168, available: true },
      { name: "Levothyroxine", price: 91, available: true },
      { name: "Cetirizine", price: 34, available: true },
      { name: "Omeprazole", price: 70, available: true },
      { name: "Ibuprofen", price: 39, available: true },
      { name: "Amoxicillin", price: 93, available: false },
      { name: "Iron Supplement", price: 148, available: true }
    ]
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

  const { error: hospitalsError } = await supabase.from("hospitals").upsert(demoHospitals);

  if (hospitalsError) {
    throw hospitalsError;
  }

  const { error: doctorsError } = await supabase.from("doctors").upsert(demoDoctors);

  if (doctorsError) {
    throw doctorsError;
  }

  const { error: labsError } = await supabase.from("labs").upsert(demoLabs);

  if (labsError) {
    throw labsError;
  }

  const { error: labTestsError } = await supabase.from("lab_tests").upsert(demoLabTests);

  if (labTestsError) {
    throw labTestsError;
  }

  const { error: medicineStoresError } = await supabase.from("medicine_stores").upsert(demoMedicineStores);

  if (medicineStoresError) {
    throw medicineStoresError;
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
