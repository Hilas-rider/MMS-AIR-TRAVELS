# MMS Tours & Travels — Global Travel & Cargo Portal

A full-stack, enterprise-grade travel agency and cargo logistics platform for **MMS Tours & Travels** (Adirampattinam & Madukkur). Features include:
- **Instant Flight Search & Fare Management**: Live wholesale block fares, GDS routes, and group fare blocks.
- **B2B Visa Enquiry Form & Automated WhatsApp API**: Full embassy document checklists, instant calculations, and WhatsApp confirmation messages.
- **Itinerary Manager & Boarding Pass**: High-resolution generated QR codes for mobile kiosk boarding, CSV export, and PDF printing.
- **Multi-Tenant Staff Operations Panel**: Role-based access (Owner, Manager, Staff) with session management, 2FA, fare revisions, and activity logging.
- **Supabase PostgreSQL & Vercel Native**: Zero-configuration deployment to Vercel via GitHub with Supabase cloud database integration.

---

## 🚀 Quick Deploy to Vercel via GitHub

### 1. Push this Repository to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit for MMS Travels"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 2. Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Choose your GitHub repository and click **Import**.
3. Under **Framework Preset**, select **Vite** (detected automatically).
4. Build settings are pre-configured via `vercel.json`:
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## 🗄️ Setting Up Supabase Database (PostgreSQL)

You can connect a free Supabase PostgreSQL database in under 2 minutes:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and click **Start your project** (Free tier available).
2. Create an organization and new project (e.g. `mms-travels-db`).

### Step 2: Run the SQL Schema Script
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open `supabase-schema.sql` (or `supabase/schema.sql`) from this repository.
4. Paste the entire content into the SQL Editor and click **Run**.
5. This creates all necessary tables with Row Level Security (RLS) policies:
   - `bookings`: Flight tickets, PNRs, baggage, and passenger manifests.
   - `visa_enquiries`: Full B2B Visa applications, document attachments, and contact details.
   - `flight_inquiries`: Customer leads and quote requests.
   - `staff_users`: Administrative accounts with PBKDF2 password hashes.
   - `fares`: Wholesale sector rates and live inventory.
   - `activity_logs`: Complete audit trail.

### Step 3: Configure Environment Variables in Vercel
In your Vercel Project Dashboard &rarr; **Settings** &rarr; **Environment Variables**, add:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Project URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public Client Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |
| `SUPABASE_SERVICE_ROLE_KEY` | (Optional) Privileged Service Key | `eyJhbGciOiJIUzI1NiIsInR5cCI...` |
| `GEMINI_API_KEY` | (Optional) For AI Concierge | `AIzaSy...` |

*(Find these under Supabase: **Project Settings** &rarr; **API**)*

---

## 💻 Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment:
   ```bash
   cp .env.example .env
   # Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (optional for local mock mode)
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/` for customer website and `http://localhost:3000/staff/` for staff portal.

---

## 🔐 Default Demo Staff Accounts

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Owner** | `owner` / `owner@mmstravels.com` | `Owner@MMS2026!` |
| **Manager** | `manager` / `manager@mmstravels.com` | `Manager@MMS2026!` |
| **Staff** | `staff` / `staff@mmstravels.com` | `Staff@MMS2026!` |

*(2FA Verification Test Code if prompted: `123456` or `7442`)*

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, QRCode.
- **Backend / Serverless**: Node.js, Express, Vercel Serverless Functions (`/api`).
- **Database**: Supabase (PostgreSQL with RLS & JSONB support) + Local Storage caching fallback.
- **Integration**: WhatsApp API link automation, Solari Departure Board, ThreeUI WebGL Shader.
