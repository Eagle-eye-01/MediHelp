import type {
  HospitalWithDoctors,
  LabWithTests,
  MedicalDocument,
  MedicineStore,
  UserProfile
} from "@/types";

export const demoProfile: UserProfile = {
  id: "demo-user",
  name: "Ananya Rao",
  gender: "Female",
  dob: "1994-08-21",
  email: "ananya.rao@example.com",
  created_at: "2026-03-17T00:00:00.000Z"
};

export const demoDocuments: MedicalDocument[] = [
  {
    id: "doc-1",
    user_id: "demo-user",
    file_name: "ananya_iron-deficiency_2026-02-09",
    original_name: "cbc-report-feb-2026.pdf",
    file_url: "demo://documents/ananya_iron-deficiency_2026-02-09.pdf",
    file_type: "application/pdf",
    file_size: 360000,
    ai_summary: "CBC confirms mild iron deficiency with low ferritin, and the note recommends continuing oral iron with a repeat check after six weeks.",
    disease_name: "Iron deficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-09T10:00:00.000Z",
    is_compressed: true
  },
  {
    id: "doc-2",
    user_id: "demo-user",
    file_name: "ananya_thyroid-screening_2026-02-27",
    original_name: "thyroid-panel.pdf",
    file_url: "demo://documents/ananya_thyroid-screening_2026-02-27.pdf",
    file_type: "application/pdf",
    file_size: 940000,
    ai_summary: "Thyroid markers are within normal limits and the report recommends continuing routine annual screening unless symptoms change.",
    disease_name: "Thyroid screening",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-27T08:30:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-3",
    user_id: "demo-user",
    file_name: "ananya_vitamin-d_2026-03-11",
    original_name: "vitamin-d-panel-mar-2026.pdf",
    file_url: "demo://documents/ananya_vitamin-d_2026-03-11.pdf",
    file_type: "application/pdf",
    file_size: 410000,
    ai_summary: "Vitamin D is in the insufficiency range, and the report suggests supplementation review along with improved sunlight exposure.",
    disease_name: "Vitamin D insufficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-11T13:10:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-4",
    user_id: "demo-user",
    file_name: "ananya_hba1c_followup_2026-01-18",
    original_name: "hba1c-jan-2026.pdf",
    file_url: "demo://documents/ananya_hba1c_followup_2026-01-18.pdf",
    file_type: "application/pdf",
    file_size: 780000,
    ai_summary: "HbA1c remains mildly elevated, suggesting blood sugar control is improving but still needs continued diet and medication consistency.",
    disease_name: "Prediabetes follow-up",
    patient_name: "Ananya Rao",
    upload_date: "2026-01-18T09:20:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-5",
    user_id: "demo-user",
    file_name: "ananya_lipid_panel_2025-12-03",
    original_name: "lipid-panel-dec.pdf",
    file_url: "demo://documents/ananya_lipid_panel_2025-12-03.pdf",
    file_type: "application/pdf",
    file_size: 640000,
    ai_summary: "The lipid profile shows borderline LDL cholesterol with otherwise stable triglycerides, and the report recommends continued lifestyle changes.",
    disease_name: "Cholesterol monitoring",
    patient_name: "Ananya Rao",
    upload_date: "2025-12-03T11:45:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-6",
    user_id: "demo-user",
    file_name: "ananya_prescription_resp_2026-03-02",
    original_name: "respiratory-prescription-mar-2026.pdf",
    file_url: "demo://documents/ananya_prescription_resp_2026-03-02.pdf",
    file_type: "application/pdf",
    file_size: 420000,
    ai_summary: "Prescription includes a short inhaler course and antihistamine support for seasonal respiratory irritation, with a follow-up if symptoms persist.",
    disease_name: "Seasonal respiratory irritation",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-02T16:25:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-7",
    user_id: "demo-user",
    file_name: "ananya_cbc_followup_2026-03-20",
    original_name: "cbc-followup-mar-2026.pdf",
    file_url: "demo://documents/ananya_cbc_followup_2026-03-20.pdf",
    file_type: "application/pdf",
    file_size: 355000,
    ai_summary: "Repeat CBC shows hemoglobin improving slightly after supplementation, though iron stores may still need continued monitoring.",
    disease_name: "Iron deficiency follow-up",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-20T08:05:00.000Z",
    is_compressed: true
  }
];

