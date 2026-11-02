# Memory Vault (Lean MVP PRD)

**One-liner:** Voice-first knowledge capture PWA. Mic dabao, bolo, AI classify karke sahi book/chapter me save kar de.

**Core vertical slice (ye pehle poora kaam kare):**
Signup → book banao → chapter banao → mic tap → bolo → Groq transcribe → classify → DB save → entry sahi collection me dikhe.

---

## 1. Stack

Next.js (App Router, TS, Tailwind), Supabase (auth, Postgres, RLS), Groq (LLM + Whisper), LangGraph (sirf capture flow), Vercel. PWA via manifest + basic service worker. Groq key aur service-role key sirf server-side. Model names ek central config file me.

## 2. Screens

1. **Auth**: email/password signup, login, logout.
2. **Library**: books/podcasts list, create/edit/delete. Source detail me chapters (add, rename, delete) aur uske entries.
3. **Capture**: har main screen pe prominent mic button, full-screen recording overlay.
4. **Vault**: entries ki list with filter by type (Idea, Vocab, Quote, Question, Note) aur by source. Edit/delete.
5. **Search / Ask**: search bar (full-text) + "Ask My Memory" chat.

Mobile: bottom nav. Desktop: same layout, bas wider.

## 3. Voice capture

- MediaRecorder: start, stop, cancel, timer, recording indicator hamesha visible.
- Mic permission sirf tap pe. Denied/unsupported format pe clear error.
- Upload with size + MIME validation, double-submit prevention, retry button.
- Audio transcribe hone ke baad delete. Kuch store nahi.
- Incomplete recording silently save nahi hoga.

**Context resolution:** Agar user Atomic Habits → Chapter 2 khol ke mic dabaye, wahi context use ho. Agar speech me explicit source/chapter bole, wo override kare. Confident nahi to user se select karwao. Book, chapter, author ya quote kabhi invent nahi karna.

## 4. AI pipeline (ek LangGraph)

`Validate Audio → Transcribe → Resolve Context → Classify + Extract (structured JSON, Zod validated) → Confidence check → Save ya Ask Confirmation → Confirm`

Output schema: `entry_type, original_transcription, cleaned_content, title, source_id, chapter_id, quote_attribution, vocab {word, meaning, example}, confidence, requires_confirmation`. Non-applicable fields null.

Rules:
- Original transcription alag store ho, cleaned content alag.
- Cleaning se meaning change nahi honi chahiye.
- Quote exact wording me save ho, attribution invent nahi.
- User save se pehle ya baad me edit kar sake.
- Status: `processing → awaiting_confirmation → saved / failed`.

## 5. Ask My Memory

Plain async function (graph ki zarurat nahi): query → Postgres full-text search (user-filtered) → top N entries → Groq answer **sirf unhi entries se** → answer ke saath entry references. Kuch na mile to bolo "vault me nahi mila".

## 6. Database

```
profiles(id, display_name)
sources(id, user_id, title, source_type[book|podcast], creator, description, status, created_at)
chapters(id, source_id, user_id, title, chapter_number, created_at)
knowledge_entries(id, user_id, source_id?, chapter_id?, entry_type,
  title, original_transcription, cleaned_content, tags text[],
  metadata jsonb, is_favourite, fts tsvector, created_at, updated_at)
```

Har table pe RLS: `user_id = auth.uid()`. GIN index on `fts`. Cascade delete source → chapters → entries.

## 7. Security (minimum)

Server-side keys, authenticated API routes, input validation, audio size/MIME limits, RLS test (user A ko user B ka data na dikhe), error me secrets leak nahi.

## 8. Error handling (must-have)

Mic denied, recording interrupted, unsupported format, upload fail, Groq fail, invalid LLM JSON (retry once phir fail state), unknown source/chapter (ask user), duplicate submit. Ek failure se saved data nahi jaana chahiye.

## 9. Acceptance criteria

1. Register/login kaam kare.
2. Book + chapters ban sakein.
3. Chapter khol ke mic se record, stop, cancel ho.
4. Groq transcribe kare.
5. AI idea/word/quote/question/note sahi pehchane aur active book+chapter se attach kare.
6. Entry sahi collection me dikhe, edit ho sake.
7. Search aur Ask My Memory references ke saath chale.
8. Cross-user access impossible (RLS tested).
9. PWA Android Chrome aur iOS Safari pe install ho.

## 10. Build order

1. Setup + auth + schema/RLS
2. Library (books, chapters)
3. Capture pipeline end to end
4. Vault + search
5. Ask My Memory
6. PWA polish + mobile testing

## 11. Deferred to v1.1+

Embeddings + pgvector (Gemini ya OpenAI embeddings), Rediscover, knowledge connections, dashboard stats, Profile/Settings, audio storage + retention config, offline recording retry, Sentry, export, account delete, separate vocabulary table (synonyms/antonyms/pronunciation), tags table, other source types.

## Rules for the agent

README + `.env.example` rakho. Jo integration test nahi hua use "working" mat bolo. Final me mock data nahi. Overengineer mat karo.