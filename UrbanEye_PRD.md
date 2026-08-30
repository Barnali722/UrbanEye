# Product Requirements Document
## AI-Powered Civic Complaint Intelligence

**Version:** 3.0
**Team size:** 3 members (all tech + design)
**Build approach:** Standard phased development (not time-boxed to a hackathon)

---

## 1. Problem

Civic authorities receive large volumes of complaints about potholes, garbage, broken streetlights, drainage problems, waterlogging, road damage, etc. These complaints are often duplicate, incomplete, misclassified, low-quality, difficult to prioritize, and scattered across locations. As a result, authorities spend more time sorting complaints than solving the most important problems first.

## 2. Solution

An AI-powered civic complaint intelligence platform that converts citizen reports into **verified, consolidated, and prioritized civic incidents**.

Instead of:
`Complaint → Authority`

We provide:
`Complaint → AI Verification → Classification → Duplicate Detection → Incident Intelligence → Priority → Recommended Action → Authority`

## 3. Target Users

| User | Needs |
|---|---|
| **Citizens** | Fast, low-friction way to report a civic issue with photo, description, and location |
| **Civic authorities / municipal officials** | A single, verified, prioritized, evidence-backed view of real incidents — not raw duplicate complaints |

## 4. Core Features

### 4.1 Citizen Complaint Submission
- Photo upload
- Text description
- GPS location capture

### 4.2 AI Complaint Understanding
- Analyzes text + image to determine:
  - **Issue type**: pothole, garbage, waterlogging, drainage, streetlight, road damage, other
  - **Severity**: low / medium / high / critical
  - **Evidence confidence**: e.g. 94%

### 4.3 Evidence Verification
- Checks whether submitted evidence appears relevant to the reported issue.
- Flags suspicious or mismatched submissions as **"⚠️ Verification Required — image may be manipulated or doesn't strongly match the reported issue."**
- Framing: this is a verification *signal* for authorities, not a certain fake-image detector — authorities make the final call.

### 4.4 Duplicate Complaint Detection
- The platform's strongest differentiator. Related reports are merged into a single incident using:
  - Geographic proximity
  - Issue category
  - Text similarity
  - Image similarity
- Example: 20 separate pothole reports → **Incident #104** (20 related reports, same location, pothole, high severity).

### 4.5 Intelligent Priority Score

| Factor | Weight |
|---|---|
| Severity | 40% |
| Number of reports | 25% |
| Safety impact | 20% |
| Evidence confidence | 15% |

Output example: **🔴 Priority: 91/100 — Critical — Immediate Attention Recommended**

### 4.6 Civic Incident Map
- Live map of incidents by location, issue type, severity, and priority.
- Color-coded: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
- Clicking an incident shows its complete evidence.

### 4.7 Incident Intelligence Record
```
Incident #104
Problem: Pothole
Location: College Road
Reports: 20
Severity: High
Priority: 91/100
Evidence: 15 images
Status: Unresolved
Recommended Action: Road inspection and repair
```

### 4.8 AI-Recommended Action
Suggested next step per issue type, which authorities can accept, modify, or reject:
- Pothole → Road inspection + surface repair
- Blocked drainage → Drainage inspection + blockage removal
- Garbage accumulation → Waste collection
- Broken streetlight → Electrical inspection + replacement