export const hospitalData: HospitalWithDoctors[] = [
  {
    id: "hosp-1",
    name: "SRM Medical College Hospital",
    location: "Kattankulathur, Chengalpattu",
    coordinates: { lat: 12.8232, lng: 80.0444 },
    contact: "+91 44 2745 5510",
    rating: 4.8,
    bed_vacancy: 26,
    specializations: ["Emergency Medicine", "Cardiology", "General Surgery"],
    doctors: [
      { id: "doc-h1-1", hospital_id: "hosp-1", name: "Dr. Vivek Menon", specialization: "Cardiology", experience_years: 14, success_rate: 96, contact: "+91 98765 10001" },
      { id: "doc-h1-2", hospital_id: "hosp-1", name: "Dr. Lakshmi Narayanan", specialization: "Emergency Medicine", experience_years: 12, success_rate: 94, contact: "+91 98765 10002" },
      { id: "doc-h1-3", hospital_id: "hosp-1", name: "Dr. Farhan Ali", specialization: "General Surgery", experience_years: 9, success_rate: 91, contact: "+91 98765 10003" }
    ]
  },
  {
    id: "hosp-2",
    name: "Chengalpattu Government Medical College Hospital",
    location: "Chengalpattu",
    coordinates: { lat: 12.6819, lng: 79.9836 },
    contact: "+91 44 2743 2230",
    rating: 4.6,
    bed_vacancy: 31,
    specializations: ["Trauma Care", "Neurology", "ENT"],
    doctors: [
      { id: "doc-h2-1", hospital_id: "hosp-2", name: "Dr. Priya Raman", specialization: "Neurology", experience_years: 13, success_rate: 95, contact: "+91 98765 10011" },
      { id: "doc-h2-2", hospital_id: "hosp-2", name: "Dr. Harish Iyer", specialization: "ENT", experience_years: 10, success_rate: 90, contact: "+91 98765 10012" },
      { id: "doc-h2-3", hospital_id: "hosp-2", name: "Dr. Meera Shah", specialization: "Trauma Care", experience_years: 16, success_rate: 97, contact: "+91 98765 10013" }
    ]
  },
  {
    id: "hosp-3",
    name: "Hindu Mission Hospital",
    location: "Tambaram, Chennai",
    coordinates: { lat: 12.9249, lng: 80.1181 },
    contact: "+91 44 2239 0334",
    rating: 4.5,
    bed_vacancy: 18,
    specializations: ["Pulmonology", "Orthopedics", "Oncology"],
    doctors: [
      { id: "doc-h3-1", hospital_id: "hosp-3", name: "Dr. Sneha Bhat", specialization: "Oncology", experience_years: 18, success_rate: 93, contact: "+91 98765 10021" },
      { id: "doc-h3-2", hospital_id: "hosp-3", name: "Dr. Rahul Suresh", specialization: "Orthopedics", experience_years: 8, success_rate: 89, contact: "+91 98765 10022" },
      { id: "doc-h3-3", hospital_id: "hosp-3", name: "Dr. Aditi Kulkarni", specialization: "Pulmonology", experience_years: 12, success_rate: 92, contact: "+91 98765 10023" }
    ]
  },
  {
    id: "hosp-4",
    name: "Apollo Proton Cancer Centre",
    location: "Teynampet, Chennai",
    coordinates: { lat: 13.0418, lng: 80.2341 },
    contact: "+91 44 2829 0200",
    rating: 4.7,
    bed_vacancy: 12,
    specializations: ["Oncology", "General Surgery", "Gynecology"],
    doctors: [
      { id: "doc-h4-1", hospital_id: "hosp-4", name: "Dr. Karthik Reddy", specialization: "Oncology", experience_years: 15, success_rate: 94, contact: "+91 98765 10031" },
      { id: "doc-h4-2", hospital_id: "hosp-4", name: "Dr. Lavanya Sen", specialization: "Gynecology", experience_years: 14, success_rate: 95, contact: "+91 98765 10032" },
      { id: "doc-h4-3", hospital_id: "hosp-4", name: "Dr. Manoj Dsouza", specialization: "General Surgery", experience_years: 17, success_rate: 96, contact: "+91 98765 10033" }
    ]
  },
  {
    id: "hosp-5",
    name: "Gleneagles HealthCity",
    location: "Perumbakkam, Chennai",
    coordinates: { lat: 12.9007, lng: 80.2078 },
    contact: "+91 44 4477 7000",
    rating: 4.4,
    bed_vacancy: 14,
    specializations: ["Nephrology", "Pediatrics", "Cardiology"],
    doctors: [
      { id: "doc-h5-1", hospital_id: "hosp-5", name: "Dr. Rekha Thomas", specialization: "Nephrology", experience_years: 12, success_rate: 91, contact: "+91 98765 10041" },
      { id: "doc-h5-2", hospital_id: "hosp-5", name: "Dr. Sunil Rao", specialization: "Pediatrics", experience_years: 9, success_rate: 88, contact: "+91 98765 10042" },
      { id: "doc-h5-3", hospital_id: "hosp-5", name: "Dr. Isha Nair", specialization: "Cardiology", experience_years: 13, success_rate: 93, contact: "+91 98765 10043" }
    ]
  },
  {
    id: "hosp-6",
    name: "Deepam Hospital",
    location: "Tambaram West, Chennai",
    coordinates: { lat: 12.9265, lng: 80.1138 },
    contact: "+91 44 4399 3999",
    rating: 4.5,
    bed_vacancy: 17,
    specializations: ["General Medicine", "Orthopedics", "Emergency Medicine"],
    doctors: [
      { id: "doc-h6-1", hospital_id: "hosp-6", name: "Dr. Aarthi Shankar", specialization: "General Medicine", experience_years: 11, success_rate: 92, contact: "+91 98765 10051" },
      { id: "doc-h6-2", hospital_id: "hosp-6", name: "Dr. Naveen Babu", specialization: "Orthopedics", experience_years: 10, success_rate: 90, contact: "+91 98765 10052" },
      { id: "doc-h6-3", hospital_id: "hosp-6", name: "Dr. Jeswin Raj", specialization: "Emergency Medicine", experience_years: 9, success_rate: 91, contact: "+91 98765 10053" }
    ]
  },
  {
    id: "hosp-7",
    name: "Kauvery Hospital",
    location: "Radial Road, Chennai",
    coordinates: { lat: 12.9357, lng: 80.1876 },
    contact: "+91 44 4000 6000",
    rating: 4.7,
    bed_vacancy: 15,
    specializations: ["Cardiology", "Pulmonology", "Neurology"],
    doctors: [
      { id: "doc-h7-1", hospital_id: "hosp-7", name: "Dr. Preetham Raj", specialization: "Cardiology", experience_years: 15, success_rate: 95, contact: "+91 98765 10061" },
      { id: "doc-h7-2", hospital_id: "hosp-7", name: "Dr. Shalini V", specialization: "Pulmonology", experience_years: 12, success_rate: 93, contact: "+91 98765 10062" },
      { id: "doc-h7-3", hospital_id: "hosp-7", name: "Dr. K. Varun", specialization: "Neurology", experience_years: 14, success_rate: 94, contact: "+91 98765 10063" }
    ]
  }
];

