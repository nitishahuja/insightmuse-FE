export type ProcessingStatus = "processing" | "completed" | "error";
export type SectionType = "methodology" | "results" | "discussion" | "other";
export type VisualizationType = "NONE" | "FLOWCHART" | "BAR_CHART";
export type SectionStatus = "pending" | "completed" | "error";

export interface VisualizationStyle {
  colors: string[];
  layout: string;
}

export interface Visualization {
  viz_type: VisualizationType;
  explanation: string;
  data: Record<string, any>;
  style: VisualizationStyle;
}

export interface TLDR {
  tldr: string;
  visualization: Visualization;
}

export interface Section {
  title: string;
  section_type: SectionType;
  tldr: TLDR | null;
  visualization: string | null; // base64 encoded image string
  status: SectionStatus;
}

export interface DocumentState {
  document_id: string;
  filename: string;
  processing_status: ProcessingStatus;
  total_sections: number;
  sections: Section[];
  error?: string | null;
  isLoading?: boolean;
}

// API Response types
export interface UploadResponse extends DocumentState {}
export interface TLDRResponse extends DocumentState {}

export interface QnAResponse {
  answer: string;
}
