# IntuiLab Implementation Plan

**Date:** 2026-08-10  
**Based on:** `SYSTEM_AUDIT.md`, `Docs/IntuiLab_System_Architecture_v1_0.md`, `Docs/MASTER_ROADMAP.md`  
**Goal:** Turn the current prototype into a **real, installable, testable MVP**, then grow into Phase 2 depth without re-architecting.

---

## 0. How to Use This Document

| Section | Purpose |
|---------|---------|
| **1. Guiding principles** | Decisions that prevent rework |
| **2. Target outcomes** | What “done” means for MVP vs Growth |
| **3. Phased plan** | Ordered work packages with tasks, owners-shaped work, acceptance criteria |
| **4. Technical standards** | Patterns the team must follow |
| **5. Content plan** | Lessons, assessments, timelines |
| **6. Testing & quality gates** | What must pass before merge/release |
| **7. Infra & deploy** | Local → staging → production |
| **8. Risks & mitigations** | Known failure modes from the audit |
| **9. Milestone calendar** | Suggested timeline |
| **10. Backlog traceability** | Map to architecture features F01–F21 |

**Working rule:** Do not mark a feature complete in `Docs/task_tracker.md` until its **acceptance criteria** in this plan pass.

---

## 1. Guiding Principles

1. **Runnable first.** A clean clone + documented commands must start API + web with seed data.
2. **Honest learning integrity.** Mastery, SRS, and Feynman scores must be **server-authoritative**. Never trust `is_correct` from the client.
3. **Auth before personalization.** Any user-specific feature (mastery, portfolio, streak, chat history) requires a real session/JWT path end-to-end.
4. **One product surface.** Next.js app is the only frontend. Archive Stitch/Vite residue; do not maintain parallel UIs.
5. **Modular monolith.** Domain logic stays in Django apps; split the god-file API; defer microservices.
6. **Scope Phase 1 tightly.** Offline-first, Swahili, and collaboration are valuable but **must not block** a teachable Physics+Chemistry MVP.
7. **Prompt guardrails + evals.** Socratic mode needs automated answer-leak tests, not prompt text alone.
8. **Environment-agnostic clients.** No hardcoded `localhost:8000` in product code.

---

## 2. Target Outcomes

### 2.1 Definition of MVP (Phase A–D complete)

A student can:

1. **Sign up / log in** on the web app.
2. Browse **Physics Mechanics** (and a thin Chemistry slice) from Learn + Knowledge Map.
3. Open a **lesson**, read sections, answer **server-graded** knowledge checks that update **BKT mastery**.
4. Chat with the **Socratic tutor** over WebSocket for that lesson (with API key configured).
5. Review **due flashcards** with SM-2 intervals that persist per user.
6. Run **projectile** and **titration** labs; optional AI lab comments.
7. Complete a **Feynman** explanation for a concept and see scores + mastery update.
8. Save notes to **Portfolio**.
9. See mastery reflected on **Map** and **Profile** (server-backed XP/streak basics).

Non-goals for MVP: collaboration rooms, AR/VR, full offline sync, multi-language UI, payments, school admin, Biology depth, Celery notification product.

### 2.2 Definition of Growth slice (Phase E–F)

- Content-driven labs & richer timelines  
- First Principles mode toggle  
- Curriculum tag filters (KCSE/CBC)  
- Hardened AI tool loop + answer-leak evals  
- Basic offline shell that actually caches lessons  
- Docker Compose + CI green on every PR  

---

## 3. Phased Implementation Plan

Effort is **engineer-days** for one full-stack developer familiar with Django + Next.js (adjust ×0.6–0.8 for a 2-person team).

```
Phase A  Foundation & DevEx          [~5–7 days]   ← START HERE
Phase B  Auth & API client           [~6–8 days]
Phase C  Learning loop integrity     [~8–10 days]
Phase D  AI reliability & labs       [~6–8 days]
Phase E  Product polish & content    [~10–14 days]
Phase F  Growth features             [~15–25 days]
Phase G  Scale & Phase 3 prep        [ongoing]
```

---

### Phase A — Foundation & Developer Experience

