**IntuiLab**

*The Rediscovery Learning Platform*

**Full System Architecture, Design & Specification**

Version 1.0 \| April 2026 \| CONFIDENTIAL

Prepared for: Benaiah

+-----------------------------------+-----------------------------------+
| **Subjects**                      | **Scope**                         |
|                                   |                                   |
| Physics · Chemistry Biology ·     | High School → University 21 Core  |
| Mathematics                       | Features                          |
+-----------------------------------+-----------------------------------+

**Table of Contents**

**0. Executive Summary**

IntuiLab is a next-generation science and mathematics learning platform
built around one central philosophy: students should not receive
knowledge --- they should rediscover it. Every design decision, every AI
interaction, and every feature in this system exists to serve that
single goal.

The platform covers Chemistry, Physics, Biology, and Mathematics from
high-school through university level. It is built for depth --- not
breadth --- combining a Socratic AI tutor, virtual laboratory
simulators, spaced-repetition flashcards, adaptive lesson pathways, and
an interactive knowledge graph into a unified learning experience.

This document is the definitive blueprint. It synthesises the product
vision, all 21 agreed features, the 3-phase build roadmap, full
technical architecture, database schema, AI system design, content
pipeline, team structure, and cost model. It is written to be handed
directly to a CTO or senior development team.

  ---- -------------------------------------------------------------------
  🧭   *Core Philosophy: The AI never gives direct answers in Rediscovery
       Mode. It only asks questions, surfaces evidence, and guides the
       student to arrive at the answer themselves. This rule is
       non-negotiable and must be enforced at the prompt architecture
       level from Day 1.*

  ---- -------------------------------------------------------------------

  ------------------- ----------------------------- ---------------------
  **Dimension**       **Detail**                    **Priority**

  Product Name        IntuiLab (provisional)        Locked

  Subjects            Physics, Chemistry, Biology,  Locked
                      Mathematics                   

  Level Range         High School (KCSE/CBC) →      Locked
                      University                    

  Target Market (V1)  Kenyan students; scalable     Locked
                      globally                      

  Core Features       21 (see Section 3)            Locked

  Build Phases        3 (MVP → Growth → Vision)     Locked

  Tech Stack          Django 5 + Next.js 15 (App    Locked
                      Router)                       

  AI Engine           LangChain + xAI Grok API +    Locked
                      offline fallback              

  Monetisation        Freemium (Core free, Premium  Phase 1
                      unlocks labs/AR/portfolio)    
  ------------------- ----------------------------- ---------------------

**1. Product Vision & Teaching Philosophy**

**1.1 The Problem IntuiLab Solves**

Most educational platforms teach students what to know. They deliver
facts, definitions, and procedures --- optimised for test performance,
not deep understanding. Students can pass exams without any ability to
apply, extend, or question the knowledge they have been given.

The result is a generation of students who know the formula for kinetic
energy but have no intuition for why a moving object carries energy in
the first place. Who can balance chemical equations but cannot explain
why reactions happen at all. This is not education --- it is information
transfer.

**1.2 The IntuiLab Approach**

IntuiLab is built on four interlocking teaching principles:

1.  Historical Rediscovery --- Every concept begins with the problem
    that drove its discovery. Students learn what question the scientist
    was trying to answer before they learn the answer.

2.  Socratic Guidance --- The AI tutor never lectures. It asks. It
    challenges. It waits. The student must arrive at understanding
    through their own reasoning, with the AI as a guide, not a oracle.

3.  First Principles Reconstruction --- Students are repeatedly brought
    back to the foundational assumptions beneath a concept. Nothing is
    taken as given. Everything must be derived or justified.

4.  Cross-Subject Integration --- Science and mathematics are not
    separate subjects. IntuiLab constantly surfaces the connections:
    entropy in physics connects to Gibbs free energy in chemistry, to
    information theory in biology, to Shannon entropy in mathematics.

  ---- -------------------------------------------------------------------
  🧑‍🏫   *The Feynman Test: If a student cannot explain a concept clearly to
       a 12-year-old, they do not yet understand it. IntuiLab uses this as
       a formal, AI-scored assessment mode --- not a metaphor but an
       actual feature.*

  ---- -------------------------------------------------------------------

**2. System Architecture Overview**

**2.1 Architecture Layers (C4 Model)**

IntuiLab is structured as a layered monolith, architected for
microservice extraction at scale. The system has five primary layers:

  ------------------- ----------------------------- ---------------------
  **Layer**           **Components**                **Technology**

  Presentation        Web App, Mobile PWA, Offline  Next.js 15 + React
                      Shell                         19 + Tailwind

  API Gateway         REST API, WebSocket gateway,  Django 5 + DRF +
                      Auth                          Django Ninja

  Application         Learning engine, AI           Django services +
                      orchestrator, Lab runner, SRS Celery
                      scheduler                     

  Data                Primary DB, Cache, Object     PostgreSQL 16 +
                      storage, Search               Redis + S3 + pgvector

  AI                  Socratic tutor, Adaptive      LangChain + Grok
                      engine, Feynman scorer,       API + PyTorch
                      Concept weaver                

  Infrastructure      CDN, CI/CD, Monitoring,       Vercel + Railway +
                      Logging                       Sentry + PostHog
  ------------------- ----------------------------- ---------------------

**2.2 System Diagram (Textual C4)**

+-----------------------------------------------------------------------+
| **\[Browser / Mobile PWA / Offline Shell\]**                          |
|                                                                       |
| ↓ HTTPS + JWT + WebSocket                                             |
|                                                                       |
| **\[Next.js 15 Frontend\] ←→ \[Service Worker / IndexedDB             |
| (Offline)\]**                                                         |
|                                                                       |
| ↓ REST API / WebSocket                                                |
|                                                                       |
| **\[Django 5 API\] ←→ \[Django Channels (WebSocket)\] ←→ \[Celery     |
| Workers\]**                                                           |
|                                                                       |
| ↓ ↕ ↕                                                                 |
|                                                                       |
| **\[PostgreSQL 16 + pgvector\] ←→ \[Redis\] ←→ \[Celery Beat (SRS     |
| scheduler)\]**                                                        |
|                                                                       |
| ↓                                                                     |
|                                                                       |
| **\[AI Orchestrator: LangChain + Grok API + PyTorch Adaptive          |
| Model\]**                                                             |
|                                                                       |
| ↓                                                                     |
|                                                                       |
| **\[Media Layer: AWS S3 + CDN + Cloudinary + Three.js Lab Engine\]**  |
|                                                                       |
| External: Stripe/Flutterwave \| ElevenLabs \| Vercel \| Railway \|    |
| Sentry \| PostHog                                                     |
+-----------------------------------------------------------------------+

