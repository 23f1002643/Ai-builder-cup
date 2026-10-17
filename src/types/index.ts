export type AssetStatus = 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';

export interface SensorMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  nominalMin: number;
  nominalMax: number;
  warningThreshold: number;
  criticalThreshold: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  history: number[];
}

export interface Asset {
  id: string;
  name: string;
  tag: string;
  category: string;
  bay: string;
  status: AssetStatus;
  healthScore: number; // 0 - 100
  rulHours: number;
  rulUnit: 'hours' | 'cycles';
  uptimePct: number;
  operatingHours: number;
  image: string;
  model: string;
  serialNo: string;
  manufacturer: string;
  lastServiceDate: string;
  nextScheduledService: string;
  sensors: SensorMetric[];
  specs: Record<string, string>;
  manuals: { title: string; section: string; content: string }[];
}

export type WorkOrderPriority = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MEDIUM' | 'P4-LOW';
export type WorkOrderStatus = 'TRIGGERED' | 'DISPATCHED' | 'IN_PROGRESS' | 'RESOLVED';

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  createdAt: string;
  triggerReason: string;
  assignedTechnician: string;
  estimatedDurationMinutes: number;
  tasks: { step: number; instruction: string; verified: boolean }[];
  consumableParts: { sku: string; name: string; quantity: number; unit: string }[];
  safetyPrecautions: string[];
}

export interface DiagnosticReport {
  severity: 'NORMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  faultType: string;
  confidenceScore: number;
  rootCauseSummary: string;
  failureProbability72h: number;
  standardsCompliance: string;
  recommendedAction: string;
  urgency: 'IMMEDIATE_STOP' | 'SCHEDULE_24H' | 'MONITOR_NEXT_SHIFT' | 'NOMINAL';
  estimatedRepairHours: number;
  requiredParts: { partNumber: string; description: string; inStock: boolean }[];
}

export interface BenchmarkDataPoint {
  cycle: number;
  s2_temp_hpc: number;
  s3_temp_lpt: number;
  s4_temp_hpt: number;
  s7_press_total: number;
  s11_press_static: number;
  s12_fan_speed: number;
  s14_core_speed: number;
  s15_bypass_ratio: number;
  rulActual: number;
  rulPredicted: number;
  anomalyScore: number;
}

export interface BenchmarkDataset {
  id: 'cmapss' | 'ai4i' | 'bearing_cwru';
  name: string;
  institution: string;
  description: string;
  sampleAsset: string;
  dataPoints: BenchmarkDataPoint[];
  modelAccuracy: {
    rmse: number;
    mae: number;
    f1Score: number;
    leadTimeHours: number;
  };
  features: string[];
}

export interface ThermalScanResult {
  maxObservedTempC: number;
  deltaT: number;
  severityRating: 'CRITICAL' | 'SERIOUS' | 'ADVISORY' | 'NORMAL';
  primaryAnomaly: string;
  identifiedHotspots: { zone: string; tempC: number; status: string }[];
  failureRisk: string;
  correctiveAction: string;
}
