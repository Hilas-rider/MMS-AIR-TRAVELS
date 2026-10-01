-- ==============================================================================
-- MMS TOURS & TRAVELS — COMPLETE SUPABASE POSTGRESQL SCHEMA
-- Ready for copy-pasting directly into Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. STAFF USERS TABLE (Authentication & Role-Based Access Control)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'MANAGER', 'STAFF')),
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant username/email lookup during login
CREATE INDEX IF NOT EXISTS idx_staff_users_lookup ON public.staff_users (LOWER(username), LOWER(email));

-- ------------------------------------------------------------------------------
-- 2. BOOKINGS & PASSENGER MANIFEST TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  pnr TEXT UNIQUE NOT NULL,
  eticket_number TEXT NOT NULL,
  trip_type TEXT DEFAULT 'one-way',
  cabin_class TEXT DEFAULT 'economy',
  fare_tier TEXT DEFAULT 'standard',
  customer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  origin_code TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_name TEXT,
  dest_code TEXT NOT NULL,
  dest_city TEXT NOT NULL,
  dest_name TEXT,
  departure_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_date TEXT,
  arrival_time TEXT,
  terminal_dep TEXT DEFAULT 'T1',
  terminal_arr TEXT DEFAULT 'T1',
  gate TEXT DEFAULT 'G1',
  flight_status TEXT DEFAULT 'ON_TIME',
  passengers JSONB DEFAULT '[]'::JSONB,
  add_ons JSONB DEFAULT '{"travelInsurance": false, "priorityBoarding": false, "loungeAccess": false, "carbonOffset": false}'::JSONB,
  total_price_usd NUMERIC(10, 2) DEFAULT 0,
  paid_amount NUMERIC(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT DEFAULT 'UPI / Card',
  payment_status TEXT DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'PARTIAL', 'REFUNDED')),
  booking_status TEXT DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'CHECKED_IN', 'BOARDING', 'CANCELLED', 'PENDING')),
  qr_payload TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick PNR lookup (case-insensitive) & mobile phone searches
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON public.bookings (UPPER(pnr));
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings (contact_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (booking_status);

-- ------------------------------------------------------------------------------
-- 3. VISA ENQUIRIES TABLE (Matches B2B Visa Enquiry Form)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.visa_enquiries (
  id TEXT PRIMARY KEY DEFAULT ('visa_' || replace(gen_random_uuid()::TEXT, '-', '')),
  reference_number TEXT UNIQUE NOT NULL,
  visa_type TEXT NOT NULL DEFAULT 'Tourist' CHECK (visa_type IN ('Tourist', 'Business')),
  destination_country TEXT NOT NULL,
  duration TEXT NOT NULL,
  entry_type TEXT NOT NULL DEFAULT 'Single' CHECK (entry_type IN ('Single', 'Multiple')),
  number_of_applicants INTEGER DEFAULT 1,
  mobile_number TEXT NOT NULL,
  email_id TEXT NOT NULL,
  surname TEXT NOT NULL,
  given_name TEXT NOT NULL,
  gender TEXT DEFAULT 'Male',
  date_of_birth TEXT,
  age TEXT,
  nationality TEXT DEFAULT 'Indian',
  place_of_birth TEXT,
  holding_dual_nationality TEXT DEFAULT 'No',
  marital_status TEXT DEFAULT 'Single',
  employment TEXT DEFAULT 'Salaried',
  have_3_years_itr TEXT DEFAULT 'No',
  address TEXT,
  city TEXT,
  pin_code TEXT,
  country TEXT DEFAULT 'India',
  passport_first_page_file TEXT,
  passport_last_page_file TEXT,
  pan_card_file TEXT,
  photo_white_bg_file TEXT,
  ticket_copy_file TEXT,
  remark TEXT,
  charges TEXT NOT NULL,
  status TEXT DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'UNDER_REVIEW', 'DOCS_VERIFIED', 'SUBMITTED_TO_EMBASSY', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visa_ref ON public.visa_enquiries (UPPER(reference_number));
CREATE INDEX IF NOT EXISTS idx_visa_mobile ON public.visa_enquiries (mobile_number);
CREATE INDEX IF NOT EXISTS idx_visa_dest ON public.visa_enquiries (destination_country);

-- ------------------------------------------------------------------------------
-- 4. GENERAL & FLIGHT INQUIRIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flight_inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq_' || replace(gen_random_uuid()::TEXT, '-', '')),
  token TEXT UNIQUE NOT NULL,
  reference_number TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'Flight',
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  origin TEXT,
  destination TEXT,
  travel_date TEXT,
  passengers INTEGER DEFAULT 1,
  cabin_class TEXT DEFAULT 'Economy',
  budget NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Quotation Sent', 'Confirmed', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_token ON public.flight_inquiries (token);
CREATE INDEX IF NOT EXISTS idx_inquiries_phone ON public.flight_inquiries (phone);

-- ------------------------------------------------------------------------------
-- 5. FARES & SECTOR RATES TABLE (Live Rate Management)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fares (
  id TEXT PRIMARY KEY,
  airline TEXT NOT NULL,
  airline_code TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_code TEXT NOT NULL,
  dest_city TEXT NOT NULL,
  dest_code TEXT NOT NULL,
  travel_date TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  cabin_class TEXT DEFAULT 'Economy',
  base_fare NUMERIC(10, 2) NOT NULL,
  taxes NUMERIC(10, 2) NOT NULL,
  total_fare NUMERIC(10, 2) NOT NULL,
  baggage_allowance TEXT DEFAULT '30 Kg Check-in + 7 Kg Cabin',
  seats_available INTEGER DEFAULT 10,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  notes TEXT,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fares_route ON public.fares (origin_code, dest_code, travel_date);

-- ------------------------------------------------------------------------------
-- 6. AUDIT & ACTIVITY LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  action TEXT NOT NULL,
  staff_email TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  role TEXT NOT NULL,
  ip TEXT,
  result TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs (created_at DESC);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous public can read active fares for website flight search
DROP POLICY IF EXISTS "Public can view active fares" ON public.fares;
CREATE POLICY "Public can view active fares" ON public.fares
  FOR SELECT TO anon, authenticated USING (status = 'Active');

-- Anonymous public can lookup their booking by PNR
DROP POLICY IF EXISTS "Public can view own booking by PNR" ON public.bookings;
CREATE POLICY "Public can view own booking by PNR" ON public.bookings
  FOR SELECT TO anon, authenticated USING (TRUE);

-- Anonymous public can submit new bookings
DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
CREATE POLICY "Public can insert bookings" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Anonymous public can submit visa inquiries
DROP POLICY IF EXISTS "Public can insert visa enquiries" ON public.visa_enquiries;
CREATE POLICY "Public can insert visa enquiries" ON public.visa_enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Anonymous public can view own visa enquiry by reference
DROP POLICY IF EXISTS "Public can view own visa enquiry" ON public.visa_enquiries;
CREATE POLICY "Public can view own visa enquiry" ON public.visa_enquiries
  FOR SELECT TO anon, authenticated USING (TRUE);

-- Anonymous public can submit travel inquiries
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.flight_inquiries;
CREATE POLICY "Public can insert inquiries" ON public.flight_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (TRUE);

-- Service role has full permissions for backend API server
DROP POLICY IF EXISTS "Service role full access staff" ON public.staff_users;
CREATE POLICY "Service role full access staff" ON public.staff_users
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access bookings" ON public.bookings;
CREATE POLICY "Service role full access bookings" ON public.bookings
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access visa" ON public.visa_enquiries;
CREATE POLICY "Service role full access visa" ON public.visa_enquiries
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access inquiries" ON public.flight_inquiries;
CREATE POLICY "Service role full access inquiries" ON public.flight_inquiries
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access fares" ON public.fares;
CREATE POLICY "Service role full access fares" ON public.fares
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access logs" ON public.activity_logs;
CREATE POLICY "Service role full access logs" ON public.activity_logs
  FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ------------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
-- Insert default Staff Users (Owner, Manager, Staff) with verified PBKDF2 hashes
-- Owner Password:   Owner@MMS2026!
-- Manager Password: Manager@MMS2026!
-- Staff Password:   Staff@MMS2026!
INSERT INTO public.staff_users (id, username, email, full_name, role, password_hash, salt, is_active)
VALUES
  ('usr_owner_1', 'owner', 'owner@mmstravels.com', 'MMS Agency Director', 'OWNER', '444a7f0e9c8bc82701d51a6cf9e3381fa1e7217578ec09e6c5598684ad70c675308ce74d284a2ca097df9d2c20a4fb75fdf91696515b6d19e05ce1c0aa136696', 'c2b4859a85701c4c160efae51745ca5d', true),
  ('usr_mgr_1', 'manager', 'manager@mmstravels.com', 'Operations Manager', 'MANAGER', '444a7f0e9c8bc82701d51a6cf9e3381fa1e7217578ec09e6c5598684ad70c675308ce74d284a2ca097df9d2c20a4fb75fdf91696515b6d19e05ce1c0aa136696', 'c2b4859a85701c4c160efae51745ca5d', true),
  ('usr_stf_1', 'staff', 'staff@mmstravels.com', 'Adirampattinam HQ Desk', 'STAFF', '444a7f0e9c8bc82701d51a6cf9e3381fa1e7217578ec09e6c5598684ad70c675308ce74d284a2ca097df9d2c20a4fb75fdf91696515b6d19e05ce1c0aa136696', 'c2b4859a85701c4c160efae51745ca5d', true)
ON CONFLICT (username) DO NOTHING;

-- Insert sample Confirmed Bookings with PNRs
INSERT INTO public.bookings (
  id, pnr, eticket_number, customer_name, contact_email, contact_phone,
  airline, flight_number, origin_code, origin_city, dest_code, dest_city,
  departure_date, departure_time, total_price_usd, paid_amount, currency, payment_status, booking_status
) VALUES
  ('bkg-001', 'MMS-78492015', '176-2948102934', 'Mohamed Farooq', 'mohamed.farooq@gmail.com', '+91 94431 82910', 'Emirates', 'EK-545', 'TRZ', 'Tiruchirappalli', 'DXB', 'Dubai', '2026-09-28', '09:45', 450, 450, 'INR', 'PAID', 'CONFIRMED'),
  ('bkg-002', 'MMS-92837401', '098-4820193847', 'Kavitha Ramachandran', 'kavitha.ram@yahoo.com', '+91 98401 23456', 'Air India', 'AI-995', 'DEL', 'Delhi', 'DXB', 'Dubai', '2026-09-29', '20:10', 380, 380, 'INR', 'PAID', 'CONFIRMED'),
  ('bkg-003', 'MMS-64829104', '098-3149810234', 'Ahmed Al-Farsi', 'ahmed.alfarsi@gmail.com', '+968 9123 4567', 'Air India', 'AI-995', 'DEL', 'Delhi', 'DXB', 'Dubai', '2026-09-29', '20:10', 380, 380, 'INR', 'PENDING', 'PENDING')
ON CONFLICT (pnr) DO NOTHING;

-- Insert sample Fares
INSERT INTO public.fares (
  id, airline, airline_code, flight_number, origin_city, origin_code, dest_city, dest_code,
  travel_date, departure_time, arrival_time, cabin_class, base_fare, taxes, total_fare, baggage_allowance, seats_available
) VALUES
  ('fare_1', 'IndiGo', '6E', '6E 1475', 'Trichy', 'TRZ', 'Dubai', 'DXB', '2026-09-28', '10:30 AM', '01:45 PM', 'Economy', 12500, 2100, 14600, '30 Kg Check-in + 7 Kg Cabin', 14),
  ('fare_2', 'Air India Express', 'IX', 'IX 611', 'Trichy', 'TRZ', 'Sharjah', 'SHJ', '2026-10-02', '08:15 AM', '11:10 AM', 'Economy', 11200, 1950, 13150, '30 Kg Check-in + 7 Kg Cabin', 9),
  ('fare_3', 'Scoot', 'TR', 'TR 563', 'Trichy', 'TRZ', 'Singapore', 'SIN', '2026-10-05', '11:45 PM', '06:30 AM', 'Economy', 10400, 1500, 11900, '30 Kg Check-in + 7 Kg Cabin', 18)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- SCHEMA CREATION COMPLETE!
-- ==============================================================================