**Objective:** Anyone can install, migrate, seed, run, and build the monorepo. Fix compile blockers.

#### A1. Backend packaging

| Task | Details |
|------|---------|
| A1.1 | Create `apps/api/requirements.txt` (or `pyproject.toml`) with pinned versions: Django, daphne, channels, channels-redis, djangorestframework, djangorestframework-simplejwt, django-cors-headers, django-ninja, django-environ, django-extensions, django-reversion, Pillow, langchain-core, langchain-xai, langchain-google-genai, psycopg\[binary], redis, celery (optional until Phase F) |
| A1.2 | Add `apps/api/.env.example` documenting `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `XAI_API_KEY`, `GOOGLE_API_KEY`, `GEMINI_MODEL`, `XAI_MODEL`, `REDIS_URL` |
| A1.3 | Add `apps/api/README.md`: venv, install, migrate, seed, run Daphne |
| A1.4 | Fix `INSTALLED_APPS`: include `channels`; keep `daphne` first |
| A1.5 | Optional: `apps/api/package.json` with scripts `dev`/`test` so Turbo can orchestrate API |

**Acceptance:** `pip install -r requirements.txt && python manage.py check` succeeds on a clean machine.

#### A2. Frontend build unblock

| Task | Details |
|------|---------|
| A2.1 | Create `apps/web/lib/utils.ts` with standard `cn()` (`clsx` + `tailwind-merge`) |
| A2.2 | Add `test` script to `apps/web/package.json` (`vitest run`) |
| A2.3 | Fix `components.json` paths to match Next layout (`app/globals.css`, not missing `src/index.css`) |
| A2.4 | Remove dead imports / bottom-of-file imports (e.g. lesson `Sparkles`) |
| A2.5 | Unify on **one** motion library (`motion` **or** `framer-motion`) |

**Acceptance:** `npm install && npm run build -w web` succeeds; `npm run test -w web` runs.

#### A3. Environment-agnostic API access

| Task | Details |
|------|---------|
| A3.1 | Add `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`) and `NEXT_PUBLIC_WS_URL` (default `ws://localhost:8000`) |
| A3.2 | Create `apps/web/lib/api.ts`: `apiUrl(path)`, `fetchApi(path, init)` with JSON helpers |
| A3.3 | Create `apps/web/lib/ws.ts` for WebSocket base URL |
| A3.4 | Replace every hardcoded `http://localhost:8000` in hooks/pages with helpers |
| A3.5 | Optional Next rewrite: `/api/v1/*` → backend (simplifies cookies later) |

**Acceptance:** Changing env vars is enough to point web at another host; zero localhost literals in product TS/TSX (tests may mock).

#### A4. Repo hygiene

| Task | Details |
|------|---------|
| A4.1 | Move `_stitch_ui/`, `intui-lab-ui-system.zip`, Vite `index.html` / AI Studio `metadata.json` to `archive/` or delete with git history preserved |
| A4.2 | Either create `packages/` or remove empty workspace entry from root `package.json` |
| A4.3 | Pin `turbo` version (no `"latest"`) |
| A4.4 | Root README: monorepo overview + links to `apps/api/README.md` and web setup |
| A4.5 | Update `Docs/task_tracker.md` checkboxes to match `SYSTEM_AUDIT.md` reality |

**Acceptance:** New contributor README path is unambiguous; no second competing app in `apps/web`.

#### A5. Local orchestration

| Task | Details |
|------|---------|
| A5.1 | `docker-compose.yml`: `db` (Postgres 16), `redis`, later `api`/`web` |
| A5.2 | Document SQLite-only path for zero-Docker demos |
| A5.3 | Seed script wrapper: `scripts/seed_all.sh` runs physics + chemistry + math JSON |

**Acceptance:** One documented command sequence boots DB + API + web with content.

**Phase A exit gate:** Clean clone → install → migrate → seed → `check` → web build → open home page without console module errors.

---

### Phase B — Authentication & Identity

**Objective:** Real users; every personalized endpoint works from the SPA.

#### B1. Backend auth API

