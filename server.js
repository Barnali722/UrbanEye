require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { analyzeComplaint } = require('./aiService');
const { findOrCreateIncident } = require('./incidentMergeService');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
// This middleware is required to parse incoming JSON bodies
app.use(express.json());

// ---------------------------------------------------------
// CITIZEN ENDPOINT (Used by Member A)
// ---------------------------------------------------------
app.post('/api/complaints', async (req, res) => {
    try {
        const { description, image_url, lat, lng, citizen_id } = req.body;

        // Safety Check: Ensure the body was parsed correctly and has required fields
        if (!image_url || !description) {
            return res.status(400).json({ 
                error: "Missing required fields. Did you send JSON?",
                received_body: req.body 
            });
        }

        // Step 1: AI Classification & Verification
        const aiAnalysis = await analyzeComplaint(image_url, description);

        // Step 2: Duplicate Detection & Incident Merging
        const incidentId = await findOrCreateIncident({ lat, lng }, aiAnalysis);

        // Step 3: Save the raw complaint
        await pool.query(
            `INSERT INTO complaints 
            (incident_id, citizen_id, description, image_url, lat, lng, ai_issue_type, ai_severity, ai_evidence_confidence, verification_required) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                incidentId, citizen_id, description, image_url, lat, lng, 
                aiAnalysis.issue_type, aiAnalysis.severity, 
                aiAnalysis.evidence_confidence, aiAnalysis.verification_required
            ]
        );

        res.status(201).json({ 
            message: "Complaint processed successfully",
            incident_id: incidentId,
            ai_data: aiAnalysis
        });

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ error: "Failed to process complaint" });
    }
});

// ---------------------------------------------------------
// AUTHORITY DASHBOARD ENDPOINTS (Used by Member C)
// ---------------------------------------------------------

// GET all active incidents for the map and priority queue
app.get('/api/incidents', async (req, res) => {
    try {
        const incidents = await pool.query(
            `SELECT * FROM incidents ORDER BY created_at DESC`
        );
        res.json(incidents.rows);
    } catch (error) {
        console.error("Fetch incidents error:", error);
        res.status(500).json({ error: "Failed to fetch incidents" });
    }
});

// GET full evidence and reports for a specific incident
app.get('/api/incidents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const incident = await pool.query(`SELECT * FROM incidents WHERE id = $1`, [id]);
        const complaints = await pool.query(`SELECT * FROM complaints WHERE incident_id = $1`, [id]);
        
        if (incident.rows.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        res.json({
            incident: incident.rows[0],
            evidence_reports: complaints.rows
        });
    } catch (error) {
        console.error("Fetch incident details error:", error);
        res.status(500).json({ error: "Failed to fetch incident details" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));