export interface Publication {
  id?: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  abstract: string;
  url?: string;
  pdfUrl?: string;
  posterUrl?: string;
  codeUrl?: string;
  proceedingUrl?: string;
  presentationUrl?: string;
  conferenceUrl?: string;
  videoUrl?: string;
  illustrationUrl?: string;
  tags: string[];
  publicationType?: string;
  researchAreas?: string[];
  scholarId?: string;
  scholarClusterId?: string;
  lastSyncedAt?: string;
}