| Task | Details |
|------|---------|
| B1.1 | Add Ninja auth: JWT bearer (SimpleJWT) **or** cookie sessions — pick **one** primary for SPA |
| B1.2 | Endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` (if JWT), `GET /auth/me`, `POST /auth/logout` |
| B1.3 | Auto-create `UserProfile` on user creation (signal) |
| B1.4 | Wire Ninja `auth=` on assessment routers that require identity |
| B1.5 | CORS: stop `CORS_ALLOW_ALL_ORIGINS` in non-debug; set `CORS_ALLOWED_ORIGINS` + credentials if cookies |
| B1.6 | WebSocket auth: pass JWT query/header or session cookie; reject/limit anonymous persistence |

**Recommended default for MVP:** JWT in memory + `Authorization: Bearer` (simpler CORS); upgrade to httpOnly cookies later.

#### B2. Frontend auth UX

| Task | Details |
|------|---------|
| B2.1 | Routes: `/login`, `/register` (or modal) |
| B2.2 | `AuthProvider`: store access/refresh tokens securely (memory + refresh; avoid long-lived localStorage if possible) |
| B2.3 | `fetchApi` attaches bearer token; handles 401 → refresh → retry once |
| B2.4 | Protect personalized pages: portfolio write, flashcard review, mastery — prompt login |
| B2.5 | Sidebar footer shows real user avatar/initials from `/auth/me` |
| B2.6 | Replace hardcoded Profile “Alex Chen” with `/auth/me` + mastery aggregates |

#### B3. Guest policy (explicit)

| Task | Details |
|------|---------|
| B3.1 | **Read-only** content (lessons, map structure, concept text) allowed without auth |
| B3.2 | **No fake portfolio data** — empty state + “Sign in to save” |
| B3.3 | Guest flashcards: practice mode without SM-2 persistence, clearly labeled |
| B3.4 | Guest Socratic: ephemeral session (or require auth if cost control needed) |

**Phase B exit gate:** Register → login → create insight → reload → insight remains; mastery endpoint returns user data with bearer token.

---

### Phase C — Learning Loop Integrity

**Objective:** Lessons → checks → BKT → map/profile form a closed, trustworthy loop.

#### C1. Server-side grading

| Task | Details |
|------|---------|
| C1.1 | Change submit schema to: `{ assessment_id, selected_choice_id }` or `{ assessment_id, response }` |
| C1.2 | Server computes `is_correct` from `AssessmentChoice` |
| C1.3 | Return `{ is_correct, explanation, mastery: { p_known, mastery_percent } }` |
| C1.4 | Remove client ability to set mastery arbitrarily; optimistic UI only after response |
| C1.5 | Migrate/update frontend `KnowledgeCheck` + `useDiscovery.updateMastery` |

#### C2. Assessment content pipeline

| Task | Details |
|------|---------|
| C2.1 | Extend seed JSON schema: `assessments[]` per concept/lesson with choices |
| C2.2 | Update `seed_content` to create `AssessmentItem` + `AssessmentChoice` |
| C2.3 | Emit lesson `interactive` sections with `component_config: { assessment_id, options already from API }` **or** lesson API expands assessments |
| C2.4 | Prefer **API-expanded** quizzes: `GET /lessons/{id}` includes assessments with shuffled choices (no correct flag to client until after submit) |
| C2.5 | Seed ≥1 MCQ for every Physics concept (minimum bar) |

#### C3. Mastery & progress productization

| Task | Details |
|------|---------|
| C3.1 | Persist XP events server-side (`UserProfile.total_xp` increments on correct check / easy SRS / Feynman ≥70) |
| C3.2 | Streak: update on first successful learning action per calendar day (timezone UTC or profile TZ) |
| C3.3 | `GET /assessment/progress` → `{ xp, streak, mastery_by_subject, recent }` |
| C3.4 | Dashboard `/` loads real progress + optional mini-map from API (delete pure decorative dead nodes or keep as loading skeleton only) |
| C3.5 | Map: use server mastery; fix merge bug (don’t zero-out with empty client map) |
| C3.6 | Map navigation: use `subject` + `topic` + first lesson slug from node payload (extend map API) |

#### C4. Flashcards end-to-end

| Task | Details |
|------|---------|
| C4.1 | Seed real flashcards from concept summary/key facts (not only runtime auto-create) |
| C4.2 | Auth-required review endpoint remains; practice mode for guests |
| C4.3 | After review, return next_review_date; UI shows “Due today” count |
| C4.4 | Optional: exclude fully graduated cards from due queue correctly |

#### C5. API structure cleanup (start here, finish in C)

| Task | Details |
|------|---------|
| C5.1 | Split `config/api.py` → `apps/content/api.py`, `apps/assessment/api.py`, `apps/users/api.py`, `apps/ai/api.py` |
| C5.2 | Consistent errors: raise `HttpError(404/401/400)` — never `200 + {error}` |
| C5.3 | Pydantic response schemas for main endpoints (typed OpenAPI) |
| C5.4 | Drop unused DRF surface **or** document why it remains (prefer Ninja-only for MVP) |

**Phase C exit gate:** Authenticated student completes a lesson MCQ → mastery % increases on map → flashcard review persists → profile XP updates after reload.

---

### Phase D — AI Reliability & Virtual Labs

**Objective:** Socratic tutor and labs are stable, cost-aware, and pedagogically safer.

#### D1. Orchestrator hardening

| Task | Details |
|------|---------|
| D1.1 | Implement tool-call loop: bind_tools → if tool_calls, execute tools → re-invoke model → stream final text |
| D1.2 | Wrap all ORM access in async-safe helpers (`database_sync_to_async` or sync service layer) |
| D1.3 | Lab-specific prompts: `projectile-motion-lab` vs `chemistry-titration-lab` (and future lab ids) |
| D1.4 | Structured Feynman output: use JSON mode / parser with schema; fail closed with retry once |
| D1.5 | Config: model names via env; graceful message when no API key (don’t crash WS) |
| D1.6 | Rate limit per user/IP on WS connect + Feynman score endpoint |
| D1.7 | Answer-leak eval harness: suite of adversarial student prompts; assert no formula dump (CI optional nightly) |

#### D2. WebSocket product quality

| Task | Details |
|------|---------|
| D2.1 | Fix reconnect: cancel on unmount; exponential backoff; max retries |
| D2.2 | Show connection status in `SocraticSidebar` (connected / reconnecting / offline) |
| D2.3 | Authenticated session identity; optional guest ephemeral |
| D2.4 | Use Redis channel layer when `REDIS_URL` set; memory only for local single-process |
| D2.5 | Message size limits; basic abuse protection |

#### D3. Labs as content-backed experiences

| Task | Details |
|------|---------|
| D3.1 | Seed `VirtualLab` rows for projectile + titration linked to concepts |
| D3.2 | Lesson `lab` sections link to `/lab?lab=projectile` or embed component by `lab_type` |
| D3.3 | Extract shared lab event protocol (typed events) for AI monitor |
| D3.4 | Improve projectile viz (trail, metrics panel: range, max height, time of flight) |
| D3.5 | Titration: equivalence point markers; export “lab note” to portfolio API |

#### D4. Feynman UX completeness

| Task | Details |
|------|---------|
| D4.1 | `/feynman` index: list concepts from API with search |
| D4.2 | Fix `refreshMastery` — implement on `useDiscovery` or remove usage |
| D4.3 | Speech recognition feature-detect + fallback messaging (already partial) |
| D4.4 | Store Feynman attempts (new model optional) for history |

**Phase D exit gate:** With API key, lesson chat streams stably; tools return history/hints; lab events produce tutor responses; Feynman returns parseable scores ≥95% of test fixtures.

---

### Phase E — Product Polish & Content Depth (MVP ship)

**Objective:** Ship a coherent Physics + Chemistry MVP experience.

#### E1. Navigation & IA fixes

| Task | Details |
|------|---------|
| E1.1 | Lesson prev/next from API ordering |
| E1.2 | Breadcrumbs: Subject → Topic → Concept → Lesson |
| E1.3 | Empty/error states consistent (API down, 401, 404) |
| E1.4 | Collaborate route: either hide from sidebar until built, or show “Coming soon” |
| E1.5 | History index: list concepts with timelines; remove fake multi-scientist page or rebrand as “Inspiration” |

#### E2. Content production (MVP corpus)

| Task | Details |
|------|---------|
| E2.1 | Physics Mechanics: complete to **≥50 lessons** (roadmap) with rediscovery path quality bar |
| E2.2 | Chemistry: expand seeds to cover core high-school strand used in labs (acids/bases, stoichiometry intro) |
| E2.3 | Math: keep thin support set (vectors, algebra for physics) |
| E2.4 | For top 20 concepts: `history_text` + `HistoryTimeline` entries + ≥2 flashcards + ≥2 assessments |
| E2.5 | CurriculumTag on lessons (KCSE/CBC) even if filter UI is minimal |
| E2.6 | CMS training: document how authors use Django admin + reversion |

#### E3. Dashboard & profile

| Task | Details |
|------|---------|
| E3.1 | Dashboard: continue lesson CTA, due flashcards, streak, subject mastery bars from API |
| E3.2 | Profile edit: language, curriculum preference, bio/avatar upload |
| E3.3 | Settings: logout, theme already dark-default |

#### E4. Security baseline for private beta

| Task | Details |
|------|---------|
| E4.1 | Production settings module: `DEBUG=False`, secure cookies, HSTS when HTTPS |
| E4.2 | Secrets only via env; never commit `.env` |
| E4.3 | Basic throttling (Django Ninja/DRF throttle or middleware) |
| E4.4 | Dependency audit (`npm audit`, `pip-audit`) |

#### E5. Testing hardening for MVP

| Task | Details |
|------|---------|
| E5.1 | Backend: auth tests, grading tests, map API tests, seeder smoke test |
| E5.2 | Frontend: lesson knowledge check flow (mocked API), auth provider tests |
| E5.3 | One Playwright/Cypress smoke (optional but recommended): login → lesson → submit quiz |

**Phase E exit gate:** Private beta checklist §2.1 fully green; docs updated; demo script reproducible in &lt;15 minutes.

---

### Phase F — Growth Features (post-MVP)

Prioritize by learning impact × implementation cost.

#### F1. First Principles Mode (F08)

- Toggle on lesson/AI session: system prompt switches to jargon-strip rebuild mode  
- UI badge + different mentor framing  
- Same WS endpoint with `mode` parameter  

#### F2. Curriculum filters (F06)

- API query params `?curriculum=KCSE`  
- Learn browse filters  
- Seed tags on content  

#### F3. Offline shell v1 (F10) — scoped, honest

- Cache lesson JSON + static assets for **downloaded** lessons only  
- IndexedDB store for lesson payloads + pending SRS reviews  
- Background sync queue when online  
- **Do not** claim full offline AI  

#### F4. Multi-language v1 (F09)

- next-intl or similar for UI chrome  
- Content fields: optional `content_sw` later; start with UI strings EN/SW  
- Profile `language` drives UI  

#### F5. Why It Matters + Timelines (F13, F15)

- Seed `WhyItMattersStory` for flagship concepts  
- Lesson intro card plays narration script (text first; audio optional)  
- Richer `/history/[concept]` visualization  

#### F6. Adaptive sequencing (F04 depth)

- “Next recommended lesson” from lowest mastery prereq-satisfied concept  
- API: `GET /assessment/next-lesson`  
- Dashboard CTA uses it  

#### F7. Collaboration (F19) — only if product prioritizes

- Rooms model + Channels groups  
- Shared whiteboard: start with tldraw or excalidraw embed  
- AI moderator as optional silent participant  
- **Do not start until** MVP AI cost/auth are stable  

#### F8. Infra maturity

- Celery + Beat for SRS digests / streak reminders  
- Redis as cache for lesson payloads  
- Sentry + basic PostHog  
- pgvector migration path for concept embeddings (replace JSONField)  

---

### Phase G — Scale & Vision (long horizon)

- IntuiLab for Schools (teacher dashboard, classes)  
- Voice-first accessibility (F16)  
- AR/VR (F21)  
- Microservice extraction only at proven scale  
- Payments / premium gating (`is_premium`) for labs/AR  

---

## 4. Technical Standards

### 4.1 Backend conventions

```
apps/
  users/       models, api, signals, admin
  content/     models, api, admin, management/commands
  assessment/  models, services (BKT, SRS), api, admin
  ai/          models, services/orchestrator, consumers, routing, api
