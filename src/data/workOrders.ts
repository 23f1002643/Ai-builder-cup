import { WorkOrder } from '../types';

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2026-0891',
    assetId: 'asset-cnc-04',
    assetName: '5-Axis Machining Center CNC-04',
    title: 'Urgent Tool Wear & Spindle Thermal Dissipation Overhaul',
    priority: 'P1-CRITICAL',
    status: 'DISPATCHED',
    createdAt: '2026-10-17 02:40',
    triggerReason: 'Automated AI Rule: Cumulative tool wear exceeded 230 min + spindle torque > 70 Nm',
    assignedTechnician: 'Marcus Vance (Senior Mechatronics Specialist)',
    estimatedDurationMinutes: 120,
    safetyPrecautions: [
      'Lock-out/Tag-out 480V Siemens Power Supply & pneumatic 6 bar supply line',
      'Wait 15 minutes for spindle chiller loop temperature to normalize',
      'Wear Kevlar Level 5 cut-resistant gloves when handling carbide end mills'
    ],
    tasks: [
      { step: 1, instruction: 'Isolate machine power at Bay Beta Main Distribution Panel (Breaker B-4)', verified: true },
      { step: 2, instruction: 'Inspect spindle taper runout using digital dial indicator (tolerance < 0.003 mm)', verified: true },
      { step: 3, instruction: 'Index and replace tool carousel pocket #7 and #12 with new Walter Walter Prototyp carbide inserts', verified: false },
      { step: 4, instruction: 'Flush chiller circuit filter strainer and check coolant refractive brix (nominal 8-10%)', verified: false },
      { step: 5, instruction: 'Execute dry run calibration G-code cycle and verify acoustic emission stays < 74 dBA', verified: false }
    ],
    consumableParts: [
      { sku: 'WLT-INSERT-TNMG', name: 'Walter Carbide Turning Inserts (Box of 10)', quantity: 2, unit: 'sets' },
      { sku: 'BLA-COOL-SYN90', name: 'Blaser Swisslube Synthetic Coolant 20L', quantity: 1, unit: 'can' },
      { sku: 'CLN-FLT-50M', name: '50 Micron Stainless Filter Screen', quantity: 2, unit: 'pcs' }
    ]
  },
  {
    id: 'WO-2026-0888',
    assetId: 'asset-blower-02',
    assetName: 'Rotary Kiln Induction Blower KB-02',
    title: 'Drive-End Bearing Vibration & Temperature Investigation',
    priority: 'P2-HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-16 19:15',
    triggerReason: 'Vibration velocity crossed ISO 10816-3 Zone C boundary (4.88 mm/s) + DE Temp 84.6°C',
    assignedTechnician: 'Elena Rostova (Condition Monitoring Engineer)',
    estimatedDurationMinutes: 90,
    safetyPrecautions: [
      'Hot work PPE required: high-temperature gloves and face shield near kiln gallery',
      'Confirm VFD bypass is disabled and motor locked out'
    ],
    tasks: [
      { step: 1, instruction: 'Verify zero rotation and apply shaft locking pin', verified: true },
      { step: 2, instruction: 'Perform stroboscopic visual inspection of impeller blades for clinker buildup', verified: true },
      { step: 3, instruction: 'Grease drive-end spherical roller bearing with Mobilith SHC 220 (45 grams)', verified: true },
      { step: 4, instruction: 'Run single-plane field dynamic balance test with dual accelerometer analyzer', verified: false }
    ],
    consumableParts: [
      { sku: 'MOB-SHC-220', name: 'Mobilith SHC 220 High-Temp Synthetic Grease', quantity: 1, unit: 'cartridge' },
      { sku: 'SKF-WSH-60', name: 'V-Ring Rubber Dust Seal 60mm', quantity: 1, unit: 'pcs' }
    ]
  },
  {
    id: 'WO-2026-0874',
    assetId: 'asset-turbofan-09',
    assetName: 'Turbofan Turbine Unit-09',
    title: 'High-Pressure Compressor Bleed Valve & Thermocouple Calibration',
    priority: 'P2-HIGH',
    status: 'TRIGGERED',
    createdAt: '2026-10-17 01:10',
    triggerReason: 'LPT coolant bleed dropped below 14.2 kg/s; T30 HPC outlet temperature elevated',
    assignedTechnician: 'Unassigned (Awaiting Bay Alpha Lead)',
    estimatedDurationMinutes: 180,
    safetyPrecautions: [
      'Fuel manifold depressurization and grounding strap verification',
      'Borescope inspection requires cooled engine (<50°C gas path)'
    ],
    tasks: [
      { step: 1, instruction: 'Connect test bench FADEC diagnostic harness to Channel A/B', verified: false },
      { step: 2, instruction: 'Perform guide vane actuator pneumatic sweep from 0 to 100%', verified: false },
      { step: 3, instruction: 'Borescope inspection of HPC Stage 4 stator vanes and blade leading edges', verified: false },
      { step: 4, instruction: 'Check thermocouple resistance matching against calibration curve', verified: false }
    ],
    consumableParts: [
      { sku: 'GE-TC-KTYPE', name: 'Type-K Inconel Sheathed Thermocouple Probe', quantity: 2, unit: 'pcs' },
      { sku: 'AER-SEAL-HPC', name: 'High-Temp Metal O-Ring Seal Kit', quantity: 1, unit: 'sets' }
    ]
  },
  {
    id: 'WO-2026-0860',
    assetId: 'asset-hydraulic-12',
    assetName: 'Hydraulic Piston Pump Unit HP-12',
    title: 'Quarterly High-Pressure Filter Replacement & Fluid Spectroscopy',
    priority: 'P4-LOW',
    status: 'RESOLVED',
    createdAt: '2026-10-14 09:00',
    triggerReason: 'Preventive Maintenance Schedule Interval (4,000 hrs operating)',
    assignedTechnician: 'David Cho (Hydraulics Tech)',
    estimatedDurationMinutes: 60,
    safetyPrecautions: [
      'Depressurize accumulator bank with bleed needle valve prior to manifold servicing'
    ],
    tasks: [
      { step: 1, instruction: 'Drain pressure line and confirm gauge reads 0 bar', verified: true },
      { step: 2, instruction: 'Replace 5-micron high-pressure filter cartridge', verified: true },
      { step: 3, instruction: 'Draw 200ml fluid sample from minimess test point for lab particle count', verified: true },
      { step: 4, instruction: 'Re-pressurize to 350 bar and check valve block for micro-leaks', verified: true }
    ],
    consumableParts: [
      { sku: 'RX-FLT-05M', name: 'Rexroth High Pressure Filter Element 05µm', quantity: 1, unit: 'pcs' },
      { sku: 'SHELL-VG46', name: 'Shell Tellus S2 VX 46 Hydraulic Oil', quantity: 5, unit: 'liters' }
    ]
  }
];
