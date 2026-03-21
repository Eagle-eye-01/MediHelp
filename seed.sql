insert into public.hospitals (id, name, location, coordinates, contact, rating, bed_vacancy, specializations) values
('00000000-0000-0000-0000-000000000101', 'Bangalore City Care Hospital', 'Indiranagar, Bangalore', '{"lat": 12.9718, "lng": 77.6412}', '+91 80 4100 1100', 4.8, 18, '{"Cardiology","Orthopedics","General Surgery"}'),
('00000000-0000-0000-0000-000000000102', 'Lakeview Multispeciality', 'Koramangala, Bangalore', '{"lat": 12.9352, "lng": 77.6245}', '+91 80 4122 2200', 4.6, 10, '{"Neurology","ENT","Gastroenterology"}'),
('00000000-0000-0000-0000-000000000103', 'Greenline Health Institute', 'Whitefield, Bangalore', '{"lat": 12.9698, "lng": 77.7499}', '+91 80 4155 5500', 4.5, 22, '{"Oncology","Dermatology","Pulmonology"}'),
('00000000-0000-0000-0000-000000000104', 'MetroCare Surgical Centre', 'Jayanagar, Bangalore', '{"lat": 12.9295, "lng": 77.5931}', '+91 80 4200 4455', 4.7, 12, '{"Urology","General Surgery","Gynecology"}'),
('00000000-0000-0000-0000-000000000105', 'Northstar Advanced Hospital', 'Hebbal, Bangalore', '{"lat": 13.0355, "lng": 77.5970}', '+91 80 4242 8800', 4.4, 14, '{"Nephrology","Pediatrics","Orthopedics"}')
on conflict (id) do nothing;

insert into public.doctors (id, hospital_id, name, specialization, experience_years, success_rate, contact) values
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Dr. Vivek Menon', 'Cardiology', 14, 96, '+91 98765 10001'),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'Dr. Nisha Kapoor', 'Orthopedics', 11, 94, '+91 98765 10002'),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'Dr. Farhan Ali', 'General Surgery', 9, 91, '+91 98765 10003'),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 'Dr. Priya Raman', 'Neurology', 13, 95, '+91 98765 10011'),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000102', 'Dr. Harish Iyer', 'ENT', 10, 90, '+91 98765 10012'),
('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102', 'Dr. Meera Shah', 'Gastroenterology', 16, 97, '+91 98765 10013'),
('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000103', 'Dr. Sneha Bhat', 'Oncology', 18, 93, '+91 98765 10021'),
('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000103', 'Dr. Rahul Suresh', 'Dermatology', 8, 89, '+91 98765 10022'),
('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000103', 'Dr. Aditi Kulkarni', 'Pulmonology', 12, 92, '+91 98765 10023'),
('00000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000104', 'Dr. Karthik Reddy', 'Urology', 15, 94, '+91 98765 10031'),
('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000104', 'Dr. Lavanya Sen', 'Gynecology', 14, 95, '+91 98765 10032'),
('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000104', 'Dr. Manoj Dsouza', 'General Surgery', 17, 96, '+91 98765 10033'),
('00000000-0000-0000-0000-000000000213', '00000000-0000-0000-0000-000000000105', 'Dr. Rekha Thomas', 'Nephrology', 12, 91, '+91 98765 10041'),
('00000000-0000-0000-0000-000000000214', '00000000-0000-0000-0000-000000000105', 'Dr. Sunil Rao', 'Pediatrics', 9, 88, '+91 98765 10042'),
('00000000-0000-0000-0000-000000000215', '00000000-0000-0000-0000-000000000105', 'Dr. Isha Nair', 'Orthopedics', 13, 93, '+91 98765 10043')
on conflict (id) do nothing;