**2.3 Architecture Core Principles**

-   Modular Monolith First --- Start as one deployable Django service,
    designed with clean app boundaries (apps/learning, apps/ai,
    apps/labs, apps/users). Extract to microservices at 50k+ concurrent
    users.

-   Offline-First --- 90% of learning (lessons, flashcards, basic labs)
    works with zero internet. Service worker handles caching;
    WatermelonDB handles local data; background sync reconciles when
    online.

-   AI-Ethical by Design --- Rediscovery Mode is enforced at the system
    prompt level, not the UI level. The AI orchestrator has a hardcoded
    \"guide-only\" rule that cannot be overridden by the frontend.

-   Content as Versioned Data --- All lessons, flashcards, and lab
    configurations are JSON + media stored in PostgreSQL with
    django-reversion. Content updates never break user progress.

-   Privacy-First --- Student learning data stays on device by default.
    Server sync is opt-in and end-to-end encrypted. No data is sold or
    used for advertising. Compliant with Kenya Data Protection Act 2019
    and GDPR.

**3. Feature Registry --- All 21 Features**

The following table is the complete, authoritative list of features.
Every feature has a phase assignment. Phase 1 = MVP. Phase 2 = Growth.
Phase 3 = Vision.

  -------- ---------------------- ---------------------------------- ---------------
  **\#**   **Feature Name**       **Description**                    **Phase**

  01       Bite-Sized Lessons     Selectable lesson duration with    Phase 1
           (5--30 min)            embedded knowledge checks at       
                                  close.                             

  02       Socratic AI Tutor      Conversational AI that guides via  Phase 1
                                  questions. Never gives direct      
                                  answers in Rediscovery Mode.       

  03       Flashcard System (SRS  Spaced-repetition flashcards       Phase 1
           SM-2)                  scheduled by Anki-derived SM-2     
                                  algorithm.                         

  04       Adaptive Learning      Bayesian knowledge tracing adjusts Phase 1
           Engine                 difficulty, pacing and next-lesson 
                                  selection per student.             

  05       Concept Graph /        Interactive visual map of all      Phase 1
           Knowledge Map          topics and their cross-subject     
                                  connections.                       

  06       Curriculum Alignment   Maps content to KCSE, CBC, 8-4-4,  Phase 1
           Layer                  A-Level, IB, or university         
                                  syllabus.                          

  07       Progress Tracking &    Mastery heatmaps, streak counters, Phase 1
           Streaks                per-concept mastery scores         
                                  (0--100).                          

  08       First Principles Mode  Strips all jargon. Rebuilds        Phase 1
                                  concept from absolute first        
                                  principles. Feynman-style.         

  09       Multi-Language Support English + Swahili at launch.       Phase 1
                                  French and additional languages in 
                                  Phase 2.                           

  10       Offline Mode           Full lessons, flashcards, and      Phase 1
                                  basic labs downloadable for        
                                  offline use.                       

  11       Virtual Lab Simulator  Real-time interactive experiments  Phase 2
                                  (titration, projectile, DNA gel,   
                                  calculus graphing, etc.).          

  12       AI Feynman Challenger  Student explains concept to AI     Phase 2
                                  \"12-year-old\". AI scores         
                                  clarity, depth, intuition.         

  13       History-to-Intuition   Interactive timeline of discovery: Phase 2
           Timeline               failed experiments, eureka         
                                  moments, virtual replays.          

  14       Personal Discovery     Lifelong digital lab notebook:     Phase 2
           Portfolio              insights, voice notes, annotated   
                                  diagrams, derivations.             

  15       \"Why It Matters\"     AI-narrated micro-documentaries on Phase 2
           Stories                real-world impact. Triggered at    
                                  lesson start.                      

  16       Voice-First &          Full voice interaction, screen     Phase 2
           Accessibility          reader support, low-bandwidth      
                                  audio-only mode.                   

  17       Dynamic Concept Weaver AI generates personalised          Phase 2
                                  cross-subject \"knowledge webs\"   
                                  triggered by mastery events.       

  18       Notebook & Annotation  In-lesson note-taking, diagram     Phase 2
           System                 annotation, personal knowledge     
                                  base.                              

  19       Peer Collaboration     Small group (2--5) problem-solving Phase 2
           Rooms                  spaces. AI acts as silent          
                                  moderator, intervenes only when    
                                  stuck.                             

  20       Problem-Solving        Interactive scratchpad with        Phase 2
           Workspace              step-by-step AI feedback at each   
                                  step, not just final answer.       

  21       AR/VR \"See It in Real Phone AR: 3D molecules, magnetic   Phase 3
           Life\"                 fields, fractals in real space.    
                                  Scales 2D → AR → full VR.          
  -------- ---------------------- ---------------------------------- ---------------

**4. Technology Stack**

