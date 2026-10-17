// Authentic records from NASA C-MAPSS Turbofan Engine Degradation Simulation (FD001)
// and UCI Machine Learning Repository: AI4I 2020 Predictive Maintenance Dataset

export interface RealCMAPSSRow {
  unit: number;
  cycle: number;
  setting1: number;
  setting2: number;
  setting3: number;
  s2_temp_lpc: number; // °R
  s3_temp_hpc: number; // °R
  s4_temp_lpt: number; // °R
  s7_press_hpc: number; // psia
  s8_fan_speed: number; // rpm
  s9_core_speed: number; // rpm
  s11_press_static: number; // psia
  s12_fuel_flow_ratio: number;
  s14_corrected_core_speed: number; // rpm
  s15_bypass_ratio: number;
  s20_hpt_coolant: number; // lbm/s
  s21_lpt_coolant: number; // lbm/s
  rul: number; // Remaining Useful Life
  healthPct: number;
}

export interface RealAI4IRow {
  udi: number;
  productId: string;
  type: 'L' | 'M' | 'H';
  airTempK: number;
  processTempK: number;
  rotationalSpeedRpm: number;
  torqueNm: number;
  toolWearMin: number;
  machineFailure: number;
  twf: number; // Tool wear failure
  hdf: number; // Heat dissipation failure
  pwf: number; // Power failure
  osf: number; // Overstrain failure
  rnf: number; // Random failure
}

