# Sayfold — Voice-First Knowledge Capture Vault

> **One-liner:** Voice-first knowledge capture PWA. Tap the mic, speak naturally, and let AI classify your thoughts into the exact book or chapter collection.

Inspired by the editorial minimalism and calm aesthetics of [AskLibris](https://asklibris.com/), Sayfold is designed as a tranquil, clutter-free second brain for avid readers and thinkers.

---

## 1. Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Database & Auth:** Supabase (PostgreSQL with Row-Level Security, Auth, Full-Text Search tsvector)
- **AI & Speech-to-Text:** Groq (Whisper `whisper-large-v3-turbo` + LLM `llama-3.3-70b-versatile`)
- **Pipeline Orchestration:** LangGraph (`@langchain/langgraph`) for stateful capture & classification
- **PWA:** Installable manifest, mobile-responsive layout with bottom navigation

---

## 2. Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for variable names.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
GROQ_API_KEY=gsk_your_groq_api_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_optional_for_admin_tests
```

> **Security Guardrail:** `GROQ_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side environment variables and are never bundled into client-side code.

---

## 3. Database & Migrations Setup

1. Open your Supabase Project Dashboard -> **SQL Editor**.
2. Run the migration script located at:
   `supabase/migrations/20261102_init_sayfold.sql`
3. This creates:
   - `profiles`: User profile auto-synced with Supabase Auth.
   - `sources`: Books and podcasts collections.
   - `chapters`: Chapters tied to sources.
   - `knowledge_entries`: Captured ideas, quotes, vocabulary, questions, and notes.
   - **Row-Level Security (RLS)** on all tables (`auth.uid() = user_id`).
   - **Postgres Full-Text Search (`fts`)** generated column and `GIN` index.
   - Cascade delete cascading `sources` -> `chapters` -> `knowledge_entries`.

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Build & Verification

```bash
# Run TypeScript and production build verification
npm run build

# Run automated RLS and pipeline verification
node scripts/verify-rls.mjs
```

---

## 6. Deployment (Vercel)

1. Push this repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`) in the Vercel Project Settings.
4. Deploy!

