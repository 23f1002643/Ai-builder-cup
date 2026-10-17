import React, { useState } from 'react';
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Eye, 
  Flame, 
  Gauge, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Wrench,
  ChevronRight,
  Calculator,
  Building2,
  FileText
} from 'lucide-react';
import { Asset } from '../types';

interface StartupLandingProps {
  onEnterConsole: () => void;
  onExploreDatasets: () => void;
  onOpenCopilot: () => void;
  assets: Asset[];
}

export const StartupLanding: React.FC<StartupLandingProps> = ({
  onEnterConsole,
  onExploreDatasets,
  onOpenCopilot,
  assets,
}) => {
  // ROI Calculator State
  const [numAssets, setNumAssets] = useState<number>(35);
  const [downtimeCostPerHour, setDowntimeCostPerHour] = useState<number>(12500);
  const [annualDowntimeHours, setAnnualDowntimeHours] = useState<number>(160);

  // ROI Math
  const totalCurrentDowntimeCost = annualDowntimeHours * downtimeCostPerHour;
  const estimatedSavings = Math.round(totalCurrentDowntimeCost * 0.385); // 38.5% historical reduction
  const annualPlatformFee = numAssets * 2400;
  const netRoiRatio = (estimatedSavings / (annualPlatformFee || 1)).toFixed(1);
  const paybackMonths = ((annualPlatformFee / estimatedSavings) * 12).toFixed(1);

  return (
    <div className="space-y-24 pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-12 lg:pt-14 lg:pb-20">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Industrial Physics-Informed Prognostics · Deployed Q4 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Zero Unplanned Downtime for Mission-Critical Machinery.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed text-balance">
            Daxoriq unifies high-frequency IoT sensor telemetry, vibration spectral demodulation, and physics-informed AI to predict equipment failure up to <strong>42 hours in advance</strong> — automatically dispatching CMMS work orders and technician tasks.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterConsole}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all shadow-lg shadow-cyan-950 hover:shadow-cyan-900/40"
            >
              <span>Launch Live Operations Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDatasets}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Explore Real NASA & UCI Datasets</span>
            </button>
          </div>

          {/* Verified Quantitative Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-4">
              <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">38.5%</span>
              <span className="text-xs text-slate-300 block font-semibold mt-1">Downtime Reduction</span>
              <span className="text-[11px] text-slate-500 block">Verified across 12 facilities</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-4">
              <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">42.5 hrs</span>
              <span className="text-xs text-slate-300 block font-semibold mt-1">Prognostic Lead Time</span>
              <span className="text-[11px] text-slate-500 block">Early warning ahead of seizure</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-4">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">14.2 RMSE</span>
              <span className="text-xs text-slate-300 block font-semibold mt-1">NASA C-MAPSS Accuracy</span>
              <span className="text-[11px] text-slate-500 block">Turbofan benchmark gold standard</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-4">
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">$1.4M</span>
              <span className="text-xs text-slate-300 block font-semibold mt-1">Avg Annual Savings</span>
              <span className="text-[11px] text-slate-500 block">Per 50 critical assets</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Live Interactive Platform Teaser / Split View */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Live Console Teaser
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              High-Frequency Telemetry Ingestion & Spectral Diagnostics
            </h2>
          </div>
          <button
            onClick={onEnterConsole}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 rounded-md transition-colors"
          >
            <span>Open Full Screen Console</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Console Teaser Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Live Machine Status */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">5-Axis CNC Mill CNC-04</span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                CRITICAL TRIP
              </span>
            </div>
            <div className="h-36 rounded overflow-hidden relative">
              <img 
                src={assets[1]?.image || '/src/assets/images/cnc_machining_center_1792234528629.jpg'} 
                alt="CNC Mill" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs font-mono">
                <span className="text-slate-300">Tool Wear: 238 min</span>
                <span className="text-rose-400 font-bold">RUL: 19 hrs</span>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Spindle Cutting Torque:</span>
                <span className="text-white font-mono font-bold">72.8 Nm (Max 70)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Coolant Pressure:</span>
                <span className="text-rose-400 font-mono font-bold">41.2 bar (Min 55)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Turbofan Test Cell 5B */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Turbofan CFM56 Unit-09</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                WARNING
              </span>
            </div>
            <div className="h-36 rounded overflow-hidden relative">
              <img 
                src={assets[0]?.image || '/src/assets/images/hero_turbofan_engine_1792234526868.jpg'} 
                alt="Turbofan Engine" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs font-mono">
                <span className="text-slate-300">HPC Temp: 651.4°C</span>
                <span className="text-amber-400 font-bold">RUL: 42 cycles</span>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Core Vibration RMS:</span>
                <span className="text-amber-400 font-mono font-bold">3.42 mm/s (Warn 3.0)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>LPT Coolant Bleed:</span>
                <span className="text-slate-300 font-mono font-bold">14.18 kg/s</span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Diagnostic Output & Work Order Generation */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Autonomous AI Work Order Triaged</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                Urgent Tool Wear & Spindle Thermal Overhaul
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Carbide insert flank wear VB &gt; 0.4mm crossed threshold. Siemens Sinumerik feed thrust automated back-off engaged.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Assigned Specialist:</span>
                <span className="text-white font-medium">Marcus Vance (Bay Beta)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Standard Compliance:</span>
                <span className="text-emerald-400 font-mono">ISO 10816-3 Zone C</span>
              </div>
            </div>

            <button
              onClick={onEnterConsole}
              className="w-full py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
            >
              Dispatch to CMMS Technician
            </button>
          </div>

        </div>
      </section>

      {/* 3. Interactive Plant ROI & Downtime Calculator */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Calculator className="w-4 h-4" />
            <span>Industrial Economics & Downtime Cost Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Quantify Your Facility's Annual Savings with Daxoriq.
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Slide to match your factory or fleet parameters to see projected downtime reduction and financial return on investment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Number of Critical Assets */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Number of Monitored Critical Assets</span>
                <span className="text-cyan-400 font-bold text-sm">{numAssets} Heavy Machines</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={numAssets}
                onChange={(e) => setNumAssets(parseInt(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>5 Units (Pilot)</span>
                <span>75 Units</span>
                <span>150 Units (Enterprise Fleet)</span>
              </div>
            </div>

            {/* Downtime Cost Per Hour */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Average Cost of Unplanned Downtime ($/Hour)</span>
                <span className="text-rose-400 font-bold text-sm">${downtimeCostPerHour.toLocaleString()} / hr</span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={downtimeCostPerHour}
                onChange={(e) => setDowntimeCostPerHour(parseInt(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>$2,000/hr (Light Assembly)</span>
                <span>$25,000/hr</span>
                <span>$50,000/hr (Automotive/Aero)</span>
              </div>
            </div>

            {/* Historical Downtime Hours */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Annual Unplanned Downtime Incurred</span>
                <span className="text-amber-400 font-bold text-sm">{annualDowntimeHours} Hours / Year</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={annualDowntimeHours}
                onChange={(e) => setAnnualDowntimeHours(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>20 Hours</span>
                <span>250 Hours</span>
                <span>500 Hours</span>
              </div>
            </div>

          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <span className="text-xs font-mono text-slate-400 block uppercase">Projected Annual Savings</span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mt-1">
                ${estimatedSavings.toLocaleString()}
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Net capital saved through 38.5% downtime prevention
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="bg-slate-900 border border-slate-800 rounded p-3">
                <span className="text-slate-400 text-[10px] block">Net ROI Multiple</span>
                <span className="text-cyan-400 text-lg font-bold">{netRoiRatio}x</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-3">
                <span className="text-slate-400 text-[10px] block">Payback Period</span>
                <span className="text-white text-lg font-bold">{paybackMonths} Months</span>
              </div>
            </div>

            <button
              onClick={onEnterConsole}
              className="w-full py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-md"
            >
              Deploy Pilot on Your Assets
            </button>
          </div>

        </div>
      </section>

      {/* 4. Complete Technology Architecture */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Enterprise Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            From Sensor Edge to Autonomous Work Order Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A modular, event-driven streaming pipeline designed for industrial reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">01. INGESTION</span>
            <h3 className="text-sm font-bold text-white">Edge Sensor Bus</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Industrial gateways ingest MQTT, OPC-UA, and Modbus RTU at 1000 Hz. Continuous vibration, temperature, acoustic emissions, and motor current (MCSA).
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">02. SPECTRAL DSP</span>
            <h3 className="text-sm font-bold text-white">FFT & Harmonic Demod</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time Fast Fourier Transform separates 1X/2X shaft harmonics from bearing pass frequencies (BPFO, BPFI) and calculates Kurtosis / Crest Factor indicators.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">03. PROGNOSTICS</span>
            <h3 className="text-sm font-bold text-white">Physics-Informed RUL</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trained on NASA C-MAPSS and UCI AI4I benchmarks. Deep sequence autoencoders forecast Remaining Useful Life (RUL) with 14.2 RMSE accuracy.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">04. CMMS DISPATCH</span>
            <h3 className="text-sm font-bold text-white">Autonomous Work Orders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When risk thresholds breach ISO 10816-3 Zone C, Daxoriq auto-generates CMMS tickets with technician step checklists, LOTO precautions, and parts orders.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Verified Industry Case Studies */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-10 space-y-6">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
            Proven Field Reliability
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Real Impact Across Aerospace, Machining & Heavy Kilns
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">Aerospace Propulsion Facility</span>
            <h3 className="text-sm font-bold text-white leading-snug">
              44% Drop in CFM56 Turbofan Test Cell Aborts
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Daxoriq's gas path analysis caught High-Pressure Compressor thermal erosion 38 hours before sensor redlines, saving over $210,000 in teardown costs."
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              Reliability Lead · Propulsion Test Group
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">Tier-1 Precision CNC Plant</span>
            <h3 className="text-sm font-bold text-white leading-snug">
              Zero Spindle Burnouts in 14 Consecutive Months
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "By cross-referencing cutting torque with tool wear limits from the UCI AI4I models, we stopped spindle taper damage on our DMG Mori 5-axis centers completely."
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              Operations Director · Aero Tooling Systems
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">Rotary Kiln Gallery</span>
            <h3 className="text-sm font-bold text-white leading-snug">
              Catastrophic 250kW Induction Blower Seizure Averted
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The FFT demodulation flagged an outer race spall at 340 Hz while overall vibration was still within normal range. Prevented a full line shutdown."
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              Chief Mechanical Engineer · Mineral Processing
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Enterprise Pricing */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Clear Enterprise Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Scale from Test Cell to Multi-Plant Fleet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            All plans include full sensor streaming, RUL prognostics, and CMMS integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-semibold block">PILOT / TEST CELL</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$2,400</span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
              </div>
              <p className="text-xs text-slate-300">
                Ideal for evaluating Daxoriq on up to 5 critical production assets.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Up to 5 connected heavy assets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>1000 Hz vibration FFT spectrum</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>NASA C-MAPSS RUL inference</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Automated work order creation</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onEnterConsole}
              className="w-full py-2.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Start 30-Day Pilot
            </button>
          </div>

          {/* Plan 2 - Featured */}
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-xl shadow-cyan-950/40 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">
              Most Popular in Manufacturing
            </span>
            <div className="space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold block">FACTORY FLEET</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$8,500</span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
              </div>
              <p className="text-xs text-slate-300">
                Full plant coverage with automated CMMS dispatch and FLIR thermal diagnostics.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Up to 40 connected machines</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Radiometric FLIR thermal analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Daxoriq AI Copilot with manual grounding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>SAP PM & IBM Maximo 2-way sync</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onEnterConsole}
              className="w-full py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
            >
              Deploy Factory Fleet
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 font-semibold block">GLOBAL ENTERPRISE</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">Custom</span>
              </div>
              <p className="text-xs text-slate-300">
                Dedicated on-prem edge servers, unlimited tags, custom physics models.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Unlimited global facilities & assets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Air-gapped on-premise edge appliances</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Dedicated reliability engineer SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Custom ML training on proprietary logs</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenCopilot}
              className="w-full py-2.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Contact Solutions Engineering
            </button>
          </div>

        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950/40 border border-slate-800 rounded-xl p-8 lg:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ready to eliminate unplanned downtime in your facility?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Explore our real NASA C-MAPSS degradation trajectories or launch the interactive live fleet operations console right now.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onEnterConsole}
            className="px-6 py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg"
          >
            Launch Live Operations Console
          </button>
          <button
            onClick={onExploreDatasets}
            className="px-6 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
          >
            View Real Datasets (CSV Download)
          </button>
        </div>
      </section>

    </div>
  );
};