export const labData: LabWithTests[] = [
  {
    id: "lab-1",
    name: "SRM Diagnostics Centre",
    location: "Kattankulathur, Chengalpattu",
    coordinates: { lat: 12.8219, lng: 80.0428 },
    contact: "+91 44 4743 2100",
    rating: 4.8,
    vacancy: 12,
    date_available: "2026-03-18",
    tests: [
      { id: "lab1-t1", lab_id: "lab-1", test_name: "CBC", test_type: "Blood", price: 420, reviews: [{ author: "Nitin", rating: 5, comment: "Quick and neat sample collection." }] },
      { id: "lab1-t2", lab_id: "lab-1", test_name: "Thyroid Profile", test_type: "Hormone", price: 760, reviews: [{ author: "Asha", rating: 4, comment: "Reports came on time." }] },
      { id: "lab1-t3", lab_id: "lab-1", test_name: "Lipid Profile", test_type: "Blood", price: 880, reviews: [{ author: "Pranav", rating: 5, comment: "Good value." }] },
      { id: "lab1-t4", lab_id: "lab-1", test_name: "Vitamin D", test_type: "Vitamin", price: 1150, reviews: [{ author: "Divya", rating: 4, comment: "Friendly staff." }] },
      { id: "lab1-t5", lab_id: "lab-1", test_name: "HbA1c", test_type: "Cardiac", price: 680, reviews: [{ author: "Ritu", rating: 5, comment: "Very fast." }] }
    ]
  },
  {
    id: "lab-2",
    name: "Chengalpattu Precision Labs",
    location: "Chengalpattu",
    coordinates: { lat: 12.6918, lng: 79.9792 },
    contact: "+91 44 4743 2200",
    rating: 4.6,
    vacancy: 9,
    date_available: "2026-03-19",
    tests: [
      { id: "lab2-t1", lab_id: "lab-2", test_name: "Liver Function Test", test_type: "Blood", price: 900, reviews: [{ author: "Kiran", rating: 4, comment: "Good support desk." }] },
      { id: "lab2-t2", lab_id: "lab-2", test_name: "Kidney Function Test", test_type: "Blood", price: 820, reviews: [{ author: "Suma", rating: 5, comment: "Clean center." }] },
      { id: "lab2-t3", lab_id: "lab-2", test_name: "Urine Routine", test_type: "Blood", price: 320, reviews: [{ author: "Maya", rating: 4, comment: "Affordable." }] },
      { id: "lab2-t4", lab_id: "lab-2", test_name: "Chest X-Ray", test_type: "Imaging", price: 1350, reviews: [{ author: "Arun", rating: 5, comment: "Minimal wait time." }] },
      { id: "lab2-t5", lab_id: "lab-2", test_name: "ECG", test_type: "Cardiac", price: 580, reviews: [{ author: "Naveen", rating: 4, comment: "Smooth process." }] }
    ]
  },
  {
    id: "lab-3",
    name: "Tambaram MetroScan Diagnostics",
    location: "Tambaram, Chennai",
    coordinates: { lat: 12.9252, lng: 80.1165 },
    contact: "+91 44 4743 3300",
    rating: 4.4,
    vacancy: 16,
    date_available: "2026-03-18",
    tests: [
      { id: "lab3-t1", lab_id: "lab-3", test_name: "MRI Brain", test_type: "Imaging", price: 6100, reviews: [{ author: "Ajay", rating: 4, comment: "Detailed explanation by technician." }] },
      { id: "lab3-t2", lab_id: "lab-3", test_name: "CT Chest", test_type: "Imaging", price: 4100, reviews: [{ author: "Rhea", rating: 4, comment: "Comfortable facility." }] },
      { id: "lab3-t3", lab_id: "lab-3", test_name: "Dengue Panel", test_type: "Blood", price: 1750, reviews: [{ author: "Sanjay", rating: 5, comment: "Same-day report." }] },
      { id: "lab3-t4", lab_id: "lab-3", test_name: "CRP", test_type: "Blood", price: 640, reviews: [{ author: "Sonal", rating: 4, comment: "Easy booking." }] },
      { id: "lab3-t5", lab_id: "lab-3", test_name: "Ferritin", test_type: "Blood", price: 1080, reviews: [{ author: "Tanvi", rating: 5, comment: "Helpful front desk." }] }
    ]
  },
  {
    id: "lab-4",
    name: "OMR Zenith Path Labs",
    location: "Perumbakkam, Chennai",
    coordinates: { lat: 12.9003, lng: 80.2064 },
    contact: "+91 44 4743 4400",
    rating: 4.7,
    vacancy: 7,
    date_available: "2026-03-20",
    tests: [
      { id: "lab4-t1", lab_id: "lab-4", test_name: "Ultrasound Abdomen", test_type: "Imaging", price: 1500, reviews: [{ author: "Keerthi", rating: 5, comment: "Excellent radiologist." }] },
      { id: "lab4-t2", lab_id: "lab-4", test_name: "Pregnancy Test", test_type: "Hormone", price: 300, reviews: [{ author: "Ila", rating: 4, comment: "Discrete and quick." }] },
      { id: "lab4-t3", lab_id: "lab-4", test_name: "T3 T4 TSH", test_type: "Hormone", price: 780, reviews: [{ author: "Siddharth", rating: 4, comment: "Easy parking." }] },
      { id: "lab4-t4", lab_id: "lab-4", test_name: "Stool Routine", test_type: "Digestive", price: 420, reviews: [{ author: "Kavya", rating: 5, comment: "Accurate reports." }] },
      { id: "lab4-t5", lab_id: "lab-4", test_name: "B12", test_type: "Vitamin", price: 1250, reviews: [{ author: "Vivek", rating: 5, comment: "Convenient home pickup." }] }
    ]
  },
  {
    id: "lab-5",
    name: "Guduvanchery Care Labs",
    location: "Guduvanchery, Chengalpattu",
    coordinates: { lat: 12.8431, lng: 80.0601 },
    contact: "+91 44 4743 5500",
    rating: 4.5,
    vacancy: 11,
    date_available: "2026-03-19",
    tests: [
      { id: "lab5-t1", lab_id: "lab-5", test_name: "CBC", test_type: "Blood", price: 430, reviews: [{ author: "Lavanya", rating: 5, comment: "Very convenient for morning tests." }] },
      { id: "lab5-t2", lab_id: "lab-5", test_name: "Fasting Blood Sugar", test_type: "Blood", price: 180, reviews: [{ author: "Suresh", rating: 4, comment: "Quick sample collection." }] },
      { id: "lab5-t3", lab_id: "lab-5", test_name: "Thyroid Profile", test_type: "Hormone", price: 790, reviews: [{ author: "Devi", rating: 4, comment: "Reports arrived the same evening." }] },
      { id: "lab5-t4", lab_id: "lab-5", test_name: "ECG", test_type: "Cardiac", price: 560, reviews: [{ author: "Hari", rating: 5, comment: "Clean setup and smooth process." }] },
      { id: "lab5-t5", lab_id: "lab-5", test_name: "Vitamin B12", test_type: "Vitamin", price: 1180, reviews: [{ author: "Monica", rating: 4, comment: "Helpful front desk." }] }
    ]
  }
];