insert into public.labs (id, name, location, coordinates, contact, rating, vacancy, date_available) values
('00000000-0000-0000-0000-000000000301', 'Precision Labs', 'HSR Layout, Bangalore', '{"lat": 12.9116, "lng": 77.6474}', '+91 80 4300 1000', 4.8, 12, '2026-03-18'),
('00000000-0000-0000-0000-000000000302', 'CureQuest Diagnostics', 'Indiranagar, Bangalore', '{"lat": 12.9719, "lng": 77.6408}', '+91 80 4311 1100', 4.6, 9, '2026-03-19'),
('00000000-0000-0000-0000-000000000303', 'MetroScan Lab Services', 'Malleshwaram, Bangalore', '{"lat": 13.0035, "lng": 77.5706}', '+91 80 4333 3300', 4.4, 16, '2026-03-18'),
('00000000-0000-0000-0000-000000000304', 'Zenith Path Labs', 'Whitefield, Bangalore', '{"lat": 12.9695, "lng": 77.7490}', '+91 80 4388 8800', 4.7, 7, '2026-03-20')
on conflict (id) do nothing;

insert into public.lab_tests (id, lab_id, test_name, test_type, price, reviews) values
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', 'CBC', 'Blood', 450, array['{"author":"Nitin","rating":5,"comment":"Quick and neat sample collection."}'::jsonb]),
('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', 'Thyroid Profile', 'Hormone', 800, array['{"author":"Asha","rating":4,"comment":"Reports came on time."}'::jsonb]),
('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000301', 'Lipid Profile', 'Blood', 900, array['{"author":"Pranav","rating":5,"comment":"Good value."}'::jsonb]),
('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000301', 'Vitamin D', 'Vitamin', 1200, array['{"author":"Divya","rating":4,"comment":"Friendly staff."}'::jsonb]),
('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000301', 'HbA1c', 'Diabetes', 700, array['{"author":"Ritu","rating":5,"comment":"Very fast."}'::jsonb]),
('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000302', 'Liver Function Test', 'Blood', 950, array['{"author":"Kiran","rating":4,"comment":"Good support desk."}'::jsonb]),
('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000302', 'Kidney Function Test', 'Blood', 850, array['{"author":"Suma","rating":5,"comment":"Clean center."}'::jsonb]),
('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000302', 'Urine Routine', 'Urine', 350, array['{"author":"Maya","rating":4,"comment":"Affordable."}'::jsonb]),
('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000302', 'Chest X-Ray', 'Imaging', 1400, array['{"author":"Arun","rating":5,"comment":"Minimal wait time."}'::jsonb]),
('00000000-0000-0000-0000-000000000410', '00000000-0000-0000-0000-000000000302', 'ECG', 'Cardiac', 600, array['{"author":"Naveen","rating":4,"comment":"Smooth process."}'::jsonb]),
('00000000-0000-0000-0000-000000000411', '00000000-0000-0000-0000-000000000303', 'MRI Brain', 'Imaging', 6200, array['{"author":"Ajay","rating":4,"comment":"Detailed explanation by technician."}'::jsonb]),
('00000000-0000-0000-0000-000000000412', '00000000-0000-0000-0000-000000000303', 'CT Chest', 'Imaging', 4200, array['{"author":"Rhea","rating":4,"comment":"Comfortable facility."}'::jsonb]),
('00000000-0000-0000-0000-000000000413', '00000000-0000-0000-0000-000000000303', 'Dengue Panel', 'Infectious', 1800, array['{"author":"Sanjay","rating":5,"comment":"Same-day report."}'::jsonb]),
('00000000-0000-0000-0000-000000000414', '00000000-0000-0000-0000-000000000303', 'CRP', 'Inflammation', 650, array['{"author":"Sonal","rating":4,"comment":"Easy booking."}'::jsonb]),
('00000000-0000-0000-0000-000000000415', '00000000-0000-0000-0000-000000000303', 'Ferritin', 'Blood', 1100, array['{"author":"Tanvi","rating":5,"comment":"Helpful front desk."}'::jsonb]),
('00000000-0000-0000-0000-000000000416', '00000000-0000-0000-0000-000000000304', 'Ultrasound Abdomen', 'Imaging', 1500, array['{"author":"Keerthi","rating":5,"comment":"Excellent radiologist."}'::jsonb]),
('00000000-0000-0000-0000-000000000417', '00000000-0000-0000-0000-000000000304', 'Pregnancy Test', 'Hormone', 300, array['{"author":"Ila","rating":4,"comment":"Discrete and quick."}'::jsonb]),
('00000000-0000-0000-0000-000000000418', '00000000-0000-0000-0000-000000000304', 'T3 T4 TSH', 'Hormone', 780, array['{"author":"Siddharth","rating":4,"comment":"Easy parking."}'::jsonb]),
('00000000-0000-0000-0000-000000000419', '00000000-0000-0000-0000-000000000304', 'Stool Routine', 'Digestive', 420, array['{"author":"Kavya","rating":5,"comment":"Accurate reports."}'::jsonb]),
('00000000-0000-0000-0000-000000000420', '00000000-0000-0000-0000-000000000304', 'B12', 'Vitamin', 1250, array['{"author":"Vivek","rating":5,"comment":"Convenient home pickup."}'::jsonb])
on conflict (id) do nothing;

