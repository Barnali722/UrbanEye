# 🌆 UrbanEye

### AI-Powered Civic Complaint & Infrastructure Intelligence

[![Citizen Portal](https://img.shields.io/badge/Citizen%20Portal-Live-000000?style=for-the-badge\&logo=vercel)](https://urbaneye-ai-citizen-ui.vercel.app/)
[![Authority Dashboard](https://img.shields.io/badge/Authority%20Dashboard-Live-000000?style=for-the-badge\&logo=vercel)](https://urbaneye-authority-ui.vercel.app/)


## 👥 Team

### **Team — Tech Titans**

**Project:** UrbanEye — AI-Powered Civic Complaint & Infrastructure Intelligence

**Team Members:**

* **Barnali Tanti**
* **Md Aftab Hossain**
* **Puranjay Singh Bisht**
* **Samiha Chowdhuri**

Built with ❤️ by **Tech Titans** using React, TypeScript, Node.js, PostgreSQL, and AI.

--------

> **Turning scattered citizen complaints into verified, consolidated, prioritized civic incidents.**

UrbanEye is an AI-powered civic intelligence platform designed to help authorities understand, verify, consolidate, prioritize, and act on civic complaints more efficiently.

Instead of treating every complaint as an isolated ticket, UrbanEye attempts to identify the **real-world incident behind multiple citizen reports**.

---

## 🎯 The Problem

Cities receive thousands of complaints about:

* 🕳️ Potholes
* 🗑️ Garbage accumulation
* 🌊 Waterlogging
* 🚰 Drainage problems
* 💡 Broken streetlights
* 🛣️ Road damage
* 🏗️ Other infrastructure issues

Traditional complaint systems often create a simple:

```text
Complaint → Department
```

This creates several problems:

* Multiple citizens may report the same issue.
* Complaints can be incorrectly classified.
* Evidence may be incomplete or irrelevant.
* Authorities have to manually identify duplicate reports.
* Important incidents can get buried in large complaint queues.
* Prioritization is often difficult and inconsistent.

UrbanEye changes this workflow to:

```text
Complaint
    ↓
AI Verification
    ↓
Issue Classification
    ↓
Duplicate Detection
    ↓
Incident Consolidation
    ↓
Priority Scoring
    ↓
Recommended Action
    ↓
Authority
```

---

# 💡 How UrbanEye Works

### 1. Citizen Reports an Issue

A citizen can submit:

* Problem description
* Issue category
* Image
* Video
* Location

Example:

```text
"Large pothole near the college gate.
It is causing problems for vehicles."
```

---

### 2. AI Understands the Complaint

UrbanEye analyzes the submitted information and determines:

* Issue type
* Severity
* Evidence confidence
* Whether verification may be required

Example:

```text
Issue: Pothole
Severity: High
Evidence Confidence: 94%
Verification: Passed
```

---

### 3. Duplicate / Related Complaint Detection

Instead of creating a new incident for every report, UrbanEye checks whether a nearby unresolved incident already exists.

Conceptually:

```text
Citizen A ──┐
Citizen B ──┤
Citizen C ──┼──→ Same Pothole
Citizen D ──┤
Citizen E ──┘
                 ↓
          One Civic Incident
```

This allows authorities to understand the **scale of the actual problem**.

---

### 4. Incident Intelligence

A civic incident can combine:

* Multiple citizen reports
* Images and evidence
* Location
* Issue category
* Severity
* Report count
* AI confidence
* Priority

Example:

```text
INCIDENT #104

Issue: Pothole
Location: College Road

Reports: 20
Severity: High
Evidence Confidence: 94%
Priority: 91/100

Recommended Action:
Road inspection and repair
```

---

### 5. Priority Scoring

UrbanEye generates a priority score to help authorities decide which incidents require faster attention.

The scoring model considers factors such as:

```text
Severity
Report Count
Safety Impact
Evidence Confidence
```

The resulting score is converted into priority levels:

```text
90–100 → Critical
70–89  → High
40–69  → Medium
0–39   → Low
```

---

### 6. Recommended Action

UrbanEye can suggest an operational response based on the incident type.

Examples:

| Problem      | Suggested Action           |
| ------------ | -------------------------- |
| Pothole      | Road inspection and repair |
| Garbage      | Waste collection dispatch  |
| Drainage     | Drainage inspection        |
| Streetlight  | Electrical inspection      |
| Waterlogging | Drainage/flood assessment  |
| Road Damage  | Road inspection and repair |

These recommendations are intended to **assist authorities**, not replace human decision-making.

---

# 🖥️ Applications

UrbanEye consists of two user-facing applications.

## 👤 Citizen Portal

The Citizen Portal allows residents to report civic issues and interact with the complaint system.

### Features

* Civic complaint submission
* Issue categorization
* Image/video evidence
* Location information
* Complaint status
* Complaint history
* Notifications
* Responsive interface

### 🚀 Live

**https://urbaneye-ai-citizen-ui.vercel.app/**

---

## 🏛️ Authority Dashboard

The Authority Dashboard provides an operational interface for reviewing and managing civic incidents.

### Features

* Incident overview
* Priority queue
* Incident analytics
* Location/map visualization
* Evidence review
* Duplicate/merged reports
* Recommended actions
* Incident status management
* Authority-focused dashboard

### 🚀 Live

**https://urbaneye-authority-ui.vercel.app/**

---

# 🧠 AI Intelligence Layer

UrbanEye uses AI to transform unstructured citizen reports into structured incident information.

The AI layer can analyze:

```text
Text
 ↓
Issue Classification
 ↓
Severity Assessment
 ↓
Evidence Confidence
 ↓
Verification Signal
```

The system is designed around structured outputs rather than simply generating free-form text.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │    CITIZEN PORTAL    │
                    │      React/Vite      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      BACKEND API     │
                    │    Node.js/Express    │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │  Gemini AI  │  │  Incident   │  │  Priority   │
       │  Analysis   │  │  Detection  │  │   Engine    │
       └─────────────┘  └─────────────┘  └─────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │      DATABASE        │
                    │ Complaints/Incidents │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ AUTHORITY DASHBOARD  │
                    │      React/Vite      │
                    └──────────────────────┘
```

---

# 📁 Repository Structure

```text
UrbanEye/
│
├── urbaneye-citizen_UI/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.*
│   └── ...
│
├── urbaneye-authority-UI/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.*
│   └── ...
│
├── aiService.js
├── incidentMergeService.js
├── priorityService.js
├── server.js
├── migrations/
│
├── Architecture_UrbanEye.md
├── UrbanEye_PRD.md
└── README.md
```

---

# 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express.js
* PostgreSQL
* REST APIs

### AI

* Google Gemini
* AI-powered complaint analysis
* Issue classification
* Severity assessment
* Evidence verification

### Deployment

* Vercel
* GitHub

---

# 🚀 Running Locally

## Citizen UI

```bash
cd urbaneye-citizen_UI
npm install
npm run dev
```

## Authority UI

```bash
cd urbaneye-authority-UI
npm install
npm run dev
```

## Backend

Install backend dependencies and configure the required environment variables before starting the server.

Example:

```env
GEMINI_API_KEY=your_api_key
DATABASE_URL=your_database_url
PORT=3000
```

> Never commit real API keys, database credentials, or other secrets to GitHub.

---

# 🔌 API Flow

A typical complaint follows this pipeline:

```text
POST /api/complaints
        ↓
Receive Complaint
        ↓
AI Analysis
        ↓
Classification
        ↓
Severity Assessment
        ↓
Incident Matching
        ↓
Priority Calculation
        ↓
Store / Update Incident
        ↓
Return Result
```

Example endpoints:

```http
POST /api/complaints
GET  /api/incidents
GET  /api/incidents/:id
```

---

# 🔮 Future Roadmap

### AI & Intelligence

* Image similarity for duplicate detection
* Semantic text similarity
* Geographic clustering
* Incident confidence scoring
* Civic hotspot detection
* Historical trend analysis
* Predictive infrastructure maintenance

### Authority Operations

* Department-wise routing
* SLA monitoring
* Automated escalation
* Workforce allocation
* Resource optimization
* Incident lifecycle tracking

### Platform

* Role-based authentication
* Multi-city support
* Audit logs
* Secure media storage
* Monitoring and observability
* Production-grade API infrastructure

---

# 🌟 Core Idea

UrbanEye is built around one fundamental distinction:

```text
Complaint ≠ Incident
```

A complaint is what **one citizen submits**.

An incident is the **real-world civic problem** that may generate many complaints.

Therefore:

```text
100 Complaints
       ↓
Duplicate & Spatial Analysis
       ↓
10 Real Incidents
       ↓
Prioritization
       ↓
Authority Action
```

This allows civic authorities to focus on **problems rather than paperwork**.

---

# 🎯 Vision

> **Make civic response smarter by turning citizen-generated data into actionable incident intelligence.**

UrbanEye aims to bridge the gap between **citizens reporting problems** and **authorities understanding what actually needs attention**.

---

## 👥 Project

**UrbanEye — AI-Powered Civic Complaint & Infrastructure Intelligence**

Built with ❤️ using **React, Node.js, PostgreSQL, and AI**.

---

## 📄 License

This project is provided for educational, hackathon, and development purposes.

If a formal open-source license has been added to the repository, refer to the repository's `LICENSE` file.