**4.1 Stack Decisions & Justifications**

  ------------- --------------------- ------------------------- --------------
  **Layer**     **Technology**        **Rationale**             **Alt
                                                                Considered**

  Frontend      Next.js 15 (App       SSR for lesson SEO, PWA   Remix, Nuxt
                Router) + React 19 +  for offline,              
                Tailwind CSS +        WebGL/WebXR-ready,        
                shadcn/ui + TanStack  best-in-class DX          
                Query                                           

  State Mgmt    Zustand (lab/AI       Lightweight, composable,  Jotai, Redux
                state) + TanStack     avoids Redux overhead     
                Query (server state)                            

  Backend API   Django 5 + Django     Python ecosystem for      FastAPI (less
                REST Framework +      scientific computing,     ecosystem)
                Django Ninja (fast    excellent ORM,            
                endpoints)            battle-tested auth        

  Real-Time     Django Channels +     Live AI chat,             SSE (less
                WebSockets + Redis    collaborative labs,       flexible)
                pub/sub               real-time Feynman scoring 

  Database      PostgreSQL 16 +       JSONB for lesson content, MySQL, MongoDB
                pgvector extension    pgvector for semantic     
                                      concept search, full-text 
                                      search                    

  Cache/Queue   Redis 7 (cache +      SRS scheduling, AI        RabbitMQ
                Celery broker +       response caching,         
                pub/sub)              WebSocket state           

  AI Engine     LangChain + xAI Grok  Grok for reasoning depth; LlamaIndex
                API (primary) +       Ollama + Llama-3.1-8B for 
                OpenAI fallback +     full offline mode         
                Ollama (offline)                                

  Simulations   Three.js +            Client-side for speed;    Unity WebGL
                Matter.js + p5.js     server-side Python for    
                (client) + SymPy +    accurate scientific       
                NumPy + SciPy + RDKit computation               
                (server)                                        

  Media         AWS S3 + CloudFront   Scalable, global,         GCS
                CDN + Cloudinary      image/video/3D model      
                (transforms) + FFmpeg pipeline                  
                (processing)                                    

  Offline Sync  Next.js PWA           WatermelonDB built for    PouchDB
                (Workbox) +           React Native parity       
                IndexedDB +           (future mobile app)       
                WatermelonDB                                    

  Auth          Django Allauth +      Social login +            Auth0 (cost)
                SimpleJWT + OAuth2    email/password + future   
                (Google, Apple)       SSO                       

  Payments      Flutterwave           M-Pesa integration via    Paystack
                (Africa-first) +      Flutterwave is critical   
                Stripe (global)       for Kenya                 

  Deploy        Vercel (Next.js) +    Zero-ops start, scalable  GCP,
                Railway/Render → AWS  path                      DigitalOcean
                ECS (scale)                                     

  Monitoring    Sentry (errors) +     Full observability stack  Datadog (cost)
                PostHog (analytics) +                           
                Prometheus + Grafana                            

  Voice/TTS     Web Speech API        High-quality narration    Google TTS
                (input) + ElevenLabs  for \"Why It Matters\"    
                (AI narration) +      stories                   
                OpenAI TTS (fallback)                           

  3D/AR         Three.js +            Progressive: 2D → WebAR → Unity, 8th
                model-viewer (AR) +   native AR/VR              Wall
                WebXR API → React                               
                Native AR (Phase 3)                             
  ------------- --------------------- ------------------------- --------------

**5. Database Schema**

**5.1 Schema Design Principles**

-   All content is versioned using django-reversion. Content updates
    never break existing user progress records.

-   Lesson content is stored as structured JSONB (not raw text) enabling
    programmatic querying of sections, media references, and interactive
    components.

-   pgvector extension enables semantic similarity search across
    concepts --- critical for the Dynamic Concept Weaver.

-   All user-specific data (progress, portfolio, notes) is scoped to
    user ID and encrypted at rest.

**5.2 Core Models**

**Identity & Profile**

  ------------------- ----------------------------- ---------------------
  **Model**           **Key Fields**                **Notes**

  User                id, email, display_name,      Extends Django
                      created_at, is_premium        AbstractUser

  UserProfile         user, avatar, bio,            One-to-one with User
                      curriculum_preference,        
                      language, streak_count,       
                      total_xp                      

  UserStreak          user, current_streak,         Updated by Celery
                      longest_streak,               daily task
                      last_activity_date            
  ------------------- ----------------------------- ---------------------

**Content Hierarchy**

  ------------------- --------------------------------------- ----------------------
  **Model**           **Key Fields**                          **Notes**

  Subject             id, name, slug, icon, color             Physics, Chemistry,
                                                              Biology, Mathematics

  Topic               id, subject, parent_topic (nullable),   Self-referential for
                      title, level (hs/university), order     subtopics

  Concept             id, topic, title, slug, summary,        Atomic unit. embedding
                      history_text, importance_text,          for pgvector search
                      rediscovery_path_json, embedding        
                      (vector)                                

  Lesson              id, concept, title, duration_minutes,   content_json: array of
                      content_json, difficulty (1-5),         LessonSection objects
                      curriculum_tags, version                

  LessonSection       id, lesson, order, type                 Polymorphic section
                      (text/video/diagram/interactive/lab),   types
                      content, media_url, component_config    

  VirtualLab          id, concept, lab_type, title,           lab_type: titration,
                      parameters_schema, simulation_mode      projectile, DNA,
                      (client/server), threejs_config,        graph, circuit, etc.
                      python_entry                            

  HistoryTimeline     id, concept, title, entries_json        entries_json: \[{year,
                                                              actor, event,
                                                              experiment_config}\]

  WhyItMattersStory   id, concept, title, narration_script,   AI-narrated
                      video_url, audio_url, duration_seconds  micro-documentary
  ------------------- --------------------------------------- ----------------------

**Assessment**

  ------------------- ----------------------------- ---------------------
  **Model**           **Key Fields**                **Notes**

  Quiz                id, lesson, questions_json,   Attached to every
                      passing_score                 lesson

  QuizQuestion        id, quiz, question_text, type AI can generate these
                      (mcq/short/diagram),          
                      options_json, correct_answer, 
                      explanation                   

  Flashcard           id, concept, front, back,     Content side
                      hint, tags                    

  UserFlashcardSRS    user, flashcard,              SM-2 algorithm state
                      interval_days, ease_factor,   per card per user
                      due_date, repetitions,        
                      last_reviewed                 

  FeynmanSession      id, user, concept,            ai_score_json:
                      student_explanation,          {clarity, depth,
                      ai_score_json, ai_feedback,   intuition, overall}
                      timestamp                     
  ------------------- ----------------------------- ---------------------

