/**
 * priorityService.js
 * ------------------
 * Pure, dependency-free scoring and labelling utilities for civic incidents.
 * No database access, no HTTP — safe to require anywhere and unit-test in isolation.
 *
 * Exports:
 *   calculatePriority(factors)   → integer 0-100
 *   getRecommendedAction(type)   → string
 *   getPriorityLabel(score)      → { label, color }
 */

'use strict';

// =============================================================
// Internal helpers
// =============================================================

/**
 * Maps a severity string to a 0-100 numeric value.
 * @param {string} severity  "low" | "medium" | "high" | "critical"
 * @returns {number} 0-100
 */
function severityToScore(severity) {
    const map = {
        low:      25,
        medium:   50,
        high:     75,
        critical: 100,
    };
    // Fall back to 0 for unknown values so callers always get a number.
    return map[(severity || '').toLowerCase()] ?? 0;
}

/**
 * Normalises a raw report count to 0-100 using a soft cap.
 * A count of 10+ already saturates the scale so one viral complaint
 * doesn't swamp the other weighted factors.
 *
 * Formula: min(count, CAP) / CAP * 100
 *
 * @param {number} reportCount  Raw integer ≥ 0
 * @returns {number} 0-100
 */
function normalizeReportCount(reportCount) {
    const CAP = 10; // 10 or more reports → full score on this axis
    const clamped = Math.min(Math.max(reportCount, 0), CAP);
    return (clamped / CAP) * 100;
}

/**
 * Clamps a value to [0, 100] to guard against out-of-range inputs.
 * @param {number} value
 * @returns {number}
 */
function clamp100(value) {
    return Math.min(100, Math.max(0, value));
}

// =============================================================
// Public API
// =============================================================

/**
 * Calculates a composite priority score for an incident.
 *
 * Weighting:
 *   severity            40%  – how dangerous/disruptive the issue type is
 *   reportCount         25%  – community signal (normalised, soft-capped at 10)
 *   safetyImpact        20%  – domain-derived safety risk (0-100, caller-supplied)
 *   evidenceConfidence  15%  – AI confidence in the complaint evidence (0-100)
 *
 * @param {Object} factors
 * @param {string} factors.severity            "low" | "medium" | "high" | "critical"
 * @param {number} factors.reportCount         Raw count of linked complaints
 * @param {number} factors.safetyImpact        0-100 (higher = more dangerous)
 * @param {number} factors.evidenceConfidence  0-100 (higher = more reliable evidence)
 * @returns {number} Integer 0-100
 */
function calculatePriority({ severity, reportCount, safetyImpact, evidenceConfidence }) {
    const severityScore     = severityToScore(severity);
    const reportScore       = normalizeReportCount(reportCount);
    const safetyScore       = clamp100(safetyImpact);
    const confidenceScore   = clamp100(evidenceConfidence);

    const raw =
        severityScore   * 0.40 +
        reportScore     * 0.25 +
        safetyScore     * 0.20 +
        confidenceScore * 0.15;

    // Round to nearest integer and ensure we stay in [0, 100].
    return Math.round(clamp100(raw));
}

/**
 * Returns a plain-language recommended action string for a given issue type.
 * Falls back to "Manual review required" for any unrecognised type.
 *
 * @param {string} issueType  e.g. "pothole", "drainage", etc.
 * @returns {string}
 */
function getRecommendedAction(issueType) {
    const actions = {
        pothole:      'Road inspection and surface repair',
        drainage:     'Drainage inspection and blockage removal',
        garbage:      'Waste collection dispatch',
        streetlight:  'Electrical inspection and replacement',
        waterlogging: 'Drainage inspection and flood risk assessment',
        road_damage:  'Road inspection and repair crew dispatch',
    };

    // Normalise to lowercase; default to manual review.
    return actions[(issueType || '').toLowerCase()] ?? 'Manual review required';
}

/**
 * Converts a numeric priority score to a human-readable label and display colour.
 *
 * Bands:
 *   90-100  → Critical — Immediate Attention Recommended  (red)
 *   70-89   → High                                        (orange)
 *   40-69   → Medium                                      (yellow)
 *    0-39   → Low                                         (green)
 *
 * @param {number} score  Integer 0-100
 * @returns {{ label: string, color: string }}
 */
function getPriorityLabel(score) {
    if (score >= 90) {
        return { label: 'Critical \u2014 Immediate Attention Recommended', color: 'red' };
    }
    if (score >= 70) {
        return { label: 'High', color: 'orange' };
    }
    if (score >= 40) {
        return { label: 'Medium', color: 'yellow' };
    }
    return { label: 'Low', color: 'green' };
}

// =============================================================
// Exports
// =============================================================

module.exports = {
    calculatePriority,
    getRecommendedAction,
    getPriorityLabel,
};
