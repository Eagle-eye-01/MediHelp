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
    original_name: "cbc-report-feb.png",
    file_url: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
    file_type: "image/png",
    file_size: 360000,
    ai_summary: "CBC indicates mild iron deficiency and recommends a follow-up hemoglobin check in six weeks.",
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
    file_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    file_type: "application/pdf",
    file_size: 940000,
    ai_summary: "Thyroid levels are within the lab reference range, with a note to continue regular annual monitoring.",
    disease_name: "Thyroid screening",
    patient_name: "Ananya Rao",
    upload_date: "2026-02-27T08:30:00.000Z",
    is_compressed: false
  },
  {
    id: "doc-3",
    user_id: "demo-user",
    file_name: "ananya_vitamin-d_2026-03-11",
    original_name: "vitamin-d.jpeg",
    file_url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
    file_type: "image/jpeg",
    file_size: 410000,
    ai_summary: "Vitamin D is borderline low and the report suggests more sunlight exposure plus supplementation review.",
    disease_name: "Vitamin D insufficiency",
    patient_name: "Ananya Rao",
    upload_date: "2026-03-11T13:10:00.000Z",
    is_compressed: false
  }
];

export const hospitalData: HospitalWithDoctors[] = [
  {
    id: "hosp-1",
    name: "Bangalore City Care Hospital",
    location: "Indiranagar, Bangalore",
    coordinates: { lat: 12.9718, lng: 77.6412 },
    contact: "+91 80 4100 1100",
    rating: 4.8,
    bed_vacancy: 18,
    specializations: ["Cardiology", "Orthopedics", "General Surgery"],
    doctors: [
      { id: "doc-h1-1", hospital_id: "hosp-1", name: "Dr. Vivek Menon", specialization: "Cardiology", experience_years: 14, success_rate: 96, contact: "+91 98765 10001" },
      { id: "doc-h1-2", hospital_id: "hosp-1", name: "Dr. Nisha Kapoor", specialization: "Orthopedics", experience_years: 11, success_rate: 94, contact: "+91 98765 10002" },
      { id: "doc-h1-3", hospital_id: "hosp-1", name: "Dr. Farhan Ali", specialization: "General Surgery", experience_years: 9, success_rate: 91, contact: "+91 98765 10003" }
    ]
  },
  {
    id: "hosp-2",
    name: "Lakeview Multispeciality",
    location: "Koramangala, Bangalore",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    contact: "+91 80 4122 2200",
    rating: 4.6,
    bed_vacancy: 10,
    specializations: ["Neurology", "ENT", "Gastroenterology"],
    doctors: [
      { id: "doc-h2-1", hospital_id: "hosp-2", name: "Dr. Priya Raman", specialization: "Neurology", experience_years: 13, success_rate: 95, contact: "+91 98765 10011" },
      { id: "doc-h2-2", hospital_id: "hosp-2", name: "Dr. Harish Iyer", specialization: "ENT", experience_years: 10, success_rate: 90, contact: "+91 98765 10012" },
      { id: "doc-h2-3", hospital_id: "hosp-2", name: "Dr. Meera Shah", specialization: "Gastroenterology", experience_years: 16, success_rate: 97, contact: "+91 98765 10013" }
    ]
  },
  {
    id: "hosp-3",
    name: "Greenline Health Institute",
    location: "Whitefield, Bangalore",
    coordinates: { lat: 12.9698, lng: 77.7499 },
    contact: "+91 80 4155 5500",
    rating: 4.5,
    bed_vacancy: 22,
    specializations: ["Oncology", "Dermatology", "Pulmonology"],
    doctors: [
      { id: "doc-h3-1", hospital_id: "hosp-3", name: "Dr. Sneha Bhat", specialization: "Oncology", experience_years: 18, success_rate: 93, contact: "+91 98765 10021" },
      { id: "doc-h3-2", hospital_id: "hosp-3", name: "Dr. Rahul Suresh", specialization: "Dermatology", experience_years: 8, success_rate: 89, contact: "+91 98765 10022" },
      { id: "doc-h3-3", hospital_id: "hosp-3", name: "Dr. Aditi Kulkarni", specialization: "Pulmonology", experience_years: 12, success_rate: 92, contact: "+91 98765 10023" }
    ]
  },
  {
    id: "hosp-4",
    name: "MetroCare Surgical Centre",
    location: "Jayanagar, Bangalore",
    coordinates: { lat: 12.9295, lng: 77.5931 },
    contact: "+91 80 4200 4455",
    rating: 4.7,
    bed_vacancy: 12,
    specializations: ["Urology", "General Surgery", "Gynecology"],
    doctors: [
      { id: "doc-h4-1", hospital_id: "hosp-4", name: "Dr. Karthik Reddy", specialization: "Urology", experience_years: 15, success_rate: 94, contact: "+91 98765 10031" },
      { id: "doc-h4-2", hospital_id: "hosp-4", name: "Dr. Lavanya Sen", specialization: "Gynecology", experience_years: 14, success_rate: 95, contact: "+91 98765 10032" },
      { id: "doc-h4-3", hospital_id: "hosp-4", name: "Dr. Manoj Dsouza", specialization: "General Surgery", experience_years: 17, success_rate: 96, contact: "+91 98765 10033" }
    ]
  },
  {
    id: "hosp-5",
    name: "Northstar Advanced Hospital",
    location: "Hebbal, Bangalore",
    coordinates: { lat: 13.0355, lng: 77.5970 },
    contact: "+91 80 4242 8800",
    rating: 4.4,
    bed_vacancy: 14,
    specializations: ["Nephrology", "Pediatrics", "Orthopedics"],
    doctors: [
      { id: "doc-h5-1", hospital_id: "hosp-5", name: "Dr. Rekha Thomas", specialization: "Nephrology", experience_years: 12, success_rate: 91, contact: "+91 98765 10041" },
      { id: "doc-h5-2", hospital_id: "hosp-5", name: "Dr. Sunil Rao", specialization: "Pediatrics", experience_years: 9, success_rate: 88, contact: "+91 98765 10042" },
      { id: "doc-h5-3", hospital_id: "hosp-5", name: "Dr. Isha Nair", specialization: "Orthopedics", experience_years: 13, success_rate: 93, contact: "+91 98765 10043" }
    ]
  }
];