**User Progress & Portfolio**

  ------------------------ ------------------------------------- ---------------------
  **Model**                **Key Fields**                        **Notes**

  UserLessonProgress       user, lesson, completion_percent,     Updated in real-time
                           score, time_spent_seconds,            
                           completed_at, notes                   

  UserConceptMastery       user, concept, mastery_level (0-100), Aggregated from quiz
                           last_reviewed, review_count           scores + SRS +
                                                                 Feynman

  UserPortfolioEntry       user, entry_type                      Personal Discovery
                           (insight/derivation/voice/diagram),   Portfolio
                           content_text, media_url, concept      
                           (FK), tags, timestamp                 

  UserNotebookAnnotation   user, lesson_section,                 In-lesson annotations
                           annotation_text, position_data,       
                           created_at                            
  ------------------------ ------------------------------------- ---------------------

**Graph & AI**

  ---------------------- ----------------------------- ---------------------
  **Model**              **Key Fields**                **Notes**

  ConceptGraphEdge       from_concept, to_concept,     Powers Knowledge
                         relationship_type, strength   Map + Concept Weaver
                         (0-1), cross_subject,         
                         ai_generated                  

  AIConversation         id, user, concept, mode       Full conversation
                         (socratic/feynman/direct),    history for
                         messages_json, started_at,    continuity
                         ended_at                      

  CollaborationRoom      id, concept, participants     Peer Collaboration
                         (M2M User), ai_mode, status,  Rooms
                         created_at                    

  CollaborationMessage   room, sender (user or AI),    AI marks its own
                         content, timestamp,           interventions
                         ai_intervention (bool)        
  ---------------------- ----------------------------- ---------------------

**6. AI System Design**

**6.1 Architecture Overview**

The AI system is the most critical component in IntuiLab. It is not a
chatbot bolted onto a content platform --- it is the pedagogical engine
that the entire product is built around. Every AI interaction is
designed to serve one outcome: deeper student understanding through
active struggle, not passive consumption.

**6.2 The GrokOrchestrator (Central AI Service)**

Located at apps/ai/services/orchestrator.py, the GrokOrchestrator is a
LangChain agent that wraps the Grok API and exposes the following tools:

  ----------------------------- -----------------------------------------------
  **Tool Name**                 **What It Does**

  generate_socratic_question    Takes current concept + student\'s last message
                                → returns a question that advances reasoning
                                without revealing the answer

  score_feynman_explanation     Scores student\'s explanation on: Clarity
                                (0-10), Depth (0-10), Intuition (0-10). Returns
                                detailed feedback per dimension.

  run_virtual_lab_prompt        Watches student\'s lab parameter changes →
                                generates real-time Socratic questions about
                                what they observe

  build_dynamic_knowledge_web   Takes a concept the student just mastered →
                                returns a personalised cross-subject connection
                                map with suggested 15-min rediscovery paths

  assess_quiz_response          Evaluates short-answer quiz responses for
                                partial credit and conceptual correctness (not
                                just string matching)

  generate_hint                 Generates a graduated hint (3 levels: nudge →
                                clue → near-answer) without ever giving the
                                full solution

  get_next_lesson               Reads UserConceptMastery + learning history →
                                recommends the optimal next concept to study

  moderate_collaboration        Monitors peer collaboration room → intervenes
                                only when the group is stuck or fundamentally
                                wrong
  ----------------------------- -----------------------------------------------

**6.3 AI Modes**

  ------------------- ----------------------------- ----------------------
  **Mode**            **Behaviour**                 **When Active**

  Rediscovery Mode    AI only asks questions. Never All standard lessons,
  (default)           states answers. Uses Socratic labs, concept
                      method exclusively. Enforced  exploration
                      at system prompt level.       

  Direct Explanation  AI can explain concepts       Student explicitly
  Mode                directly. Student must opt-in requests \"just tell
                      consciously. Logged so the    me\"
                      adaptive engine can note it.  

  Feynman Challenger  AI plays the role of a        Student enters
  Mode                curious 12-year-old. Scores   /feynman/\[concept\]
                      explanations. Asks follow-up  
                      challenges. Reports mastery.  

  Lab Monitor Mode    AI watches parameter changes  Student is inside
                      in real-time. Generates       Virtual Lab
                      contextual Socratic questions 
                      about observations.           

  Collaboration       AI is silent. Listens to peer Student is in Peer
  Moderator Mode      conversation. Intervenes only Room
                      when group is stuck \>3 min   
                      or factually wrong.           

  First Principles    AI strips all jargon and      Student activates
  Mode                rebuilds concept from         First Principles
                      absolute scratch, one step at toggle
                      a time, always asking \"how   
                      do we know this?\"            
  ------------------- ----------------------------- ----------------------

**6.4 The Non-Negotiable AI Guardrail**

  ---- -------------------------------------------------------------------
  ⚠️   *System Prompt Architecture Rule: In Rediscovery Mode, the
       following instruction is prepended to every single AI call and
       cannot be overridden by any frontend signal or user request: \"You
       are a Socratic tutor. Your role is to guide the student to discover
       the answer themselves. You must NEVER state the answer directly.
       You may ask questions, suggest experiments, provide historical
       context, and give graduated hints --- but the final conceptual leap
       must always be made by the student. If the student asks you to just
       give the answer, respond with a question that helps them take one
       more step forward.\"*

  ---- -------------------------------------------------------------------

**6.5 Offline AI Fallback**

When the device has no internet connection, the AI layer falls back to a
quantized local model served via WebLLM in the browser:

-   Model: Llama-3.1-8B-Instruct (Q4 quantized, \~4GB download, cached
    after first load)

-   Capability: Socratic questioning and flashcard hints work well.
    Feynman scoring is simplified to keyword-based heuristics.

-   Limitation: Dynamic Concept Weaver and full adaptive engine require
    server-side computation. These features show \"sync required\" in
    offline mode.

**6.6 Adaptive Learning Engine**

The adaptive engine uses Bayesian Knowledge Tracing (BKT) --- the most
empirically validated model for tracking student knowledge state ---
combined with a lightweight PyTorch model for next-lesson
recommendation:

-   BKT tracks: P(mastery), P(learning), P(slip), P(guess) per concept
    per student