insert into public.medicine_stores (id, name, location, contact, rating, medicines) values
('00000000-0000-0000-0000-000000000501', 'CarePlus Pharmacy', 'Indiranagar, Bangalore', '+91 80 4500 1010', 4.7, array[
  '{"name":"Paracetamol","price":25,"available":true}'::jsonb,
  '{"name":"Azithromycin","price":110,"available":true}'::jsonb,
  '{"name":"Metformin","price":68,"available":true}'::jsonb,
  '{"name":"Vitamin D3","price":165,"available":true}'::jsonb,
  '{"name":"Levothyroxine","price":92,"available":true}'::jsonb,
  '{"name":"Cetirizine","price":38,"available":true}'::jsonb,
  '{"name":"Omeprazole","price":74,"available":true}'::jsonb,
  '{"name":"Ibuprofen","price":43,"available":true}'::jsonb,
  '{"name":"Amoxicillin","price":95,"available":false}'::jsonb,
  '{"name":"Iron Supplement","price":155,"available":true}'::jsonb
]),
('00000000-0000-0000-0000-000000000502', 'MediMart Express', 'Koramangala, Bangalore', '+91 80 4500 2020', 4.5, array[
  '{"name":"Paracetamol","price":22,"available":true}'::jsonb,
  '{"name":"Azithromycin","price":118,"available":true}'::jsonb,
  '{"name":"Metformin","price":64,"available":true}'::jsonb,
  '{"name":"Vitamin D3","price":170,"available":true}'::jsonb,
  '{"name":"Levothyroxine","price":88,"available":true}'::jsonb,
  '{"name":"Cetirizine","price":36,"available":true}'::jsonb,
  '{"name":"Omeprazole","price":71,"available":true}'::jsonb,
  '{"name":"Ibuprofen","price":40,"available":true}'::jsonb,
  '{"name":"Amoxicillin","price":98,"available":true}'::jsonb,
  '{"name":"Iron Supplement","price":149,"available":true}'::jsonb
]),
('00000000-0000-0000-0000-000000000503', 'Wellness Drug House', 'Whitefield, Bangalore', '+91 80 4500 3030', 4.8, array[
  '{"name":"Paracetamol","price":24,"available":true}'::jsonb,
  '{"name":"Azithromycin","price":105,"available":true}'::jsonb,
  '{"name":"Metformin","price":69,"available":false}'::jsonb,
  '{"name":"Vitamin D3","price":160,"available":true}'::jsonb,
  '{"name":"Levothyroxine","price":90,"available":true}'::jsonb,
  '{"name":"Cetirizine","price":35,"available":true}'::jsonb,
  '{"name":"Omeprazole","price":69,"available":true}'::jsonb,
  '{"name":"Ibuprofen","price":42,"available":true}'::jsonb,
  '{"name":"Amoxicillin","price":91,"available":true}'::jsonb,
  '{"name":"Iron Supplement","price":152,"available":true}'::jsonb
])
on conflict (id) do nothing;