export const medicineStoreData: MedicineStore[] = [
  {
    id: "med-1",
    name: "SRM Care Pharmacy",
    location: "Kattankulathur, Chengalpattu",
    contact: "+91 44 4500 1010",
    rating: 4.7,
    coordinates: { lat: 12.8226, lng: 80.0436 },
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
    id: "med-2",
    name: "Guduvanchery MediMart",
    location: "Guduvanchery, Chengalpattu",
    contact: "+91 44 4500 2020",
    rating: 4.5,
    coordinates: { lat: 12.8434, lng: 80.0588 },
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
    id: "med-3",
    name: "Chengalpattu Wellness Pharmacy",
    location: "Chengalpattu",
    contact: "+91 44 4500 3030",
    rating: 4.8,
    coordinates: { lat: 12.6912, lng: 79.9787 },
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
    id: "med-4",
    name: "Tambaram Health Pharmacy",
    location: "Tambaram, Chennai",
    contact: "+91 44 4500 4040",
    rating: 4.6,
    coordinates: { lat: 12.9251, lng: 80.1160 },
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
    id: "med-5",
    name: "Urapakkam Family Pharmacy",
    location: "Urapakkam, Chengalpattu",
    contact: "+91 44 4500 5050",
    rating: 4.4,
    coordinates: { lat: 12.8674, lng: 80.0694 },
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

export const cityOptions = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Delhi", "Pune"];
export const languageOptions = ["English", "Tamil", "Hindi"];
