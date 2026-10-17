import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  RotateCcw, 
  Sliders, 
  Wrench, 
  X, 
  Zap,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Asset, SensorMetric } from '../types';

interface FaultSimulatorProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onApplyFault: (updatedAsset: Asset, faultDescription: string) => void;
  onResetAsset: (assetId: string) => void;
}

interface FaultScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: 'WARNING' | 'CRITICAL';
  sensorModifiers: Record<string, number>;
}

export const FaultSimulator: React.FC<FaultSimulatorProps> = ({
  asset,
  isOpen,
  onClose,
  onApplyFault,
  onResetAsset,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('bearing_spall');
  const [vibrationMultiplier, setVibrationMultiplier] = useState<number>(1.8);
  const [tempDelta, setTempDelta] = useState<number>(24);
  const [pressureDeltaPct, setPressureDeltaPct] = useState<number>(-35);

  if (!isOpen) return null;

  const scenarios: FaultScenario[] = [
    {
      id: 'bearing_spall',
      name: 'Outer Race Bearing Spalling (BPFO)',
      category: 'Mechanical Vibration',
      description: 'Micro-pitting and surface spall on bearing outer ring raceway causing periodic high-frequency impacts and lubricant shearing.',
      severity: 'WARNING',
      sensorModifiers: {
        'sens-vib-rms': 4.1,
        'sens-case-vib': 3.6,
        'sens-blower-vib': 5.8,
        'sens-hpc-temp': 662.0,
        'sens-bearing-de-temp': 89.2,
      }
    },
    {
      id: 'coolant_cavitation',
      name: 'Coolant Pump Cavitation & Flow Loss',
      category: 'Thermodynamics & Hydraulics',
      description: 'Vapor bubble formation and implosion on impeller blades leading to pressure loss and rapid thermal dissipation failure.',
      severity: 'CRITICAL',
      sensorModifiers: {
        'sens-coolant-flow': 34.0,
        'sens-sys-pressure': 280.0,
        'sens-lpt-bleed': 12.4,
        'sens-acoustic-emiss': 89.5,
      }
    },
    {
      id: 'tool_wear_saturation',
      name: 'Carbide Tool Flank Wear Saturation',
      category: 'Machining Dynamics',
      description: 'Flank wear land width VB > 0.4 mm triggering excessive chatter, torque oscillation, and micro-welding on workpiece.',
      severity: 'CRITICAL',
      sensorModifiers: {
        'sens-tool-wear': 255.0,
        'sens-spindle-torque': 78.5,
        'sens-acoustic-emiss': 92.0,
      }
    },
    {
      id: 'lube_starvation',
      name: 'Lubrication Starvation & Thermal Runaway',
      category: 'Tribology & Thermal',
      description: 'Lubricant boundary film failure with metal-on-metal contact, accelerating thermal rise and cage friction.',
      severity: 'CRITICAL',
      sensorModifiers: {
        'sens-hpc-temp': 674.0,
        'sens-case-drain-temp': 78.5,
        'sens-bearing-de-temp': 96.0,
        'sens-particulate': 22.4,
      }
    },
    {
      id: 'impeller_unbalance',
      name: 'Rotor Mass Unbalance & Clinker Caking',
      category: 'Rotodynamics',
      description: 'Asymmetric particulate buildup on rotary blades producing heavy 1X synchronous rotational centrifugal forces.',
      severity: 'WARNING',
      sensorModifiers: {
        'sens-blower-vib': 6.8,
        'sens-vib-rms': 4.6,
        'sens-blower-current': 415.0,
      }
    }
  ];

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleExecuteInjection = () => {
    // Clone asset sensors and apply modifiers
    const updatedSensors: SensorMetric[] = asset.sensors.map(sensor => {
      let newVal = sensor.value;
      if (activeScenario.sensorModifiers[sensor.id] !== undefined) {
        newVal = activeScenario.sensorModifiers[sensor.id];
      } else if (sensor.name.toLowerCase().includes('vibrat')) {
        newVal = Number((sensor.value * vibrationMultiplier).toFixed(2));
      } else if (sensor.name.toLowerCase().includes('temp')) {
        newVal = Number((sensor.value + tempDelta).toFixed(1));
      } else if (sensor.name.toLowerCase().includes('press') || sensor.name.toLowerCase().includes('flow')) {
        newVal = Number((sensor.value * (1 + pressureDeltaPct / 100)).toFixed(1));
      }

      const updatedHistory = [...sensor.history.slice(1), newVal];
      return {
        ...sensor,
        value: newVal,
        trend: newVal > sensor.value ? 'UP' : newVal < sensor.value ? 'DOWN' : 'STABLE',
        history: updatedHistory,
      };
    });

    const isCrit = activeScenario.severity === 'CRITICAL';
    const newHealth = isCrit ? Math.min(asset.healthScore, 44) : Math.min(asset.healthScore, 65);
    const newRul = isCrit ? Math.max(8, Math.round(asset.rulHours * 0.35)) : Math.max(22, Math.round(asset.rulHours * 0.6));

    const updatedAsset: Asset = {
      ...asset,
      status: activeScenario.severity,
      healthScore: newHealth,
      rulHours: newRul,
      sensors: updatedSensors,
    };

    onApplyFault(updatedAsset, `${activeScenario.name}: ${activeScenario.description}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Demo Fault Scenario Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Target Asset: <span className="text-cyan-300 font-semibold">{asset.name}</span> ({asset.tag})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Preset Fault Scenarios */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Certified Failure Mode Scenario
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenarios.map(sc => {
                const isSelected = sc.id === selectedScenarioId;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-white truncate max-w-[170px]">
                        {sc.name}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        sc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {sc.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">
                      {sc.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Scenario Details */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Simulated Physical Mechanism & Consequences</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeScenario.description}
            </p>
            <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Predicted Condition</span>
                <span className="text-amber-400 font-bold">{activeScenario.severity} FAILURE RISK</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Expected RUL Impact</span>
                <span className="text-rose-400 font-bold">-45% to -70% Reduction</span>
              </div>
            </div>
          </div>

          {/* Manual Telemetry Fine-Tuning Sliders */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              Adjust Real-Time Telemetry Multipliers
            </label>
            
            {/* Vibration slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Vibration Amplitude Multiplier</span>
                <span className="text-cyan-300 font-bold">{vibrationMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.1"
                value={vibrationMultiplier}
                onChange={(e) => setVibrationMultiplier(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Temperature Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Bearing / HPC Temp Surge</span>
                <span className="text-rose-400 font-bold">+{tempDelta}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={tempDelta}
                onChange={(e) => setTempDelta(parseInt(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Pressure Delta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Coolant & Hydraulic Pressure Variance</span>
                <span className="text-amber-400 font-bold">{pressureDeltaPct}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="30"
                step="5"
                value={pressureDeltaPct}
                onChange={(e) => setPressureDeltaPct(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onResetAsset(asset.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to OEM Baseline</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteInjection}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded transition-colors shadow-lg shadow-amber-950"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Fault & Draft Work Order</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
