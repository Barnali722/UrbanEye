require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { analyzeComplaint } = require('./aiService');
const { findOrCreateIncident } = require('./incidentMergeService');
const { calculatePriority, getRecommendedAction, getPriorityLabel } = require('./priorityService');

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

        // Enrich each incident with priority scoring
        const enriched = await Promise.all(incidents.rows.map(async (incident) => {
            // Aggregate AI evidence confidence from all linked complaints
            const confResult = await pool.query(
                `SELECT AVG(ai_evidence_confidence) AS avg_confidence
                 FROM complaints
                 WHERE incident_id = $1`,
                [incident.id]
            );
            const evidenceConfidence = confResult.rows[0].avg_confidence
                ? parseFloat(confResult.rows[0].avg_confidence)
                : 70; // default when no complaints exist yet

            // Derive safety impact from issue type
            const safetyImpact = getSafetyImpact(incident.issue_type);

            // Calculate composite priority score (0-100)
            const priority_score = calculatePriority({
                severity:           incident.severity,
                reportCount:        incident.report_count || 0,
                safetyImpact,
                evidenceConfidence,
            });

            // Human-readable recommended action
            const recommended_action = getRecommendedAction(incident.issue_type);

            // Persist scores back to the incidents table
            await pool.query(
                `UPDATE incidents
                 SET priority_score = $1, recommended_action = $2
                 WHERE id = $3`,
                [priority_score, recommended_action, incident.id]
            );

            // Attach label/color for API consumers (not stored in DB)
            const { label: priority_label, color: priority_color } = getPriorityLabel(priority_score);

            return {
                ...incident,
                priority_score,
                recommended_action,
                priority_label,
                priority_color,
            };
        }));

        res.json(enriched);
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

        const incidentRow = incident.rows[0];

        // Compute average evidence confidence from linked complaints
        const totalConfidence = complaints.rows.reduce(
            (sum, c) => sum + (parseFloat(c.ai_evidence_confidence) || 0),
            0
        );
        const evidenceConfidence = complaints.rows.length > 0
            ? totalConfidence / complaints.rows.length
            : 70; // default when no complaints exist yet

        // Derive safety impact from issue type
        const safetyImpact = getSafetyImpact(incidentRow.issue_type);

        // Calculate composite priority score (0-100)
        const priority_score = calculatePriority({
            severity:           incidentRow.severity,
            reportCount:        incidentRow.report_count || 0,
            safetyImpact,
            evidenceConfidence,
        });

        // Human-readable recommended action
        const recommended_action = getRecommendedAction(incidentRow.issue_type);

        // Persist scores back to the incidents table
        await pool.query(
            `UPDATE incidents
             SET priority_score = $1, recommended_action = $2
             WHERE id = $3`,
            [priority_score, recommended_action, incidentRow.id]
        );

        // Attach label/color for API consumers (not stored in DB)
        const { label: priority_label, color: priority_color } = getPriorityLabel(priority_score);

        res.json({
            incident: {
                ...incidentRow,
                priority_score,
                recommended_action,
                priority_label,
                priority_color,
            },
            evidence_reports: complaints.rows,
        });
    } catch (error) {
        console.error("Fetch incident details error:", error);
        res.status(500).json({ error: "Failed to fetch incident details" });
    }
});

// =============================================================
// Helper: derive a 0-100 safety impact score from the issue type.
// Higher numbers indicate greater public-safety risk.
// Used by the GET /api/incidents handlers above.
// =============================================================
function getSafetyImpact(issueType) {
    const map = {
        waterlogging: 90, // flood/drowning risk
        drainage:     80, // structural collapse, health hazard
        road_damage:  70, // accident risk
        pothole:      60, // vehicle/pedestrian injury
        streetlight:  50, // night-time safety
        garbage:      30, // health nuisance, lower immediate danger
    };
    return map[(issueType || '').toLowerCase()] ?? 40; // default medium-low
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));