-   Updated after every quiz, flashcard review, and Feynman session

-   PyTorch model (trained on anonymised aggregate data): predicts which
    concept to teach next to maximise mastery gain per time invested

-   Served as a Django management command on first install; updated
    monthly via Celery task

**7. Virtual Lab Simulator --- Detailed Specification**

**7.1 Architecture**

Virtual labs are the most technically complex feature in IntuiLab. Each
lab has two components: a client-side rendering engine (Three.js / p5.js
/ D3) and a server-side scientific computation backend (Python: NumPy,
SciPy, SymPy, RDKit). Simple labs run entirely client-side for
performance. Complex simulations (e.g., molecular dynamics, wave
interference) offload computation to the Django backend via a WebSocket
stream.

**7.2 Lab Catalogue (Phase 2 Launch Set)**

  ------------------- ----------------------------- ---------------------
  **Subject**         **Lab Name**                  **Rendering Tech**

  Chemistry           Acid-Base Titration           p5.js + server SciPy
                                                    (pH curve)

  Chemistry           Molecular Orbital Builder     Three.js + RDKit
                                                    (server)

  Chemistry           Electrochemical Cell          p5.js + D3 (voltage
                                                    curves)

  Chemistry           Gas Law Explorer (PVT)        p5.js + SymPy

  Physics             Projectile Motion Simulator   p5.js (pure client)

  Physics             Wave Interference Patterns    Three.js + NumPy
                                                    (server)

  Physics             Electric Field Mapper         D3 + client-side
                                                    vectors

  Physics             Pendulum & SHM                p5.js (pure client)

  Physics             Photoelectric Effect          p5.js + photon
                                                    simulation

  Biology             DNA Gel Electrophoresis       p5.js + server
                                                    simulation

  Biology             Enzyme Kinetics               D3 + SciPy (server)
                      (Michaelis-Menten)            

  Biology             Mendelian Genetics Simulator  p5.js (pure client)

  Biology             Neuron Action Potential       p5.js +
                                                    Hodgkin-Huxley model

  Mathematics         Calculus Graph Explorer       D3 + SymPy (symbolic)
                      (derivatives/integrals)       

  Mathematics         Linear Algebra Visualiser     Three.js (pure
                      (vectors, matrices,           client)
                      transformations)              

  Mathematics         Differential Equations        D3 + SciPy (phase
                      Plotter                       portraits)

  Mathematics         Probability & Statistics      D3 + NumPy
                      Sandbox                       
  ------------------- ----------------------------- ---------------------

**7.3 Real-Time AI Integration in Labs**

While a student is inside a lab, the Lab Monitor AI Mode is active. The
AI watches every parameter change via WebSocket and generates contextual
Socratic questions. Example interaction:

+-----------------------------------------------------------------------+
| **Student Action:**                                                   |
|                                                                       |
| *Increases temperature from 25°C to 80°C in Acid-Base Titration lab.  |
| pH curve shifts.*                                                     |
|                                                                       |
| **AI Response (Lab Monitor Mode):**                                   |
|                                                                       |
| \"Interesting --- you can see the equivalence point has shifted. Why  |
| do you think temperature affects where the neutralisation happens?    |
| What does that tell you about the relationship between temperature    |
| and equilibrium?\"                                                    |
|                                                                       |
| **What the AI does NOT say:**                                         |
|                                                                       |
| \"Temperature affects Ka (acid dissociation constant), which shifts   |
| the equilibrium position per Le Chatelier\'s Principle.\" --- This is |
| the answer. The AI never says it.                                     |
+-----------------------------------------------------------------------+

**8. Content Pipeline**

**8.1 Content Creation Workflow**

IntuiLab content is co-created by human domain experts and AI, then
reviewed and published through a Django admin CMS. Every lesson follows
a strict schema ensuring pedagogical consistency.

5.  Expert authors write the core concept explanation in Markdown with
    topic metadata.

6.  The AI Content Generator (Grok) auto-generates: historical context
    narrative, rediscovery path questions, Feynman Challenger script,
    virtual lab parameter suggestions, quiz questions (MCQ + short
    answer), \"Why It Matters\" narration script, and cross-subject
    connection tags.

7.  Media generation: diagrams from AI image generation (Flux/DALL·E),
    3D models exported from Blender as glTF, videos embedded from
    licensed sources (PhET, 3Blue1Brown) or ElevenLabs-narrated
    originals.

8.  Editorial review by subject-matter expert. Curriculum alignment tags
    added (KCSE, CBC, A-Level, IB).

9.  Publish to production via Django admin. Content is versioned.
    Previous versions are preserved.

**8.2 Lesson JSON Schema**

