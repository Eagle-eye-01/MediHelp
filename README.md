# MediHelp

MediHelp is a comprehensive healthcare platform built to connect patients with essential medical services and clinical trials. It empowers users to manage their health records, locate nearby hospitals and labs, track their prescribed medicines, and find relevant clinical trials using advanced AI (RAG process) and medical document parsing.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI & Styling**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Database & Authentication**: [Supabase](https://supabase.com/)
- **AI Integration**: [Google Generative AI SDK (Gemini)](https://ai.google.dev/), [Groq API](https://groq.com/)
- **Vector Database**: [ChromaDB](https://www.trychroma.com/) (Local CPU-based embeddings)
- **Maps & Visualization**: [Leaflet](https://leafletjs.com/), [Recharts](https://recharts.org/)
- **Components & Utils**: `canvas-confetti`, `sonner`, `lucide-react`, `clsx`, `tailwind-merge`
- **Data Pipeline**: `ingest.py` (Python script for RAG data processing and storage)

---

## 📋 Features Sheet

| Feature Module | Description & Capabilities | Status |
| :--- | :--- | :---: |
| **🔐 Authentication** | Secure user login, registration, and session management using Supabase Auth. | ✅ |
| **📊 Dashboard** | A holistic overview displaying key health metrics, recent activity, upcoming appointments, and personalized health recommendations using Recharts. | ✅ |
| **📄 Document Management** | Users can upload, parse, and securely store health records (prescriptions, lab reports). Powered by Supabase Storage. | ✅ |
| **🏥 Hospital Finder** | Integrated Map (Leaflet) to locate nearby hospitals, clinics, and specialized medical centers based on the user's location. | ✅ |
| **🔬 Labs & Diagnostics** | Search directory for nearby diagnostic centers to book blood tests, scans, and other pathological evaluations. | ✅ |
| **💊 Medicines Tracking** | Digital pharmacy bridge connecting users to essential medicines, tracking prescriptions and ongoing pill regimens. | ✅ |
| **🧬 Clinical Trial Finder** | RAG-powered matching system recommending clinical trials based on patient data, with plain-language explanations in English, Tamil, Hindi, and Telugu. Backed by local ChromaDB embeddings. | ✅ |
| **🧑‍⚕️ User Profile** | Comprehensive patient profile containing demographic data, medical history, allergies, and contact details to improve AI matching accuracy. | ✅ |

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or yarn
- A [Supabase](https://supabase.com/) account and project
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project
cd medihelp

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project and add the following keys:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Generative AI (Gemini)
GOOGLE_API_KEY=your_google_gemini_api_key
```

*(Note: Never commit your `.env.local` file containing real API keys!)*

### 3. Run the Development Server

Start the local Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🛠 Project Structure

- `app/` - Next.js App Router containing pages (`/dashboard`, `/auth`, `/upload`, `/hospital`, etc.)
- `components/` - Reusable React components and UI elements.
- `lib/` - Utility functions, Supabase clients, and generic hooks.
- `public/` - Static assets and images.
- `scripts/` - Database seeding and utility scripts (including `ingest.py` for ChromaDB).

---

## 🚀 What We've Built So Far

- **Completed Frontend Pages**: Fully functional, responsive UI for `/auth/login`, `/auth/register`, `/dashboard`, `/upload`, `/documents`, `/hospital`, `/labs`, `/medicines`, `/clinical-trial`, and `/profile`.
- **Backend & Database**: Configured Supabase for Auth & Storage, established REST API connectivity, and tested queries via Postman.
- **AI & RAG Pipeline**: Built a robust Python ingest script (`ingest.py`) to fetch, chunk, and embed clinical trial data into a local ChromaDB instance.
- **Multilingual Support**: Integrated Groq API and Gemini to generate plain-language clinical trial explanations in English, Tamil, Hindi, and Telugu.
- **Business Strategy**: Evaluated and defined business models, value propositions, and monetization strategies for the MediHelp healthtech ecosystem.

- Thank you for reading!!!