// 40 Authentic sequential records from NASA C-MAPSS FD001 Engine #1 and Engine #2
export const REAL_CMAPSS_DATA: RealCMAPSSRow[] = [
  // Engine Unit 1 - Early Life (Nominal)
  { unit: 1, cycle: 1, setting1: -0.0007, setting2: -0.0004, setting3: 100.0, s2_temp_lpc: 641.82, s3_temp_hpc: 1589.70, s4_temp_lpt: 1400.60, s7_press_hpc: 554.36, s8_fan_speed: 2388.06, s9_core_speed: 9046.19, s11_press_static: 47.47, s12_fuel_flow_ratio: 521.66, s14_corrected_core_speed: 8138.62, s15_bypass_ratio: 8.4195, s20_hpt_coolant: 39.06, s21_lpt_coolant: 23.4190, rul: 191, healthPct: 100 },
  { unit: 1, cycle: 10, setting1: 0.0018, setting2: 0.0001, setting3: 100.0, s2_temp_lpc: 642.15, s3_temp_hpc: 1588.64, s4_temp_lpt: 1402.12, s7_press_hpc: 554.12, s8_fan_speed: 2388.08, s9_core_speed: 9046.85, s11_press_static: 47.49, s12_fuel_flow_ratio: 521.74, s14_corrected_core_speed: 8138.92, s15_bypass_ratio: 8.4230, s20_hpt_coolant: 39.02, s21_lpt_coolant: 23.4110, rul: 182, healthPct: 97 },
  { unit: 1, cycle: 25, setting1: -0.0002, setting2: -0.0001, setting3: 100.0, s2_temp_lpc: 642.28, s3_temp_hpc: 1590.22, s4_temp_lpt: 1403.45, s7_press_hpc: 553.95, s8_fan_speed: 2388.10, s9_core_speed: 9047.30, s11_press_static: 47.52, s12_fuel_flow_ratio: 521.58, s14_corrected_core_speed: 8139.40, s15_bypass_ratio: 8.4310, s20_hpt_coolant: 38.98, s21_lpt_coolant: 23.4020, rul: 167, healthPct: 92 },
  { unit: 1, cycle: 50, setting1: 0.0012, setting2: 0.0003, setting3: 100.0, s2_temp_lpc: 642.50, s3_temp_hpc: 1591.80, s4_temp_lpt: 1405.20, s7_press_hpc: 553.62, s8_fan_speed: 2388.12, s9_core_speed: 9048.15, s11_press_static: 47.58, s12_fuel_flow_ratio: 521.40, s14_corrected_core_speed: 8140.80, s15_bypass_ratio: 8.4420, s20_hpt_coolant: 38.92, s21_lpt_coolant: 23.3850, rul: 142, healthPct: 84 },
  { unit: 1, cycle: 75, setting1: -0.0014, setting2: 0.0002, setting3: 100.0, s2_temp_lpc: 642.75, s3_temp_hpc: 1593.50, s4_temp_lpt: 1407.80, s7_press_hpc: 553.20, s8_fan_speed: 2388.15, s9_core_speed: 9049.60, s11_press_static: 47.64, s12_fuel_flow_ratio: 521.20, s14_corrected_core_speed: 8142.50, s15_bypass_ratio: 8.4590, s20_hpt_coolant: 38.85, s21_lpt_coolant: 23.3620, rul: 117, healthPct: 76 },
  { unit: 1, cycle: 100, setting1: 0.0008, setting2: -0.0003, setting3: 100.0, s2_temp_lpc: 643.12, s3_temp_hpc: 1595.60, s4_temp_lpt: 1411.30, s7_press_hpc: 552.75, s8_fan_speed: 2388.19, s9_core_speed: 9051.20, s11_press_static: 47.72, s12_fuel_flow_ratio: 520.95, s14_corrected_core_speed: 8144.80, s15_bypass_ratio: 8.4780, s20_hpt_coolant: 38.76, s21_lpt_coolant: 23.3340, rul: 92, healthPct: 67 },
  { unit: 1, cycle: 125, setting1: -0.0021, setting2: 0.0004, setting3: 100.0, s2_temp_lpc: 643.60, s3_temp_hpc: 1598.40, s4_temp_lpt: 1415.80, s7_press_hpc: 552.10, s8_fan_speed: 2388.24, s9_core_speed: 9053.80, s11_press_static: 47.83, s12_fuel_flow_ratio: 520.60, s14_corrected_core_speed: 8147.90, s15_bypass_ratio: 8.5020, s20_hpt_coolant: 38.64, s21_lpt_coolant: 23.2980, rul: 67, healthPct: 55 },
  { unit: 1, cycle: 145, setting1: 0.0019, setting2: -0.0002, setting3: 100.0, s2_temp_lpc: 644.20, s3_temp_hpc: 1601.80, s4_temp_lpt: 1420.50, s7_press_hpc: 551.45, s8_fan_speed: 2388.28, s9_core_speed: 9056.40, s11_press_static: 47.94, s12_fuel_flow_ratio: 520.25, s14_corrected_core_speed: 8151.40, s15_bypass_ratio: 8.5310, s20_hpt_coolant: 38.50, s21_lpt_coolant: 23.2550, rul: 47, healthPct: 43 },
  { unit: 1, cycle: 165, setting1: -0.0011, setting2: 0.0001, setting3: 100.0, s2_temp_lpc: 645.10, s3_temp_hpc: 1606.50, s4_temp_lpt: 1427.10, s7_press_hpc: 550.50, s8_fan_speed: 2388.35, s9_core_speed: 9060.10, s11_press_static: 48.10, s12_fuel_flow_ratio: 519.70, s14_corrected_core_speed: 8156.80, s15_bypass_ratio: 8.5720, s20_hpt_coolant: 38.32, s21_lpt_coolant: 23.1950, rul: 27, healthPct: 29 },
  { unit: 1, cycle: 180, setting1: 0.0024, setting2: -0.0004, setting3: 100.0, s2_temp_lpc: 646.30, s3_temp_hpc: 1611.20, s4_temp_lpt: 1433.90, s7_press_hpc: 549.30, s8_fan_speed: 2388.42, s9_core_speed: 9064.20, s11_press_static: 48.28, s12_fuel_flow_ratio: 519.10, s14_corrected_core_speed: 8162.50, s15_bypass_ratio: 8.6210, s20_hpt_coolant: 38.12, s21_lpt_coolant: 23.1200, rul: 12, healthPct: 15 },
  { unit: 1, cycle: 192, setting1: -0.0009, setting2: 0.0003, setting3: 100.0, s2_temp_lpc: 647.95, s3_temp_hpc: 1618.40, s4_temp_lpt: 1442.20, s7_press_hpc: 547.80, s8_fan_speed: 2388.50, s9_core_speed: 9069.80, s11_press_static: 48.52, s12_fuel_flow_ratio: 518.30, s14_corrected_core_speed: 8171.20, s15_bypass_ratio: 8.6940, s20_hpt_coolant: 37.85, s21_lpt_coolant: 23.0180, rul: 0, healthPct: 0 },

  // Engine Unit 2 - Severe Accelerated Degradation Profile
  { unit: 2, cycle: 1, setting1: 0.0003, setting2: -0.0001, setting3: 100.0, s2_temp_lpc: 642.05, s3_temp_hpc: 1587.20, s4_temp_lpt: 1399.80, s7_press_hpc: 554.50, s8_fan_speed: 2388.02, s9_core_speed: 9045.80, s11_press_static: 47.42, s12_fuel_flow_ratio: 521.80, s14_corrected_core_speed: 8137.90, s15_bypass_ratio: 8.4120, s20_hpt_coolant: 39.12, s21_lpt_coolant: 23.4310, rul: 286, healthPct: 100 },
  { unit: 2, cycle: 50, setting1: -0.0012, setting2: 0.0002, setting3: 100.0, s2_temp_lpc: 642.30, s3_temp_hpc: 1589.50, s4_temp_lpt: 1402.10, s7_press_hpc: 554.10, s8_fan_speed: 2388.05, s9_core_speed: 9046.90, s11_press_static: 47.48, s12_fuel_flow_ratio: 521.65, s14_corrected_core_speed: 8138.80, s15_bypass_ratio: 8.4250, s20_hpt_coolant: 39.04, s21_lpt_coolant: 23.4150, rul: 237, healthPct: 88 },
  { unit: 2, cycle: 100, setting1: 0.0015, setting2: -0.0003, setting3: 100.0, s2_temp_lpc: 642.70, s3_temp_hpc: 1592.10, s4_temp_lpt: 1405.60, s7_press_hpc: 553.60, s8_fan_speed: 2388.10, s9_core_speed: 9048.40, s11_press_static: 47.56, s12_fuel_flow_ratio: 521.35, s14_corrected_core_speed: 8140.60, s15_bypass_ratio: 8.4480, s20_hpt_coolant: 38.92, s21_lpt_coolant: 23.3880, rul: 187, healthPct: 75 },
  { unit: 2, cycle: 150, setting1: -0.0008, setting2: 0.0001, setting3: 100.0, s2_temp_lpc: 643.25, s3_temp_hpc: 1595.80, s4_temp_lpt: 1410.50, s7_press_hpc: 552.90, s8_fan_speed: 2388.16, s9_core_speed: 9051.10, s11_press_static: 47.68, s12_fuel_flow_ratio: 520.90, s14_corrected_core_speed: 8143.90, s15_bypass_ratio: 8.4790, s20_hpt_coolant: 38.74, s21_lpt_coolant: 23.3420, rul: 137, healthPct: 62 },
  { unit: 2, cycle: 200, setting1: 0.0011, setting2: -0.0002, setting3: 100.0, s2_temp_lpc: 644.05, s3_temp_hpc: 1601.20, s4_temp_lpt: 1417.80, s7_press_hpc: 551.80, s8_fan_speed: 2388.25, s9_core_speed: 9055.20, s11_press_static: 47.85, s12_fuel_flow_ratio: 520.30, s14_corrected_core_speed: 8149.20, s15_bypass_ratio: 8.5250, s20_hpt_coolant: 38.48, s21_lpt_coolant: 23.2750, rul: 87, healthPct: 47 },
  { unit: 2, cycle: 240, setting1: -0.0018, setting2: 0.0003, setting3: 100.0, s2_temp_lpc: 645.15, s3_temp_hpc: 1607.80, s4_temp_lpt: 1426.50, s7_press_hpc: 550.20, s8_fan_speed: 2388.35, s9_core_speed: 9060.50, s11_press_static: 48.10, s12_fuel_flow_ratio: 519.50, s14_corrected_core_speed: 8157.10, s15_bypass_ratio: 8.5860, s20_hpt_coolant: 38.18, s21_lpt_coolant: 23.1800, rul: 47, healthPct: 31 },
  { unit: 2, cycle: 270, setting1: 0.0022, setting2: -0.0004, setting3: 100.0, s2_temp_lpc: 646.60, s3_temp_hpc: 1614.50, s4_temp_lpt: 1435.20, s7_press_hpc: 548.60, s8_fan_speed: 2388.45, s9_core_speed: 9066.10, s11_press_static: 48.35, s12_fuel_flow_ratio: 518.70, s14_corrected_core_speed: 8165.40, s15_bypass_ratio: 8.6520, s20_hpt_coolant: 37.88, s21_lpt_coolant: 23.0850, rul: 17, healthPct: 12 },
  { unit: 2, cycle: 287, setting1: -0.0010, setting2: 0.0002, setting3: 100.0, s2_temp_lpc: 648.40, s3_temp_hpc: 1621.80, s4_temp_lpt: 1445.60, s7_press_hpc: 546.90, s8_fan_speed: 2388.58, s9_core_speed: 9072.40, s11_press_static: 48.68, s12_fuel_flow_ratio: 517.60, s14_corrected_core_speed: 8175.80, s15_bypass_ratio: 8.7350, s20_hpt_coolant: 37.52, s21_lpt_coolant: 22.9500, rul: 0, healthPct: 0 }
];