+-----------------------------------------------------------------------+
| { \"lesson_id\": \"phys-hs-001\", \"concept\":                        |
| \"newtons-second-law\",                                               |
|                                                                       |
| \"duration_minutes\": 15, \"difficulty\": 2,                          |
|                                                                       |
| \"curriculum_tags\": \[\"KCSE-Form2\", \"A-Level-Mechanics\"\],       |
|                                                                       |
| \"sections\": \[                                                      |
|                                                                       |
| { \"type\": \"why_it_matters_hook\", \"video_url\": \"\...\",         |
| \"duration_s\": 90 },                                                 |
|                                                                       |
| { \"type\": \"history\", \"text\": \"In 1687, Newton was trying to    |
| explain\...\", \"timeline_id\": \"newton-1687\" },                    |
|                                                                       |
| { \"type\": \"rediscovery_challenge\", \"prompt\": \"Before I tell    |
| you anything, try this: \...\", \"lab_id\": \"projectile-lab\" },     |
|                                                                       |
| { \"type\": \"text\", \"content\": \"\...\", \"diagrams\":            |
| \[\"force-diagram-001\"\] },                                          |
|                                                                       |
| { \"type\": \"interactive\", \"component\":                           |
| \"ForceMassAccelSimulator\", \"config\": {\...} },                    |
|                                                                       |
| { \"type\": \"socratic_pause\", \"ai_question\": \"What would happen  |
| if mass doubled?\" }                                                  |
|                                                                       |
| \],                                                                   |
|                                                                       |
| \"quiz\": { \"questions\": \[\...\], \"passing_score\": 70 },         |
|                                                                       |
| \"flashcards\": \[{ \"front\": \"\...\", \"back\": \"\...\",          |
| \"hint\": \"\...\" }\]                                                |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**8.3 Content Coverage Plan**

Phase 1 launches with Physics (High School complete) and Chemistry (High
School complete). All other subjects and university-level content roll
out across Phase 2 per the following schedule:

  ------------------- ----------------------------- ---------------------
  **Phase**           **Content Scope**             **Approximate Lesson
                                                    Count**

  Phase 1 MVP         Physics HS + Chemistry HS     \~200 lessons,
                                                    \~2,000 flashcards, 8
                                                    labs

  Phase 2 Growth      \+ Biology HS + Mathematics   \~600 lessons,
                      HS + Physics University +     \~6,000 flashcards,
                      Chemistry University          24 labs

  Phase 3 Vision      \+ Biology University +       \~1,200 lessons,
                      Mathematics University + All  \~12,000 flashcards,
                      cross-subject modules         48 labs
  ------------------- ----------------------------- ---------------------

**9. Frontend Architecture**

**9.1 App Router Structure**

  ----------------------------------------- -------------------------------------------
  **Route**                                 **Page / Component**

  /                                         Home: Knowledge Map + Daily Streak + Next
                                            Recommended Lesson

  /learn/\[subject\]                        Subject Overview: Topic tree, mastery
                                            heatmap, curriculum filter

  /learn/\[subject\]/\[topic\]/\[lesson\]   Lesson Player: Video + Text + Interactive +
                                            AI chat sidebar + progress bar

  /lab/\[lab_id\]                           Full-screen Virtual Lab: Simulation
                                            canvas + AI monitor panel + parameter
                                            controls

  /feynman/\[concept_id\]                   Feynman Challenger: Text input or voice +
                                            real-time AI scoring panel

  /flashcards                               SRS Flashcard session: Due cards + flip
                                            animation + SM-2 rating buttons

  /map                                      Interactive Concept Graph: D3/React Flow +
                                            filter by subject + zoom/pan

  /portfolio                                Personal Discovery Portfolio: Timeline of
                                            entries, voice playback, diagram viewer

  /history/\[concept_id\]                   History Timeline Explorer: Scrollable
                                            interactive timeline + virtual experiment
                                            replay

  /collaborate/\[room_id\]                  Peer Collaboration Room: Chat + shared
                                            whiteboard + AI moderation status

  /notebook                                 Personal Notebook: All annotations +
                                            highlights across all lessons

  /profile                                  Profile: Mastery dashboard, streak
                                            calendar, curriculum settings, language

  /settings                                 Settings: Offline downloads, notifications,
                                            accessibility, data privacy
  ----------------------------------------- -------------------------------------------

**9.2 Key UI Components**

-   LessonPlayer --- Renders lesson sections sequentially. Handles
    video, text, diagrams, interactive components, and Socratic pause
    points. AI chat sidebar is always present but collapses on mobile.

-   LabCanvas --- Full-screen WebGL/Canvas simulation surface. Wraps
    Three.js / p5.js instances. Receives real-time computation results
    via WebSocket. AI monitor panel overlays on right.

-   ConceptGraph --- React Flow graph with D3 force layout. Nodes are
    Concept objects. Edges are ConceptGraphEdge records. Color-coded by
    subject. Clickable → navigates to lesson.

-   FlashcardDeck --- SM-2 session manager. Shows front/back flip
    animation. Records user rating (Again/Hard/Good/Easy) → sends to
    Django SRS endpoint → updates due dates.

-   SocraticChat --- WebSocket-connected chat component. Enforces visual
    indicator when AI is in Rediscovery Mode (\"Guide Mode active\").
    Cannot be switched off by the user mid-lesson.

**10. Non-Functional Requirements**

  ---------------------- ----------------------------- ---------------------
  **Requirement**        **Target**                    **How Achieved**

  Lesson Load Time       \< 1 second                   CDN + edge caching +
                                                       Next.js SSG for
                                                       static lesson shells

  Lab Frame Rate         60 fps on mid-range phone     Client-side
                                                       Three.js/p5.js;
                                                       server offload only
                                                       for heavy compute

  Offline Coverage       90% of features               Service worker
                                                       (Workbox) +
                                                       WatermelonDB +
                                                       IndexedDB

  API Response Time      \< 200ms (P95)                Redis caching +
                                                       Django Ninja fast
                                                       endpoints + pgvector
                                                       indexed

  AI Response Latency    \< 2 seconds                  Streaming responses
                                                       via WebSocket +
                                                       response caching for
                                                       common questions

  Scalability            10k → 1M users                Railway (MVP) → AWS
                                                       ECS + RDS +
                                                       ElastiCache (scale)

  Uptime                 99.9% SLA                     Multi-region Vercel +
                                                       Railway redundancy +
                                                       health checks

  Security               OWASP Top 10 covered          JWT + rate limiting +
                                                       CSRF + content
                                                       moderation + pen test
                                                       at launch

  Privacy                Kenya DPA 2019 + GDPR         Data stays on device
                                                       by default. Server
                                                       sync opt-in + E2E
                                                       encrypted.

  Accessibility          WCAG 2.1 AA                   ARIA labels + screen
                                                       reader support +
                                                       voice commands +
                                                       high-contrast mode

  Internationalisation   EN + SW at launch             Django i18n +
                                                       i18next + RTL-ready
                                                       layout

  Low-Bandwidth Mode     Functional at 2G              Audio-only mode +
                                                       compressed assets +
                                                       lazy-load images
  ---------------------- ----------------------------- ---------------------

**11. Three-Phase Build Roadmap**

  ---- -------------------------------------------------------------------
  ⚠️   *Critical Principle: This is not a 12-week \"build everything\"
       sprint. It is a disciplined phased roadmap. Phase 1 must be
       extraordinary at 8 core features before Phase 2 begins. Better to
       do fewer things with genuine depth than to ship 21 shallow
       features.*

  ---- -------------------------------------------------------------------

**Phase 1 --- MVP (Months 0--6)**

Goal: Build an app that is already extraordinary at its core --- one
subject, done to an exceptional standard, with the AI tutor and lesson
system fully operational. Beta launch with Kenyan high school students
at end of Phase 1.

  ------------------- ----------------------------- ------------------------------
  **Month**           **Sprint Goals**              **Deliverables**

  Month 1             Project foundation            Turborepo monorepo, Django
                                                    project structure, Next.js App
                                                    Router setup, PostgreSQL +
                                                    Redis, Auth (JWT + Google
                                                    OAuth), Django admin CMS
                                                    skeleton

  Month 2             Content engine                Subject/Topic/Concept/Lesson
                                                    models, Lesson Player UI,
                                                    first 50 Physics HS lessons,
                                                    Quiz system, Flashcard CRUD

  Month 3             AI Tutor (core)               GrokOrchestrator service,
                                                    Socratic AI chat (WebSocket),
                                                    Rediscovery Mode guardrail,
                                                    system prompt architecture,
                                                    first Feynman Challenger
                                                    prototype

  Month 4             Adaptive engine + SRS         BKT implementation, SM-2
                                                    flashcard scheduler, Celery
                                                    SRS task, UserConceptMastery
                                                    tracking, Concept Graph
                                                    (basic)

  Month 5             Curriculum + Offline          KCSE/CBC curriculum tag layer,
                                                    PWA (Workbox), offline lesson
                                                    download, WatermelonDB sync,
                                                    multi-language (Swahili),
                                                    First Principles Mode

  Month 6             Polish + Beta launch          Full Physics HS + Chemistry HS
                                                    content, streak system,
                                                    Progress dashboard,
                                                    accessibility pass,
                                                    performance optimisation, beta
                                                    launch to 200 Kenyan students
  ------------------- ----------------------------- ------------------------------

**Phase 2 --- Growth (Months 7--18)**

Goal: Expand to all 4 subjects at HS level and begin university content.
Ship the high-impact advanced features. Grow to 10,000+ active users.

-   Virtual Lab Simulator --- Launch 16 labs across all 4 subjects with
    real-time AI Lab Monitor Mode

-   AI Feynman Challenger --- Full scoring system (clarity, depth,
    intuition), voice input option

-   History-to-Intuition Timeline Explorer --- Interactive timeline for
    every major concept

-   Personal Discovery Portfolio --- Voice recording, diagram
    annotation, long-term storage

-   \"Why It Matters to Humanity\" Stories --- 50+ AI-narrated
    micro-documentaries

-   Voice-First & Accessibility --- Web Speech API input, ElevenLabs
    narration, audio-only mode

-   Dynamic Concept Weaver --- Cross-subject knowledge web generation on
    mastery events

-   Notebook & Annotation System --- In-lesson highlights, margin notes,
    personal knowledge base

-   Peer Collaboration Rooms --- Real-time group problem solving with AI
    moderation

-   Problem-Solving Workspace --- Step-by-step scratchpad with graduated
    AI hints

-   Biology HS + Mathematics HS + Physics University + Chemistry
    University content

**Phase 3 --- Vision (Months 19+)**

Goal: Build the features that make IntuiLab genuinely unprecedented.
AR/VR, full university coverage, global expansion.

-   AR/VR Module --- WebAR via model-viewer + WebXR. Native AR via React
    Native (mobile app). Full VR exploration environment.

-   Biology University + Mathematics University full content library

-   Global curriculum expansion (IB, A-Level, South African NSC,
    Nigerian WAEC, US AP)

-   Multi-language expansion (French, Arabic, Portuguese for African
    markets)

-   Sign language video overlay for hearing-impaired students

-   IntuiLab for Schools --- Teacher dashboard, class management,
    assignment builder, progress reports

-   Peer-generated content moderation --- Advanced students can
    contribute labs and flashcards

**12. Recommended Team Structure**

**12.1 Phase 1 Team (Minimum Viable Team)**

  ----------------------- -----------------------------------------------
  **Role**                **Responsibilities**

  Full-Stack Lead (1)     Django + Next.js architecture, database design,
                          API, DevOps. Should have prior Python/React
                          experience. This is the most critical hire.

  Frontend Engineer (1)   Next.js UI, lesson player, flashcard UI,
                          concept graph, PWA/offline. Strong React +
                          WebGL experience preferred.

  AI/ML Engineer (1)      LangChain orchestrator, GrokOrchestrator
                          service, BKT adaptive engine, prompt
                          engineering, Feynman scorer.

  Content Lead (1)        Domain expert (Physics + Chemistry). Writes
                          lesson content, reviews AI-generated content,
                          designs rediscovery paths. Pedagogical
                          authority.

  Product/Design (1)      UX/UI design, user research, curriculum
                          alignment, beta programme management. Should
                          understand Kenyan educational context deeply.
  ----------------------- -----------------------------------------------

**12.2 Phase 2 Team Additions**

-   Backend Engineer (1) --- Handles scaling, Virtual Lab server-side
    computation, WebSocket infrastructure

-   Simulation Engineer (1) --- Three.js + p5.js specialist for Virtual
    Lab frontend. Scientific computing background strongly preferred.

-   Content Editors (2--3) --- Biology and Mathematics domain experts.
    Co-create content with AI pipeline.

-   Mobile Engineer (1) --- React Native for mobile app (Phase 2 end /
    Phase 3 start)

**13. Infrastructure Cost Model**

**13.1 Phase 1 Monthly Costs (\< 1,000 users)**

  ----------------------- -----------------------------------------------
  **Service**             **Estimated Monthly Cost (USD)**

  Vercel (Next.js         \$0--20 (Hobby/Pro plan)
  hosting)                

  Railway (Django +       \$5--25
  PostgreSQL + Redis)     

  AWS S3 + CloudFront     \$10--30
  (media CDN)             

  Grok API (xAI) --- AI   \$50--150 (depends on usage)
  calls                   

  ElevenLabs TTS          \$22 (Creator plan, one-time content
  (narration generation)  generation)

  Sentry (error           \$0 (free tier)
  monitoring)             

  PostHog (analytics)     \$0 (free tier, \< 1M events)

  Total Phase 1           \$87--247 / month
  ----------------------- -----------------------------------------------

**13.2 Phase 2 Monthly Costs (10,000 users)**

  ----------------------- -----------------------------------------------
  **Service**             **Estimated Monthly Cost (USD)**

  Vercel Pro              \$20

  Railway / AWS ECS       \$200--400

  AWS S3 + CloudFront     \$50--100

  Grok API (scaled)       \$400--800

  Cloudinary (media       \$89
  transforms)             

  Redis (ElastiCache)     \$50--100

  Sentry Team             \$26

  PostHog Scale           \$0--450 (usage-based)

  Total Phase 2           \$835--1,985 / month
  ----------------------- -----------------------------------------------

  ---- -------------------------------------------------------------------
  📈   *At 10,000 users with a freemium model (even 5% conversion at
       \$10/month premium), revenue would be \$5,000/month --- well above
       Phase 2 infrastructure cost. The unit economics are strong.*

  ---- -------------------------------------------------------------------

**14. Repository & Project Structure**

+-----------------------------------------------------------------------+
| intuilab/ ← Turborepo monorepo root                                   |
|                                                                       |
| ├── apps/                                                             |
|                                                                       |
| │ ├── web/ ← Next.js 15 frontend                                      |
|                                                                       |
| │ │ ├── app/ ← App Router pages                                       |
|                                                                       |
| │ │ ├── components/ ← UI components                                   |
|                                                                       |
| │ │ │ ├── lesson/ ← LessonPlayer, LessonSection                       |
|                                                                       |
| │ │ │ ├── lab/ ← LabCanvas, LabControls                               |
|                                                                       |
| │ │ │ ├── ai/ ← SocraticChat, FeynmanChallenger                       |
|                                                                       |
| │ │ │ ├── flashcard/ ← FlashcardDeck, SRSRatingBar                    |
|                                                                       |
| │ │ │ └── graph/ ← ConceptGraph, KnowledgeMap                         |
|                                                                       |
| │ │ ├── lib/ ← API clients, hooks, utils                              |
|                                                                       |
| │ │ └── public/ ← Static assets                                       |
|                                                                       |
| │ └── api/ ← Django 5 backend                                         |
|                                                                       |
| │ ├── apps/                                                           |
|                                                                       |
| │ │ ├── users/ ← User, Profile, Streak                                |
|                                                                       |
| │ │ ├── content/ ← Subject, Topic, Concept, Lesson                    |
|                                                                       |
| │ │ ├── assessment/ ← Quiz, Flashcard, UserSRS                        |
|                                                                       |
| │ │ ├── ai/ ← GrokOrchestrator, BKT engine                            |
|                                                                       |
| │ │ ├── labs/ ← VirtualLab, LabSession                                |
|                                                                       |
| │ │ ├── portfolio/ ← PortfolioEntry, Notebook                         |
|                                                                       |
| │ │ └── collaborate/ ← CollaborationRoom, Message                     |
|                                                                       |
| │ ├── config/ ← settings, urls, wsgi, asgi                            |
|                                                                       |
| │ └── manage.py                                                       |
|                                                                       |
| ├── packages/                                                         |
|                                                                       |
| │ ├── ui/ ← Shared design system (shadcn/ui base)                     |
|                                                                       |
| │ ├── types/ ← Shared TypeScript types                                |
|                                                                       |
| │ └── science-utils/ ← Shared scientific computation helpers          |
|                                                                       |
| ├── content/ ← Lesson JSON + media source files                       |
|                                                                       |
| │ ├── physics/hs/                                                     |
|                                                                       |
| │ ├── chemistry/hs/                                                   |
|                                                                       |
| │ └── \...                                                            |
|                                                                       |
| ├── scripts/ ← Content pipeline, seeding, deployment                  |
|                                                                       |
| ├── turbo.json                                                        |
|                                                                       |
| └── package.json                                                      |
+-----------------------------------------------------------------------+

**15. Immediate Next Steps**

The blueprint is complete. The following are the ordered next actions to
begin building:

  ------------------- ----------------------------- ---------------------
  **Priority**        **Action**                    **Owner**

  1 --- Immediate     Initialise Turborepo monorepo Full-Stack Lead
                      with Django + Next.js apps    

  2 --- Week 1        Set up PostgreSQL + Redis +   Full-Stack Lead
                      Django admin + JWT auth       

  3 --- Week 1        Write and migrate all Phase 1 Full-Stack Lead + AI
                      Django models (Section 5)     Eng

  4 --- Week 2        Implement GrokOrchestrator    AI Engineer
                      with Socratic guardrail       
                      system prompt                 

  5 --- Week 2        Build Lesson JSON schema and  Content Lead +
                      CMS in Django admin           Full-Stack

  6 --- Week 2        Design system in Next.js      Designer + Frontend
                      (typography, colors,          Eng
                      component library)            

  7 --- Week 3        Write first 20 Physics HS     Content Lead
                      lessons in content pipeline   

  8 --- Week 3        Build LessonPlayer component  Frontend Engineer
                      with AI chat sidebar          

  9 --- Week 4        Implement SM-2 SRS            AI Eng + Frontend Eng
                      scheduler + FlashcardDeck     
                      component                     

  10 --- Week 5       KCSE curriculum tag layer +   AI Engineer
                      first BKT implementation      
  ------------------- ----------------------------- ---------------------

  ---- -------------------------------------------------------------------
  🚀   *This document is the definitive system architecture and
       specification for IntuiLab v1.0. Every architectural decision,
       feature, and technology choice recorded here has been reasoned
       through with depth. It is ready to be handed to a development team
       as the authoritative source of truth. The vision is clear, the plan
       is disciplined, and the technology is proven. Time to build.*

  ---- -------------------------------------------------------------------

***--- End of Document ---***

IntuiLab v1.0 Blueprint \| April 2026 \| CONFIDENTIAL