config/        settings split: base.py, local.py, production.py
```

- Business logic in **services**, not in Ninja handlers.  
- Handlers: validate → call service → map to schema.  
- Migrations required for every model change.  
- No unbounded `Concept.objects.all()` on hot paths without pagination later.

### 4.2 Frontend conventions

```
app/                 routes only
components/ui/       primitives
components/features/ domain UI
hooks/               client state
lib/api.ts           HTTP
lib/ws.ts            WebSocket
lib/auth.tsx         AuthProvider
lib/utils.ts         cn, formatters
```

- Prefer server components only where they help; most learning UI stays client due to WS/labs.  
- Introduce **TanStack Query** when caching mastery/lessons becomes painful (Phase E recommended).  
- Introduce **Zustand** only if lab state complexity demands it; current hooks are fine for MVP.

### 4.3 API contract rules

| Rule | Example |
|------|---------|
| Auth errors | `401` with `{ "detail": "..." }` |
| Not found | `404` |
| Validation | `422` |
| Success list | always arrays, never mixed fake objects |
| IDs | integer PKs in API; slugs for human URLs |

### 4.4 AI safety rules

1. System prompt enforces Rediscovery Mode.  
2. Output filter (optional Phase D): regex/LLM classifier for “final answer dump”.  
3. Log redacted transcripts for eval only with consent flag later.  
4. Cap tokens/response length per message.

---

## 5. Content Plan

### 5.1 Seed schema (target)

```json
{
  "subject": "physics",
  "topics": [
    {
      "title": "Kinematics",
      "level": "HS",
      "concepts": [
        {
          "title": "Projectile Motion",
          "summary": "...",
          "history_text": "...",
          "timeline": [
            { "year": "1638", "title": "...", "description": "..." }
          ],
          "prerequisites": ["motion-in-one-dimension"],
          "flashcards": [
            { "front": "...", "back": "..." }
          ],
          "assessments": [
            {
              "question": "...",
              "item_type": "mcq",
              "choices": [
                { "text": "...", "is_correct": true },
                { "text": "...", "is_correct": false }
              ],
              "explanation": "...",
              "p_slip": 0.1,
              "p_guess": 0.25
            }
          ],
          "lessons": [
            {
              "title": "...",
              "difficulty": 2,
              "sections": [
                { "type": "text", "content": "..." },
                { "type": "socratic_pause", "content": "..." },
                { "type": "interactive", "assessment_ref": 0 },
                { "type": "lab", "lab_type": "projectile", "content": "..." }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 5.2 Content quality bar (per flagship concept)

- [ ] Clear rediscovery question in first lesson section  
- [ ] ≥1 socratic_pause  
- [ ] ≥1 server-graded check  
- [ ] ≥2 flashcards  
- [ ] history_text non-empty  
- [ ] Map position + real prerequisites (not only file order)  

### 5.3 Authoring workflow

1. Domain expert drafts in JSON or Admin.  
2. `seed_content --file ...` or Admin publish.  
3. Reversion history for rollbacks.  
4. Future: AI-assisted draft **reviewed by human** before publish (never auto-ship to students).

---

## 6. Testing & Quality Gates

### 6.1 Required checks before merging to `main`

| Gate | Command / action |
|------|------------------|
| API unit tests | `python manage.py test` |
| Web unit tests | `npm run test -w web` |
| Web build | `npm run build -w web` |
| API check | `python manage.py check` |
| Lint | `npm run lint -w web` (and ruff/flake8 when added) |

### 6.2 Minimum backend test matrix

| Module | Cases |
|--------|-------|
| Auth | register, login, me, unauthorized assessment |
| Grading | correct/incorrect choice; mastery monotonicity |
| SRS | quality ≥3 vs &lt;3 intervals |
| Content | lesson by slug; map nodes non-empty after seed |
| Feynman | mocked LLM; mastery_updated true when authed |
| Insights | CRUD isolation per user |

### 6.3 Minimum frontend test matrix

| Area | Cases |
|------|-------|
| KnowledgeCheck | submits choice id; shows server explanation |
| Portfolio | create flow with mocked auth |
| Titration | pH landmarks (existing) |
| Feynman | score display (existing, keep green) |
| api client | attaches Authorization header |

### 6.4 Manual demo script (beta)

1. Register new user  
2. Open Knowledge Map → concept → lesson  
3. Answer check → mastery bar moves  
4. Ask Socratic tutor a direct-answer question → receives question back  
5. Lab launch → tutor comments  
6. Flashcard easy/hard → reload due set changes  
7. Feynman submit → score  
8. Portfolio note survives refresh  

---

## 7. Infrastructure & Deployment

### 7.1 Environments

| Env | Web | API | DB | Notes |
|-----|-----|-----|----|-------|
| Local | Next dev :3000 | Daphne :8000 | SQLite or Compose Postgres | Memory channels OK |
| Staging | Vercel preview | Railway/Fly/Render | Postgres + Redis | Real LLM keys (budget-capped) |
| Production | Vercel | ASGI + Redis channels | Postgres 16 | DEBUG off, Sentry |

### 7.2 Compose sketch (target)

```yaml
services:
  db:
    image: postgres:16
  redis:
    image: redis:7
  api:
    build: ./apps/api
    depends_on: [db, redis]
    env_file: ./apps/api/.env
  web:
    build: ./apps/web
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
```

### 7.3 CI (GitHub Actions) — Phase E

- Install Node + Python  
- Cache deps  
- Run tests + builds  
- Optional: seed SQLite and hit `/api/v1/hello`  

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM cost / abuse | Budget blowout | Auth, rate limits, token caps, guest limits |
| Answer leak in Socratic mode | Pedagogy failure | Evals + stricter prompts + optional classifier |
| Scope creep (collab, AR, offline) | MVP never ships | Enforce phase gates; hide incomplete nav |
| Content bottleneck | Empty product feel | Quality bar on top 20 concepts first |
| Dual frameworks / dead UI | Confusion | Phase A hygiene |
| Async ORM bugs | WS crashes | Phase D1.2; integration tests with Channels |
| Client-trusted grading left in place | Fake mastery | Phase C blocker for “adaptive” marketing |
| Over-claiming offline | User distrust | Honest UX copy until F3 ships |

---

## 9. Suggested Timeline

Assuming **1 full-stack engineer**, part-time content help:

| Week | Focus | Exit |
|------|-------|------|
| 1 | Phase A complete | Clone-to-run works; web builds |
| 2 | Phase B | Auth E2E |
| 3–4 | Phase C | Grading + seeds + map/progress |
| 5 | Phase D | Stable AI + lab links |
| 6–7 | Phase E | Content depth + beta hardening |
| 8 | Buffer + private beta | Demo script green |
| 9+ | Phase F backlog | Prioritize with user feedback |

**2 engineers** (1 FE / 1 BE): compress weeks 1–5 into ~3–4 weeks.

---

## 10. Work Package Checklist (copy into issues)

### Phase A
- [ ] A1 Backend requirements + .env.example + README  
- [ ] A2 `lib/utils.ts` + test script + build green  
- [ ] A3 API/WS env helpers; remove localhost hardcoding  
- [ ] A4 Archive stitch/vite residue; fix workspaces  
- [ ] A5 Docker Compose db/redis + seed_all script  
- [ ] Correct task_tracker honesty  

### Phase B
- [ ] B1 Auth API + Ninja JWT + profile signal  
- [ ] B2 Login/register + AuthProvider + token fetch  
- [ ] B3 Guest policy (no fake portfolio)  
- [ ] Profile uses real user data  

### Phase C
- [ ] C1 Server-side grading  
- [ ] C2 Assessment seeding + lesson integration  
- [ ] C3 XP/streak/progress API + dashboard  
- [ ] C4 Flashcards seeded + due UX  
- [ ] C5 Split api.py + proper HTTP errors  

### Phase D
- [ ] D1 Tool loop + async ORM + lab prompts + Feynman JSON  
- [ ] D2 WS reconnect/status/Redis  
- [ ] D3 Lab content links + metrics  
- [ ] D4 `/feynman` index + mastery refresh fix  

### Phase E
- [ ] E1 Nav/IA fixes; hide incomplete features  
- [ ] E2 Content corpus + quality bar  
- [ ] E3 Dashboard/profile polish  
- [ ] E4 Security baseline  
- [ ] E5 Test matrix + demo script  

### Phase F (prioritize later)
- [ ] F1 First Principles mode  
- [ ] F2 Curriculum filters  
- [ ] F3 Offline download v1  
- [ ] F4 UI i18n EN/SW  
- [ ] F5 Stories + rich timelines  
- [ ] F6 Next-lesson recommender  
- [ ] F7 Collaboration (optional)  
- [ ] F8 Celery/Sentry/pgvector  

---

## 11. Feature Traceability (Architecture F01–F21)

| ID | Feature | Target phase | Notes |
|----|---------|--------------|-------|
| F01 | Bite-sized lessons | C + E | Structure exists; navigation + checks in C/E |
| F02 | Socratic AI tutor | D | Exists; harden tools/WS |
| F03 | Flashcards SM-2 | C | Persist under auth |
| F04 | Adaptive BKT engine | C + F6 | Update now; sequencing later |
| F05 | Concept graph | C | Fix mastery + routing |
| F06 | Curriculum alignment | E2 + F2 | Tags then filters |
| F07 | Progress & streaks | C3 + E3 | Server-backed |
| F08 | First Principles mode | F1 | Post-MVP |
| F09 | Multi-language | F4 | Post-MVP |
| F10 | Offline mode | F3 | Scoped v1 only |
| F11 | Virtual labs | D3 + E | Two labs MVP; more later |
| F12 | Feynman challenger | D4 | Index + reliability |
| F13 | History timeline | E2 + F5 | Seed + UI |
| F14 | Discovery portfolio | B + C | Auth CRUD |
| F15 | Why It Matters | F5 | Post-MVP |
| F16 | Voice-first | G / partial D4 STT | Full product later |
| F17 | Concept weaver | G | Needs embeddings |
| F18 | Notebook/annotation | G | Portfolio is thin slice |
| F19 | Collaboration | F7 optional | Mock until then — hide nav |
| F20 | Problem workspace | G | Not started |
| F21 | AR/VR | G | Not started |

---

## 12. Immediate Next Actions (this week)

Do these in order — no feature work before A completes:

1. **A2.1** Create `apps/web/lib/utils.ts`  
2. **A1.1–A1.3** Python requirements + `.env.example` + API README  
3. **A3** Centralize API base URL; replace localhost  
4. **A4.5** Correct `Docs/task_tracker.md`  
5. **B1 + B2** Auth vertical slice  
6. **C1** Server-side grading (blocks honest adaptive claims)

---

## 13. Success Metrics (post-beta)

| Metric | MVP target |
|--------|------------|
| Time for new dev to first lesson | &lt; 30 minutes |
| Lesson → graded check → mastery update | 100% of seeded physics concepts |
| Socratic sessions without server error | ≥ 95% |
| Answer-leak eval fail rate | &lt; 10% on suite (iterate) |
| Auth conversion on portfolio CTA | measure only |
| Crash-free lab sessions | ≥ 99% client |

---

## 14. Document Ownership

| Document | Role after this plan |
|----------|----------------------|
| `SYSTEM_AUDIT.md` | Baseline diagnosis (historical) |
| `IMPLEMENTATION_PLAN.md` | **Execution source of truth** |
| `Docs/task_tracker.md` | Live checklist synced to Phase A–F items |
| `Docs/MASTER_ROADMAP.md` | Product vision; defer to this plan for sequencing |
| `Docs/IntuiLab_System_Architecture_v1_0.md` | Spec reference; update when stack decisions change |

---

*This plan deliberately sequences foundation → identity → learning integrity → AI → content polish. Skipping ahead to collaboration, AR, or full offline will recreate the current “wide but shallow” failure mode.*
