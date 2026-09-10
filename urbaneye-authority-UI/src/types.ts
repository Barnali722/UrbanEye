export type PriorityTier = 'P1 Critical' | 'P2 High' | 'P3 Medium' | 'P4 Low';

export type IncidentStatus = 'Active' | 'Investigating' | 'Dispatched' | 'In Progress' | 'Resolved';

export interface CitizenReportSnippet {
  id: string;
  source: 'Civic App' | 'Twitter/X' | 'WhatsApp Bot' | 'Hotline 311';
  citizen: string;
  timestamp: string;
  excerpt: string;
  sentiment: 'Urgent' | 'Frustrated' | 'Informational';
  locationDetail: string;
}

export interface Incident {
  id: string;
  incidentNumber: string;
  title: string;
  location: string;
  sector: string;
  category: 'Roads & Asphalt' | 'Drainage & Flooding' | 'Sanitation & Waste' | 'Traffic & Safety';
  priorityScore: number; // 0 - 100
  priorityTier: PriorityTier;
  reportsMergedCount: number;
  recommendedAction: string;
  status: IncidentStatus;
  reportedTimeAgo: string;
  imageSrc?: string;
  coordinates: {
    lat: number;
    lng: number;
    mapXPercent: number;
    mapYPercent: number;
  };
  impactEstimation: string;
  summary: string;
  aiConfidence: number;
  assignedCrew?: string;
  rawCitizenReports: CitizenReportSnippet[];
}

export interface KpiData {
  activeIncidents: number;
  criticalPriority: number;
  duplicateReportsMerged: number;
  resolvedThisWeek: number;
}
