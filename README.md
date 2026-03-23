# MediHelp

MediHelp is a modern, AI-powered healthcare management platform built with Next.js. It leverages Google's Gemini AI to provide smart insights, analyze medical documents, and perform OCR on prescriptions. It also features interactive maps for finding hospitals and labs, user dashboards with health trends, and secure data management using Supabase.

## 🌟 Key Features

* **AI-Powered Healthcare Assistant:** Integrates `@google/generative-ai` (Gemini 1.5 Flash) for analyzing medical documents, performing prescription OCR, and generating unified health summaries.
* **Document Management:** Securely upload, analyze, and manage medical records and prescriptions.
* **Interactive Maps:** Locate nearby hospitals, labs, and pharmacies using `react-leaflet`.
* **Health Dashboard:** Visualize health trends and summaries using interactive charts (`recharts`).
* **Clinical Trials & Medicines:** Explore ongoing clinical trials and search for medicines.
* **Secure Authentication & Database:** Powered by Supabase for robust, secure user authentication and database management.

## 💻 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database & Auth:** [Supabase](https://supabase.com/) (`@supabase/ssr`)
* **AI:** [Google Generative AI](https://ai.google.dev/) (Gemini API)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Components & Icons:** [Radix UI](https://www.radix-ui.com/) / shadcn/ui (via `clsx`, `tailwind-merge`), [Lucide React](https://lucide.dev/)
* **Maps:** [Leaflet](https://leafletjs.com/) & React-Leaflet
* **Charts:** [Recharts](https://recharts.org/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <your-repo-url>
   cd medihelp
   ```
2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Set up your environment variables. Create a `.env.local` file in the root directory and add the following keys (refer to `.env.local.example` if available):  
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  
   # Google Gemini AI
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

### Running the Development Server
Start the application in development mode:

```bash
npm run dev
# or
yarn dev
```
Open <a href="http://localhost:3000">http://localhost:3000</a> in your browser to view the application.

## 📂 Project Structure
A quick overview of the core directories:

* `/app`: Next.js App Router pages including `/dashboard`, `/hospital`, `/labs`, `/medicines`, `/documents`, and `/trials`.
* `/app/api/ai`: Backend routes handling Gemini AI tasks (`prescription-ocr`, `document-analyze`, `dashboard-insights`).
* `/components`: Reusable UI components grouped by feature (dashboard, documents, hospital, maps, UI elements).
* `/lib`: Core utility functions, Supabase client configurations, and Gemini API handlers (`gemini.ts`).
* `/supabase`: Database schema and migration files.

## 🛠 Scripts
* `npm run dev`: Starts the development server.
* `npm run build`: Builds the app for production.
* `npm run start`: Starts the production server.
* `npm run lint`: Runs ESLint to catch errors.

* Thank you for reading.
