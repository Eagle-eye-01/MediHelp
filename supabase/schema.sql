create extension if not exists "pgcrypto";

create table if not exists public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  gender text,
  dob date,
  email text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  original_name text not null,
  file_url text not null,
  file_type text not null,
  file_size integer not null,
  ai_summary text,
  disease_name text,
  patient_name text,
  upload_date timestamp with time zone default now(),
  is_compressed boolean default false
);

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  coordinates jsonb not null,
  contact text not null,
  rating numeric(2,1) not null default 0,
  bed_vacancy integer not null default 0,
  specializations text[] default '{}'
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  name text not null,
  specialization text not null,
  experience_years integer not null default 0,
  success_rate numeric(5,2) not null default 0,
  contact text not null
);

create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  coordinates jsonb not null,
  contact text not null,
  rating numeric(2,1) not null default 0,
  vacancy integer not null default 0,
  date_available date not null
);

create table if not exists public.lab_tests (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs(id) on delete cascade,
  test_name text not null,
  test_type text not null,
  price numeric(10,2) not null,
  reviews jsonb[] default '{}'
);

create table if not exists public.medicine_stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  contact text not null,
  rating numeric(2,1) not null default 0,
  medicines jsonb[] default '{}'
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  appointment_date timestamp with time zone not null,
  medical_history_sent boolean default false,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'done'))
);

alter table public.users_profile enable row level security;
alter table public.documents enable row level security;
alter table public.appointments enable row level security;

create policy "Users can view own profile"
  on public.users_profile for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users_profile for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users_profile for update
  using (auth.uid() = id);

create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

create policy "Users can view own appointments"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "Users can create own appointments"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own appointments"
  on public.appointments for update
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('medical-documents', 'medical-documents', true)
on conflict (id) do nothing;

create policy "Public can view medical documents"
  on storage.objects for select
  using (bucket_id = 'medical-documents');

create policy "Authenticated users upload own medical documents"
  on storage.objects for insert
  with check (
    bucket_id = 'medical-documents'
    and auth.role() = 'authenticated'
  );

create policy "Authenticated users update own medical documents"
  on storage.objects for update
  using (
    bucket_id = 'medical-documents'
    and auth.role() = 'authenticated'
  );

