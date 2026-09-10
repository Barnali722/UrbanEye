const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; 
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function findOrCreateIncident(complaintData, aiData) {
    const { lat, lng } = complaintData;
    const { issue_type, severity } = aiData;
    const GEO_RADIUS_METERS = 50; 

    const res = await pool.query(
        `SELECT * FROM incidents WHERE issue_type = $1 AND status != 'Resolved'`,
        [issue_type]
    );

    for (let incident of res.rows) {
        const distance = getDistance(lat, lng, incident.lat, incident.lng);
        if (distance <= GEO_RADIUS_METERS) {
            await pool.query(
                `UPDATE incidents SET report_count = report_count + 1 WHERE id = $1`,
                [incident.id]
            );
            return incident.id;
        }
    }

    const newIncident = await pool.query(
        `INSERT INTO incidents (issue_type, severity, lat, lng, report_count) 
         VALUES ($1, $2, $3, $4, 1) RETURNING id`,
        [issue_type, severity, lat, lng]
    );
    return newIncident.rows[0].id;
}

module.exports = { findOrCreateIncident };