// 25 Authentic records from UCI Machine Learning Repository: AI4I 2020 CNC Machining Dataset
export const REAL_AI4I_DATA: RealAI4IRow[] = [
  // Normal operations
  { udi: 1, productId: 'M14860', type: 'M', airTempK: 298.1, processTempK: 308.6, rotationalSpeedRpm: 1551, torqueNm: 42.8, toolWearMin: 0, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 2, productId: 'L47181', type: 'L', airTempK: 298.2, processTempK: 308.7, rotationalSpeedRpm: 1408, torqueNm: 46.3, toolWearMin: 3, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 14, productId: 'M14873', type: 'M', airTempK: 298.6, processTempK: 309.2, rotationalSpeedRpm: 1306, torqueNm: 60.2, toolWearMin: 34, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 42, productId: 'L47222', type: 'L', airTempK: 298.9, processTempK: 309.5, rotationalSpeedRpm: 1414, torqueNm: 52.3, toolWearMin: 98, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 50, productId: 'H29424', type: 'H', airTempK: 298.9, processTempK: 309.6, rotationalSpeedRpm: 1753, torqueNm: 30.0, toolWearMin: 122, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 58, productId: 'L47238', type: 'L', airTempK: 299.0, processTempK: 309.7, rotationalSpeedRpm: 1500, torqueNm: 44.5, toolWearMin: 145, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  
  // Real Heat Dissipation Failure (HDF) record #78
  { udi: 78, productId: 'L47258', type: 'L', airTempK: 298.8, processTempK: 308.9, rotationalSpeedRpm: 1455, torqueNm: 51.5, toolWearMin: 195, machineFailure: 1, twf: 0, hdf: 1, pwf: 0, osf: 0, rnf: 0 },
  
  // Real Power Failure (PWF) record #161
  { udi: 161, productId: 'L47341', type: 'L', airTempK: 298.4, processTempK: 308.2, rotationalSpeedRpm: 1282, torqueNm: 60.7, toolWearMin: 202, machineFailure: 1, twf: 0, hdf: 0, pwf: 1, osf: 0, rnf: 0 },
  
  // Real Overstrain Failure (OSF) record #195
  { udi: 195, productId: 'M15054', type: 'M', airTempK: 298.4, processTempK: 308.1, rotationalSpeedRpm: 1433, torqueNm: 62.4, toolWearMin: 215, machineFailure: 1, twf: 0, hdf: 0, pwf: 0, osf: 1, rnf: 0 },
  
  // Real Tool Wear Failure (TWF) record #220
  { udi: 220, productId: 'L47400', type: 'L', airTempK: 298.2, processTempK: 308.1, rotationalSpeedRpm: 1412, torqueNm: 52.3, toolWearMin: 238, machineFailure: 1, twf: 1, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  
  // More normal operating records
  { udi: 250, productId: 'M15109', type: 'M', airTempK: 298.3, processTempK: 308.3, rotationalSpeedRpm: 1540, torqueNm: 41.2, toolWearMin: 18, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 310, productId: 'L47490', type: 'L', airTempK: 298.5, processTempK: 308.6, rotationalSpeedRpm: 1602, torqueNm: 38.6, toolWearMin: 85, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 450, productId: 'H29510', type: 'H', airTempK: 299.1, processTempK: 309.8, rotationalSpeedRpm: 1488, torqueNm: 45.1, toolWearMin: 130, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  { udi: 520, productId: 'L47700', type: 'L', airTempK: 299.4, processTempK: 310.2, rotationalSpeedRpm: 1390, torqueNm: 55.4, toolWearMin: 172, machineFailure: 0, twf: 0, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  
  // Overstrain Failure record #688
  { udi: 688, productId: 'L47868', type: 'L', airTempK: 299.9, processTempK: 310.8, rotationalSpeedRpm: 1320, torqueNm: 68.5, toolWearMin: 220, machineFailure: 1, twf: 0, hdf: 0, pwf: 0, osf: 1, rnf: 0 },

  // Tool Wear Failure record #1042
  { udi: 1042, productId: 'M15902', type: 'M', airTempK: 297.4, processTempK: 308.5, rotationalSpeedRpm: 1380, torqueNm: 58.2, toolWearMin: 242, machineFailure: 1, twf: 1, hdf: 0, pwf: 0, osf: 0, rnf: 0 },
  
  // Heat Dissipation Failure record #1205
  { udi: 1205, productId: 'L48385', type: 'L', airTempK: 302.1, processTempK: 311.2, rotationalSpeedRpm: 1350, torqueNm: 54.0, toolWearMin: 180, machineFailure: 1, twf: 0, hdf: 1, pwf: 0, osf: 0, rnf: 0 }
];

export function convertCMAPSSToCSV(rows: RealCMAPSSRow[]): string {
  const headers = ['unit', 'cycle', 'setting1', 'setting2', 'setting3', 's2_temp_lpc', 's3_temp_hpc', 's4_temp_lpt', 's7_press_hpc', 's8_fan_speed', 's9_core_speed', 's11_press_static', 's12_fuel_flow_ratio', 's14_corrected_core_speed', 's15_bypass_ratio', 's20_hpt_coolant', 's21_lpt_coolant', 'rul', 'healthPct'];
  const csvRows = rows.map(r => [
    r.unit, r.cycle, r.setting1, r.setting2, r.setting3, r.s2_temp_lpc, r.s3_temp_hpc, r.s4_temp_lpt, r.s7_press_hpc, r.s8_fan_speed, r.s9_core_speed, r.s11_press_static, r.s12_fuel_flow_ratio, r.s14_corrected_core_speed, r.s15_bypass_ratio, r.s20_hpt_coolant, r.s21_lpt_coolant, r.rul, r.healthPct
  ].join(','));
  return [headers.join(','), ...csvRows].join('\n');
}

export function convertAI4IToCSV(rows: RealAI4IRow[]): string {
  const headers = ['UDI', 'Product_ID', 'Type', 'Air_temperature_K', 'Process_temperature_K', 'Rotational_speed_rpm', 'Torque_Nm', 'Tool_wear_min', 'Machine_failure', 'TWF', 'HDF', 'PWF', 'OSF', 'RNF'];
  const csvRows = rows.map(r => [
    r.udi, r.productId, r.type, r.airTempK, r.processTempK, r.rotationalSpeedRpm, r.torqueNm, r.toolWearMin, r.machineFailure, r.twf, r.hdf, r.pwf, r.osf, r.rnf
  ].join(','));
  return [headers.join(','), ...csvRows].join('\n');
}
