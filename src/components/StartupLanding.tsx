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
  const totalCurrentDowntimeCost = annualDowntimeHours * downtimeCostPerHour * numAssets;
  const assumedReductionPct = 10; // Planning assumption only; not a measured Daxoriq result.
  const estimatedSavings = Math.round(totalCurrentDowntimeCost * (assumedReductionPct / 100));


  return (
    <div className="space-y-24 pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-12 lg:pt-14 lg:pb-20">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 rounded-full shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Industrial maintenance intelligence · Interactive prototype</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Help maintenance teams act before small issues become expensive downtime.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed text-balance">
            Explore asset health signals, public maintenance benchmark samples, and AI-assisted work-order drafts. This prototype uses embedded sample records and simulated telemetry; it is not connected to a live factory or a production CMMS.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterConsole}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all shadow-lg shadow-cyan-950 hover:shadow-cyan-900/40"
            >
              <span>Open Operations Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDatasets}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Explore NASA & UCI sample data</span>
            </button>
          </div>

          {/* Prototype capability strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            {[
              { value: String(assets.length), label: 'Demo assets', note: 'Example assets in this prototype' },
              { value: '2', label: 'Public benchmark families', note: 'NASA C-MAPSS and UCI AI4I sample rows' },
              { value: 'AI-assisted', label: 'Maintenance workflow', note: 'Drafts require human review' },
              { value: 'Prototype', label: 'Data connection', note: 'Simulated telemetry; no live plant feed' },
            ].map((metric) => (
              <div key={metric.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{metric.value}</span>
                <span className="text-sm text-slate-700 block font-semibold mt-1">{metric.label}</span>
                <span className="text-xs text-slate-500 block mt-1">{metric.note}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Live Interactive Platform Teaser / Split View */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Interactive console preview
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Sample telemetry & diagnostic workflow
            </h2>
          </div>
          <button
            onClick={onEnterConsole}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/60 rounded-md transition-colors"
          >
            <span>Open Operations Console</span>
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
                <span>AI-assisted work-order draft</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                Review reported tool-wear alert
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Example scenario only: review the reported wear values and supporting evidence before planning maintenance.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Assignment:</span>
                <span className="text-white font-medium">Not connected</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Validation:</span>
                <span className="text-emerald-400 font-mono">Human review</span>
              </div>
            </div>

            <button
              onClick={onEnterConsole}
              className="w-full py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
            >
              Review draft in console
            </button>
          </div>

        </div>
      </section>

      {/* 3. Interactive Plant ROI & Downtime Calculator */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Calculator className="w-4 h-4" />
            <span>Illustrative downtime-cost calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Explore a planning estimate for your facility.
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Adjust these assumptions to estimate the annual cost of downtime and a hypothetical avoided-cost scenario. This is not a forecast or a measured customer result.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Number of Critical Assets */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Number of assets in this illustrative fleet</span>
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
                <span className="text-slate-300">Cost of downtime per asset ($/hour)</span>
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
                <span className="text-slate-300">Annual downtime hours per asset</span>
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
              <span className="text-xs font-mono text-slate-400 block uppercase">Illustrative Avoided Downtime Value</span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mt-1">
                ${estimatedSavings.toLocaleString()}
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Planning illustration using an assumed {assumedReductionPct}% reduction — validate with pilot data
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="bg-slate-900 border border-slate-800 rounded p-3">
                <span className="text-slate-400 text-[10px] block">Assumed avoided share</span>
                <span className="text-cyan-400 text-lg font-bold">{assumedReductionPct}%</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded p-3">
                <span className="text-slate-400 text-[10px] block">Annual downtime exposure</span>
                <span className="text-white text-lg font-bold">${totalCurrentDowntimeCost.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onEnterConsole}
              className="w-full py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-md"
            >
              Open demo operations console
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
            From benchmark samples to human-reviewed maintenance actions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            This prototype demonstrates the workflow with simulated sensor updates; live sensors and production integrations are not connected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">01. INGESTION</span>
            <h3 className="text-sm font-bold text-white">Edge Sensor Bus</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This demo uses simulated UI telemetry. MQTT, OPC-UA, Modbus, and real sensor ingestion are future integration work.
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
              Embedded sample records are available for exploration. A reproducibly trained and evaluated RUL model is not yet included.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold">04. CMMS DISPATCH</span>
            <h3 className="text-sm font-bold text-white">Autonomous Work Orders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The demo can prepare draft work orders for human review. It does not dispatch external tickets or make safety-critical decisions.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Example workflows, not customer case studies */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-10 space-y-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider block">Example scenarios</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">How a maintenance team could use Daxoriq</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-3xl">
            These are illustrative workflows for exploring the product, not claims of deployed customer results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-semibold text-cyan-700">01 · Detect</span>
            <h3 className="font-bold text-slate-900">Review a sensor alert</h3>
            <p className="text-sm text-slate-600">Inspect sample telemetry and identify what additional checks a qualified maintainer should perform.</p>
          </article>
          <article className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-semibold text-cyan-700">02 · Understand</span>
            <h3 className="font-bold text-slate-900">Review evidence</h3>
            <p className="text-sm text-slate-600">Explore public benchmark samples and ask the copilot questions about the data currently shown.</p>
          </article>
          <article className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <span className="text-xs font-semibold text-cyan-700">03 · Coordinate</span>
            <h3 className="font-bold text-slate-900">Draft a work order</h3>
            <p className="text-sm text-slate-600">Turn a reviewed issue into a draft checklist. No external CMMS ticket is dispatched by this demo.</p>
          </article>
        </div>
      </section>

      {/* 6. Prototype scope and roadmap */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">Prototype scope</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Built to validate the workflow before production integration</h2>
          <p className="text-sm text-slate-600">The current build is a demonstrator. The items below require additional engineering before a real-factory rollout.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-slate-900">Available in this demo</h3>
            <p className="text-sm text-slate-600">Interactive asset views, simulated telemetry, selected public benchmark sample rows, AI-assisted chat when configured, and local work-order drafts.</p>
          </article>
          <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-slate-900">Next integration milestones</h3>
            <p className="text-sm text-slate-600">Load full source datasets, train and evaluate a reproducible baseline, connect a real ticketing sandbox, and persist work orders in a database.</p>
          </article>
          <article className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-slate-900">Required before a live pilot</h3>
            <p className="text-sm text-slate-600">Technician validation, site-approved procedures, authentication and audit logs, real sensor ingestion, data permissions, and measured outcomes.</p>
          </article>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 lg:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore industrial maintenance workflows with clearer evidence.
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Explore embedded benchmark samples or open the interactive operations console. The sensor stream is simulated and no live factory is connected.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onEnterConsole}
            className="px-6 py-3 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-lg"
          >
            Open Operations Console
          </button>
          <button
            onClick={onExploreDatasets}
            className="px-6 py-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors"
          >
            View benchmark samples (CSV export)
          </button>
        </div>
      </section>

    </div>
  );
};
