import { BenchmarkDataset } from '../types';

// Synthesized high-fidelity representation of NASA C-MAPSS FD001 (Turbofan Engine Degradation Simulation)
// Engine #3 (Run to Failure over 206 cycles)
const cmapssDataPoints = [
  { cycle: 10, s2_temp_hpc: 641.8, s3_temp_lpt: 1582.4, s4_temp_hpt: 1400.1, s7_press_total: 554.3, s11_press_static: 47.45, s12_fan_speed: 521.8, s14_core_speed: 8138.2, s15_bypass_ratio: 8.41, rulActual: 196, rulPredicted: 194, anomalyScore: 0.04 },
  { cycle: 30, s2_temp_hpc: 642.1, s3_temp_lpt: 1583.1, s4_temp_hpt: 1401.5, s7_press_total: 554.1, s11_press_static: 47.48, s12_fan_speed: 521.7, s14_core_speed: 8138.9, s15_bypass_ratio: 8.42, rulActual: 176, rulPredicted: 175, anomalyScore: 0.06 },
  { cycle: 50, s2_temp_hpc: 642.3, s3_temp_lpt: 1584.0, s4_temp_hpt: 1402.8, s7_press_total: 553.9, s11_press_static: 47.50, s12_fan_speed: 521.6, s14_core_speed: 8139.4, s15_bypass_ratio: 8.43, rulActual: 156, rulPredicted: 158, anomalyScore: 0.09 },
  { cycle: 70, s2_temp_hpc: 642.5, s3_temp_lpt: 1585.2, s4_temp_hpt: 1404.2, s7_press_total: 553.6, s11_press_static: 47.53, s12_fan_speed: 521.5, s14_core_speed: 8140.1, s15_bypass_ratio: 8.44, rulActual: 136, rulPredicted: 138, anomalyScore: 0.12 },
  { cycle: 90, s2_temp_hpc: 642.8, s3_temp_lpt: 1586.8, s4_temp_hpt: 1406.0, s7_press_total: 553.2, s11_press_static: 47.58, s12_fan_speed: 521.3, s14_core_speed: 8141.2, s15_bypass_ratio: 8.46, rulActual: 116, rulPredicted: 114, anomalyScore: 0.18 },
  { cycle: 110, s2_temp_hpc: 643.2, s3_temp_lpt: 1588.5, s4_temp_hpt: 1408.4, s7_press_total: 552.8, s11_press_static: 47.64, s12_fan_speed: 521.1, s14_core_speed: 8142.8, s15_bypass_ratio: 8.48, rulActual: 96, rulPredicted: 95, anomalyScore: 0.25 },
  { cycle: 130, s2_temp_hpc: 643.9, s3_temp_lpt: 1591.2, s4_temp_hpt: 1411.9, s7_press_total: 552.1, s11_press_static: 47.72, s12_fan_speed: 520.8, s14_core_speed: 8145.1, s15_bypass_ratio: 8.52, rulActual: 76, rulPredicted: 78, anomalyScore: 0.38 },
  { cycle: 150, s2_temp_hpc: 644.8, s3_temp_lpt: 1594.6, s4_temp_hpt: 1416.8, s7_press_total: 551.4, s11_press_static: 47.81, s12_fan_speed: 520.4, s14_core_speed: 8148.6, s15_bypass_ratio: 8.56, rulActual: 56, rulPredicted: 54, anomalyScore: 0.54 },
  { cycle: 165, s2_temp_hpc: 645.7, s3_temp_lpt: 1598.0, s4_temp_hpt: 1421.4, s7_press_total: 550.8, s11_press_static: 47.90, s12_fan_speed: 520.0, s14_core_speed: 8152.0, s15_bypass_ratio: 8.60, rulActual: 41, rulPredicted: 39, anomalyScore: 0.69 },
  { cycle: 180, s2_temp_hpc: 646.9, s3_temp_lpt: 1602.8, s4_temp_hpt: 1428.1, s7_press_total: 549.9, s11_press_static: 48.05, s12_fan_speed: 519.4, s14_core_speed: 8156.4, s15_bypass_ratio: 8.66, rulActual: 26, rulPredicted: 24, anomalyScore: 0.82 },
  { cycle: 195, s2_temp_hpc: 648.5, s3_temp_lpt: 1609.4, s4_temp_hpt: 1437.2, s7_press_total: 548.7, s11_press_static: 48.24, s12_fan_speed: 518.7, s14_core_speed: 8162.9, s15_bypass_ratio: 8.74, rulActual: 11, rulPredicted: 10, anomalyScore: 0.94 },
  { cycle: 206, s2_temp_hpc: 651.2, s3_temp_lpt: 1616.0, s4_temp_hpt: 1445.8, s7_press_total: 547.2, s11_press_static: 48.45, s12_fan_speed: 517.9, s14_core_speed: 8169.5, s15_bypass_ratio: 8.82, rulActual: 0, rulPredicted: 1, anomalyScore: 0.99 },
];

