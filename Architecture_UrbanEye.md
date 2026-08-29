# System Architecture
## AI-Powered Civic Complaint Intelligence

## Overview

Four layers, each with a clear responsibility. Citizens and authorities interact only through the client layer; everything else is coordinated through a single backend API, which is the one component that talks to both the AI processing layer and the data layer.

```
Complaint → AI Verification → Classification → Duplicate Detection → Incident Intelligence → Priority → Recommended Action → Authority
```

## Layers

### 1. Client layer
- **Citizen web app** — complaint submission (photo, description, GPS location)
- **Authority dashboard** — map, priority queue, incident records, evidence viewer, status pipeline

### 2. Backend API layer
- Single coordination point. Receives citizen submissions, calls the AI processing layer, writes results to the data layer, and serves data to the authority dashboard.
- Keeping this centralized means the frontend never calls AI services directly.

### 3. AI processing layer
- **Classification** — determines issue type, severity, and evidence confidence from text + image (also handles evidence verification)
- **Duplicate merge** — clusters related reports into a single incident using geographic proximity, category, and text/image similarity
- **Priority engine** — computes the weighted priority score and generates the AI-recommended action

For v1, these don't need to be separate microservices — they can be three modules within the same backend, each making calls to the LLM API as needed. Splitting into standalone services is a later-stage optimization.

### 4. Data layer
- **Database** — complaints, incidents, authority users
- **File storage** — uploaded photos/videos (typically separate from the main database, e.g. Supabase Storage or Firebase Storage)
- **Map service** — external service (Leaflet/Google Maps) queried by the dashboard; not something you build

## Data Flow (single complaint)

1. Citizen submits a complaint (photo, description, location) via the client layer
2. Backend API stores the raw complaint and forwards it to the AI processing layer
3. Classification module returns issue type, severity, and evidence confidence; evidence verification flags any mismatched submissions
4. Duplicate merge module checks for existing nearby incidents of the same category and either creates a new incident or merges into an existing one
5. Priority engine recalculates the incident's priority score and recommended action based on the updated report count and severity
6. Backend API writes updated incident data back to the database
7. Authority dashboard reflects the updated incident on next load/refresh (map, priority queue, evidence)

## Design Notes

- Centralizing AI calls in the backend simplifies auth, rate limiting, and cost tracking for LLM usage.
- The database schema should separate raw complaints (individual citizen submissions) from incidents (the merged, authority-facing record) — see the PRD's Incident Intelligence Record for the target shape of an incident.
- File storage should store evidence by complaint ID, with incidents referencing the combined set of evidence from their merged complaints.
