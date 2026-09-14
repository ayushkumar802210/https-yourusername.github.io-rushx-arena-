export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type EvidenceStatus =
  | 'Actual from bill'
  | 'User verified'
  | 'Calculated by RushXArena'
  | 'Estimated'
  | 'Not available';

export interface ExtractedField<T = string | number | null> {
  value: T;
  confidence: ConfidenceLevel;
  source: string;
  evidence: string;
  status: EvidenceStatus;
}

export interface ProviderDetectionResult {
  providerName: string;
  confidence: ConfidenceLevel;
  reasons: string[];
}

export interface BillProvider {
  providerName: string;
  detect(rawText: string): ProviderDetectionResult;
  parse(rawText: string): Record<string, unknown>;
}