### 4.9 Authority Dashboard
- **Overview**: total complaints, active incidents, critical incidents, resolved incidents, duplicate reports merged
- **Map**: all civic incidents geographically visualized
- **Priority Queue**: ranked list (e.g. #1 Pothole 94 🔴, #2 Waterlogging 91 🔴, ...)
- **Evidence**: original citizen submissions per incident
- **Status pipeline**: Reported → AI Verified → Prioritized → Assigned → In Progress → Resolved

## 5. Core Differentiation

> Traditional system: 30 people → 30 complaints → 30 records
> Our system: 30 people → AI identifies one underlying incident → consolidated evidence → priority → action

This should be positioned as **Incident Intelligence**, not "another complaint-management app."

## 6. Out of Scope (v1)

- Real-time push notifications to authorities
- Native mobile app (responsive web first; native app is a future phase)
- Custom-trained computer vision / fake-image-detection models (verification is a heuristic + LLM-based signal, not certainty, for v1)
- Automated resolution workflows beyond status tracking
- Multi-city / multi-tenant authority support (single-city scope for v1)

## 7. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React (Vite) | Modern, component-based, fast dev experience |
| Backend/DB/Storage | Supabase or Firebase (or a custom Node/Express + PostgreSQL backend if the team prefers more control) | Managed auth, DB, and file storage; custom backend gives more flexibility for the AI pipeline as it grows |
| AI | Vision-capable LLM API for classification, verification signal, and recommended-action generation | Fast to integrate, avoids training custom models for v1 |
| Duplicate detection | Geo-radius + category matching, extended with text embedding similarity and image similarity (e.g. perceptual hashing or embedding-based comparison) | Combines cheap heuristics with more robust similarity matching as the dataset grows |
| Map | Leaflet or Google Maps | Visual centerpiece of the dashboard |
| Hosting | Vercel/Netlify (frontend) + managed DB hosting | Straightforward CI/CD, scales with usage |

## 8. Team & Work Division (3 Members — Tech + Design)

| Member | Ownership |
|---|---|
| **Member A — Citizen Frontend, Report Flow & Design System** | React app setup; complaint submission form (photo upload, description, GPS capture); citizen-facing UI/UX; overall design system (colors, typography, component library) shared across the app |
| **Member B — Backend, Data Model, AI Classification & Verification** | Database schema (complaints, incidents, users/authorities); AI classification pipeline (issue type, severity, evidence confidence); evidence-verification logic; duplicate-detection and incident-merging pipeline |
| **Member C — Priority Scoring, Recommended Actions & Authority Dashboard** | Priority-scoring function; AI-recommended-action generation; authority dashboard (overview stats, map, priority queue, incident records, evidence viewer, status pipeline) |

**Coordination note:** Member B should finalize the database schema early, since both A (citizen submissions) and C (dashboard) build directly against it. Regular integration checkpoints (e.g. after each phase below) keep the three pieces in sync rather than discovering mismatches late.

## 9. Development Phases

### Phase 1 — Foundation
- Finalize database schema (complaints, incidents, authority users)
- Set up project repo, environments, and shared design tokens/component library
- Build basic citizen submission form (photo, description, GPS) and save to DB
- Build a bare-bones dashboard shell (list view, no styling yet) so the team can see data flowing end-to-end early

### Phase 2 — AI Understanding & Verification
- Integrate AI classification call: issue type, severity, evidence confidence
- Build the evidence-verification signal and its "Verification Required" flag
- Store structured AI output against each complaint record
- Polish the citizen-facing submission UI

### Phase 3 — Duplicate Detection & Incident Intelligence
- Implement geo-radius + category-based clustering
- Add text similarity and image similarity matching to strengthen clustering
- Build the incident record aggregation (merged report count, combined evidence, single status)

### Phase 4 — Priority Scoring & Recommended Actions
- Implement the weighted priority formula (severity 40%, reports 25%, safety 20%, evidence confidence 15%)
- Build the AI-recommended-action generator per issue type
- Allow authorities to accept/modify/reject recommendations

### Phase 5 — Authority Dashboard
- Build the civic incident map with severity/priority color-coding
- Build the priority queue, overview stats, and evidence viewer
- Implement the status pipeline (Reported → AI Verified → Prioritized → Assigned → In Progress → Resolved)

### Phase 6 — Integration, Testing & Polish
- End-to-end testing across the full pipeline (submission → AI analysis → clustering → priority → dashboard)
- UI/UX polish and design consistency pass across all screens
- Load testing with realistic seed data (many complaints across multiple locations/categories)
- Bug fixing and refinement based on internal testing/demo feedback

## 10. Success Criteria

- Citizens can submit a complaint with photo, description, and location in under a minute
- AI classification and verification signal appear reliably on submitted complaints
- Duplicate/related complaints are correctly merged into a single incident in common test cases
- Priority scores correctly reflect the weighted formula and update as new reports come in
- Authority dashboard clearly surfaces the highest-priority incidents first, with usable evidence and map views
- The "Incident Intelligence" narrative (many reports → one actionable incident) is clearly demonstrable

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Duplicate-detection accuracy (false merges or missed merges) | Start with conservative thresholds (tight geo-radius + exact category match), then loosen gradually while testing against real submitted data |
| Evidence verification producing false positives/negatives | Frame it clearly in the UI as a signal for human review, not an automated rejection |
| AI classification costs/latency at scale | Cache repeated classification results where possible; consider batching or async processing for non-time-critical steps |
| Design inconsistency across screens built by different people | Shared design system/component library established early (Phase 1), used by both A and C |
| Schema changes needed mid-build as features are added | Keep schema changes centralized to Member B, communicated to the team before each phase begins |