export const labData: LabWithTests[] = [
  {
    id: "lab-1",
    name: "Precision Labs",
    location: "HSR Layout, Bangalore",
    coordinates: { lat: 12.9116, lng: 77.6474 },
    contact: "+91 80 4300 1000",
    rating: 4.8,
    vacancy: 12,
    date_available: "2026-03-18",
    tests: [
      { id: "lab1-t1", lab_id: "lab-1", test_name: "CBC", test_type: "Blood", price: 450, reviews: [{ author: "Nitin", rating: 5, comment: "Quick and neat sample collection." }] },
      { id: "lab1-t2", lab_id: "lab-1", test_name: "Thyroid Profile", test_type: "Hormone", price: 800, reviews: [{ author: "Asha", rating: 4, comment: "Reports came on time." }] },
      { id: "lab1-t3", lab_id: "lab-1", test_name: "Lipid Profile", test_type: "Blood", price: 900, reviews: [{ author: "Pranav", rating: 5, comment: "Good value." }] },
      { id: "lab1-t4", lab_id: "lab-1", test_name: "Vitamin D", test_type: "Vitamin", price: 1200, reviews: [{ author: "Divya", rating: 4, comment: "Friendly staff." }] },
      { id: "lab1-t5", lab_id: "lab-1", test_name: "HbA1c", test_type: "Diabetes", price: 700, reviews: [{ author: "Ritu", rating: 5, comment: "Very fast." }] }
    ]
  },
  {
    id: "lab-2",
    name: "CureQuest Diagnostics",
    location: "Indiranagar, Bangalore",
    coordinates: { lat: 12.9719, lng: 77.6408 },
    contact: "+91 80 4311 1100",
    rating: 4.6,
    vacancy: 9,
    date_available: "2026-03-19",
    tests: [
      { id: "lab2-t1", lab_id: "lab-2", test_name: "Liver Function Test", test_type: "Blood", price: 950, reviews: [{ author: "Kiran", rating: 4, comment: "Good support desk." }] },
      { id: "lab2-t2", lab_id: "lab-2", test_name: "Kidney Function Test", test_type: "Blood", price: 850, reviews: [{ author: "Suma", rating: 5, comment: "Clean center." }] },
      { id: "lab2-t3", lab_id: "lab-2", test_name: "Urine Routine", test_type: "Urine", price: 350, reviews: [{ author: "Maya", rating: 4, comment: "Affordable." }] },
      { id: "lab2-t4", lab_id: "lab-2", test_name: "Chest X-Ray", test_type: "Imaging", price: 1400, reviews: [{ author: "Arun", rating: 5, comment: "Minimal wait time." }] },
      { id: "lab2-t5", lab_id: "lab-2", test_name: "ECG", test_type: "Cardiac", price: 600, reviews: [{ author: "Naveen", rating: 4, comment: "Smooth process." }] }
    ]
  },
  {
    id: "lab-3",
    name: "MetroScan Lab Services",
    location: "Malleshwaram, Bangalore",
    coordinates: { lat: 13.0035, lng: 77.5706 },
    contact: "+91 80 4333 3300",
    rating: 4.4,
    vacancy: 16,
    date_available: "2026-03-18",
    tests: [
      { id: "lab3-t1", lab_id: "lab-3", test_name: "MRI Brain", test_type: "Imaging", price: 6200, reviews: [{ author: "Ajay", rating: 4, comment: "Detailed explanation by technician." }] },
      { id: "lab3-t2", lab_id: "lab-3", test_name: "CT Chest", test_type: "Imaging", price: 4200, reviews: [{ author: "Rhea", rating: 4, comment: "Comfortable facility." }] },
      { id: "lab3-t3", lab_id: "lab-3", test_name: "Dengue Panel", test_type: "Infectious", price: 1800, reviews: [{ author: "Sanjay", rating: 5, comment: "Same-day report." }] },
      { id: "lab3-t4", lab_id: "lab-3", test_name: "CRP", test_type: "Inflammation", price: 650, reviews: [{ author: "Sonal", rating: 4, comment: "Easy booking." }] },
      { id: "lab3-t5", lab_id: "lab-3", test_name: "Ferritin", test_type: "Blood", price: 1100, reviews: [{ author: "Tanvi", rating: 5, comment: "Helpful front desk." }] }
    ]
  },
  {
    id: "lab-4",
    name: "Zenith Path Labs",
    location: "Whitefield, Bangalore",
    coordinates: { lat: 12.9695, lng: 77.7490 },
    contact: "+91 80 4388 8800",
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
  }
];

export const medicineStoreData: MedicineStore[] = [
  {
    id: "med-1",
    name: "CarePlus Pharmacy",
    location: "Indiranagar, Bangalore",
    contact: "+91 80 4500 1010",
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
    id: "med-2",
    name: "MediMart Express",
    location: "Koramangala, Bangalore",
    contact: "+91 80 4500 2020",
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
    id: "med-3",
    name: "Wellness Drug House",
    location: "Whitefield, Bangalore",
    contact: "+91 80 4500 3030",
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
  }
];

export const cityOptions = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Delhi", "Pune"];
export const languageOptions = ["English", "Tamil", "Hindi"];