export const BENCHMARK_DATASETS: BenchmarkDataset[] = [
  {
    id: 'cmapss',
    name: 'NASA C-MAPSS Turbofan Degradation (FD001)',
    institution: 'NASA Ames Prognostics Center of Excellence',
    description: '100 turbofan jet engines run from nominal operation to structural failure under sea-level conditions. Contains 21 continuous sensor channels, High-Pressure Compressor (HPC) thermal degradation, and High-Pressure Turbine (HPT) blade clearance growth.',
    sampleAsset: 'Turbofan CFM56 Unit-09',
    dataPoints: cmapssDataPoints,
    modelAccuracy: {
      rmse: 14.2,
      mae: 10.8,
      f1Score: 0.94,
      leadTimeHours: 42.5,
    },
    features: [
      'T24: Total temp at LPC outlet (°R)',
      'T30: Total temp at HPC outlet (°R)',
      'T50: Total temp at LPT outlet (°R)',
      'P30: Total pressure at HPC outlet (psia)',
      'Nf: Physical fan speed (rpm)',
      'Nc: Physical core speed (rpm)',
      'BPR: Bypass ratio',
      'W31: HPT coolant bleed (lbm/s)',
      'W32: LPT coolant bleed (lbm/s)'
    ]
  },
  {
    id: 'ai4i',
    name: 'UCI AI4I 2020 CNC Predictive Maintenance',
    institution: 'University of California, Irvine Machine Learning Repository',
    description: '10,000 real-world synthetic milling machine telemetry cycles capturing 5 distinct industrial failure modes: Tool Wear Failure (TWF), Heat Dissipation Failure (HDF), Power Failure (PWF), Overstrain Failure (OSF), and Random Failure (RNF).',
    sampleAsset: '5-Axis Machining Center CNC-04',
    dataPoints: [
      { cycle: 20, s2_temp_hpc: 298.1, s3_temp_lpt: 308.6, s4_temp_hpt: 1550, s7_press_total: 42.8, s11_press_static: 18, s12_fan_speed: 1551, s14_core_speed: 42.8, s15_bypass_ratio: 0.05, rulActual: 180, rulPredicted: 182, anomalyScore: 0.05 },
      { cycle: 60, s2_temp_hpc: 298.5, s3_temp_lpt: 308.9, s4_temp_hpt: 1545, s7_press_total: 44.1, s11_press_static: 55, s12_fan_speed: 1540, s14_core_speed: 43.5, s15_bypass_ratio: 0.07, rulActual: 140, rulPredicted: 138, anomalyScore: 0.08 },
      { cycle: 100, s2_temp_hpc: 299.1, s3_temp_lpt: 309.4, s4_temp_hpt: 1530, s7_press_total: 47.2, s11_press_static: 95, s12_fan_speed: 1528, s14_core_speed: 45.1, s15_bypass_ratio: 0.12, rulActual: 100, rulPredicted: 102, anomalyScore: 0.14 },
      { cycle: 140, s2_temp_hpc: 300.2, s3_temp_lpt: 310.8, s4_temp_hpt: 1490, s7_press_total: 53.6, s11_press_static: 140, s12_fan_speed: 1502, s14_core_speed: 49.8, s15_bypass_ratio: 0.28, rulActual: 60, rulPredicted: 57, anomalyScore: 0.39 },
      { cycle: 180, s2_temp_hpc: 301.8, s3_temp_lpt: 312.5, s4_temp_hpt: 1420, s7_press_total: 62.4, s11_press_static: 195, s12_fan_speed: 1440, s14_core_speed: 58.2, s15_bypass_ratio: 0.65, rulActual: 20, rulPredicted: 18, anomalyScore: 0.78 },
      { cycle: 200, s2_temp_hpc: 303.4, s3_temp_lpt: 314.9, s4_temp_hpt: 1350, s7_press_total: 74.8, s11_press_static: 238, s12_fan_speed: 1360, s14_core_speed: 68.9, s15_bypass_ratio: 0.95, rulActual: 0, rulPredicted: 2, anomalyScore: 0.98 },
    ],
    modelAccuracy: {
      rmse: 8.6,
      mae: 6.2,
      f1Score: 0.97,
      leadTimeHours: 19.0,
    },
    features: [
      'Air temperature [K]',
      'Process temperature [K]',
      'Rotational speed [rpm]',
      'Torque [Nm]',
      'Tool wear [min]',
      'Target Failure Class (TWF / HDF / PWF / OSF)'
    ]
  },
  {
    id: 'bearing_cwru',
    name: 'CWRU High-Frequency Vibration Bearing Fault Dataset',
    institution: 'Case Western Reserve University Bearing Data Center',
    description: 'Seed-fault vibration recordings sampled at 12,000 to 48,000 samples/sec with accelerometers positioned at 12 o\'clock drive end. Differentiates ball, inner raceway (BPFI), and outer raceway (BPFO) defect diameter signatures (7 mils to 28 mils).',
    sampleAsset: 'Hydraulic Pump HP-12 & Kiln Blower KB-02',
    dataPoints: [
      { cycle: 10, s2_temp_hpc: 42.1, s3_temp_lpt: 0.85, s4_temp_hpt: 1790, s7_press_total: 1.2, s11_press_static: 0.4, s12_fan_speed: 1797, s14_core_speed: 1.15, s15_bypass_ratio: 0.02, rulActual: 300, rulPredicted: 295, anomalyScore: 0.02 },
      { cycle: 50, s2_temp_hpc: 44.5, s3_temp_lpt: 1.12, s4_temp_hpt: 1785, s7_press_total: 1.4, s11_press_static: 0.5, s12_fan_speed: 1792, s14_core_speed: 1.35, s15_bypass_ratio: 0.04, rulActual: 240, rulPredicted: 236, anomalyScore: 0.05 },
      { cycle: 100, s2_temp_hpc: 48.2, s3_temp_lpt: 1.65, s4_temp_hpt: 1778, s7_press_total: 1.9, s11_press_static: 0.8, s12_fan_speed: 1780, s14_core_speed: 1.82, s15_bypass_ratio: 0.11, rulActual: 180, rulPredicted: 175, anomalyScore: 0.16 },
      { cycle: 150, s2_temp_hpc: 55.4, s3_temp_lpt: 2.45, s4_temp_hpt: 1762, s7_press_total: 2.7, s11_press_static: 1.4, s12_fan_speed: 1760, s14_core_speed: 2.65, s15_bypass_ratio: 0.35, rulActual: 120, rulPredicted: 118, anomalyScore: 0.42 },
      { cycle: 200, s2_temp_hpc: 68.2, s3_temp_lpt: 3.85, s4_temp_hpt: 1740, s7_press_total: 4.1, s11_press_static: 2.3, s12_fan_speed: 1735, s14_core_speed: 4.10, s15_bypass_ratio: 0.72, rulActual: 60, rulPredicted: 58, anomalyScore: 0.79 },
      { cycle: 240, s2_temp_hpc: 84.9, s3_temp_lpt: 5.62, s4_temp_hpt: 1705, s7_press_total: 6.8, s11_press_static: 3.9, s12_fan_speed: 1690, s14_core_speed: 6.45, s15_bypass_ratio: 0.96, rulActual: 0, rulPredicted: 3, anomalyScore: 0.99 },
    ],
    modelAccuracy: {
      rmse: 5.4,
      mae: 4.1,
      f1Score: 0.98,
      leadTimeHours: 64.0,
    },
    features: [
      'Drive-end accelerometer [g]',
      'Fan-end accelerometer [g]',
      'Baseplate accelerometer [g]',
      'Motor shaft speed [rpm]',
      'Fault Diameter [0.007" / 0.014" / 0.021"]',
      'Defect Zone: Inner Race (BPFI) / Ball / Outer Race (BPFO)'
    ]
  }
];
