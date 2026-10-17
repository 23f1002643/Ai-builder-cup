import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Sliders, 
  Sparkles, 
  Wrench,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  Cpu
} from 'lucide-react';
import { Asset, AssetStatus } from '../types';

interface FleetOverviewProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  onOpenFaultSimulator: (asset: Asset) => void;
  onTriggerDiagnosis: (asset: Asset) => void;
  onNavigateToTelemetry: (asset: Asset) => void;
}

export const FleetOverview: React.FC<FleetOverviewProps> = ({
  assets,
  onSelectAsset,
  onOpenFaultSimulator,
  onTriggerDiagnosis,
  onNavigateToTelemetry,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);

  // Compute fleet-wide operational metrics
  const totalAssets = assets.length;
  const nominalCount = assets.filter(a => a.status === 'NOMINAL').length;
  const warningCount = assets.filter(a => a.status === 'WARNING').length;
  const criticalCount = assets.filter(a => a.status === 'CRITICAL').length;
  const avgHealth = Math.round(assets.reduce((sum, a) => sum + a.healthScore, 0) / (totalAssets || 1));
  const avgUptime = (assets.reduce((sum, a) => sum + a.uptimePct, 0) / (totalAssets || 1)).toFixed(1);

  const filteredAssets = assets.filter(asset => {
    const matchesStatus = filterStatus === 'ALL' || asset.status === filterStatus;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asset.bay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'NOMINAL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            NOMINAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            WARNING
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            CRITICAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            MAINTENANCE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Fleet KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fleet Health Index</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">{avgHealth}%</span>
            <span className="text-xs text-emerald-400 font-mono">+2.4% vs last mo</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full ${avgHealth > 80 ? 'bg-emerald-500' : avgHealth > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${avgHealth}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fleet Uptime (OEE)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">{avgUptime}%</span>
            <span className="text-xs text-slate-400 font-mono">Target: 98%</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Unplanned downtime: -38.5% YoY</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Time to Repair</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">1.8h</span>
            <span className="text-xs text-emerald-400 font-mono">-42 min lead</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>Work-order drafts · demo only</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Condition Distribution</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs font-mono tabular-nums">
            <span className="text-emerald-400">{nominalCount} Nominal</span>
            <span className="text-amber-400">{warningCount} Warning</span>
            <span className="text-rose-400">{criticalCount} Critical</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>{totalAssets} Total heavy equipment</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Simulated telemetry feed</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-cyan-400">128</span>
            <span className="text-xs text-slate-400 font-mono">Browser simulation</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Sampling: 1000 Hz broadband</span>
          </div>
        </div>
      </div>

      {/* Interactive Plant Floor Map Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Plant Floor Map & Machinery Bay Layout</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a demo asset to inspect browser-generated sensor values, sample trend lines, and illustrative health indicators.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/80 border border-emerald-400" /> Nominal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/80 border border-amber-400" /> Warning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/80 border border-rose-400" /> Critical
            </span>
          </div>
        </div>

        {/* SVG Plant Floor Map */}
        <div className="relative w-full bg-slate-950 border border-slate-800/80 rounded-lg p-4 overflow-hidden">
          <svg 
            viewBox="0 0 1000 360" 
            className="w-full h-auto select-none font-sans"
          >
            {/* Architectural Grid & Facility Boundary */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="360" fill="url(#grid)" />
            
            {/* Main Central Corridor Walkway */}
            <rect x="50" y="155" width="900" height="50" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(71, 85, 105, 0.4)" strokeDasharray="4 4" />
            <text x="500" y="185" fill="rgba(148, 163, 184, 0.5)" fontSize="11" textAnchor="middle" letterSpacing="2">
              AUTOMATED LOGISTICS & AGV HAULAGE CORRIDOR
            </text>

            {/* Bay 1: Bay Alpha (Turbofan Test Cell 5B) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[0])}
              onMouseEnter={() => setHoveredAssetId(assets[0].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="60" y="30" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[0].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[0].status === 'CRITICAL' ? '#f43f5e' : assets[0].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[0].id ? '2' : '1.2'}
              />
              <text x="75" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">Bay Alpha: Aerospace Test Cell 5B</text>
              <text x="75" y="75" fill="#94a3b8" fontSize="11">Asset: {assets[0].name}</text>
              <text x="75" y="95" fill="#64748b" fontSize="10">Tag: {assets[0].tag} · RUL: {assets[0].rulHours} {assets[0].rulUnit}</text>
              <circle cx="295" cy="50" r="6" fill="#f59e0b" className="animate-pulse" />
              <text x="75" y="122" fill="#cbd5e1" fontSize="10" fontFamily="JetBrains Mono">
                HPC Temp: {assets[0].sensors[0].value}°C · Vib: {assets[0].sensors[1].value}mm/s
              </text>
            </g>

            {/* Bay 2: Bay Beta (Precision CNC Cell) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[1])}
              onMouseEnter={() => setHoveredAssetId(assets[1].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="370" y="30" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[1].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[1].status === 'CRITICAL' ? '#f43f5e' : assets[1].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[1].id ? '2.5' : '1.5'}
              />
              <text x="385" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">Bay Beta: Aero 5-Axis Machining</text>
              <text x="385" y="75" fill="#fca5a5" fontSize="11" fontWeight="600">Asset: {assets[1].name} (CRITICAL)</text>
              <text x="385" y="95" fill="#64748b" fontSize="10">Tag: {assets[1].tag} · RUL: {assets[1].rulHours} {assets[1].rulUnit}</text>
              <circle cx="605" cy="50" r="6" fill="#f43f5e" className="animate-pulse" />
              <text x="385" y="122" fill="#f87171" fontSize="10" fontFamily="JetBrains Mono">
                Tool Wear: 238m (Max 230) · Torque: 72.8Nm
              </text>
            </g>

            {/* Bay 3: Bay Gamma (Heavy Press Line) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[2])}
              onMouseEnter={() => setHoveredAssetId(assets[2].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="680" y="30" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[2].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[2].status === 'CRITICAL' ? '#f43f5e' : assets[2].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[2].id ? '2' : '1.2'}
              />
              <text x="695" y="55" fill="#f8fafc" fontSize="13" fontWeight="bold">Bay Gamma: High-Pressure Hydraulics</text>
              <text x="695" y="75" fill="#94a3b8" fontSize="11">Asset: {assets[2].name}</text>
              <text x="695" y="95" fill="#64748b" fontSize="10">Tag: {assets[2].tag} · RUL: {assets[2].rulHours} {assets[2].rulUnit}</text>
              <circle cx="915" cy="50" r="5" fill="#10b981" />
              <text x="695" y="122" fill="#86efac" fontSize="10" fontFamily="JetBrains Mono">
                Fluid: 342.1 bar · Health: {assets[2].healthScore}%
              </text>
            </g>

            {/* Bay 4: Utility Mechanical Room (Chiller) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[3])}
              onMouseEnter={() => setHoveredAssetId(assets[3].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="60" y="220" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[3].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[3].status === 'CRITICAL' ? '#f43f5e' : assets[3].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[3].id ? '2' : '1.2'}
              />
              <text x="75" y="245" fill="#f8fafc" fontSize="13" fontWeight="bold">Utility Plant: HVAC Chiller Plant</text>
              <text x="75" y="265" fill="#94a3b8" fontSize="11">Asset: {assets[3].name}</text>
              <text x="75" y="285" fill="#64748b" fontSize="10">Tag: {assets[3].tag} · RUL: {assets[3].rulHours} {assets[3].rulUnit}</text>
              <circle cx="295" cy="240" r="5" fill="#10b981" />
              <text x="75" y="312" fill="#cbd5e1" fontSize="10" fontFamily="JetBrains Mono">
                Suction: 3.48 bar · Diff: 1.82 bar
              </text>
            </g>

            {/* Bay 5: Bay Delta (Kiln Exhaust Gallery) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[4])}
              onMouseEnter={() => setHoveredAssetId(assets[4].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="370" y="220" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[4].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[4].status === 'CRITICAL' ? '#f43f5e' : assets[4].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[4].id ? '2' : '1.2'}
              />
              <text x="385" y="245" fill="#f8fafc" fontSize="13" fontWeight="bold">Bay Delta: Kiln Exhaust Gallery</text>
              <text x="385" y="265" fill="#fde68a" fontSize="11">Asset: {assets[4].name}</text>
              <text x="385" y="285" fill="#64748b" fontSize="10">Tag: {assets[4].tag} · RUL: {assets[4].rulHours} {assets[4].rulUnit}</text>
              <circle cx="605" cy="240" r="6" fill="#f59e0b" className="animate-pulse" />
              <text x="385" y="312" fill="#fde047" fontSize="10" fontFamily="JetBrains Mono">
                DE Temp: 84.6°C · Vib: 4.88 mm/s
              </text>
            </g>

            {/* Bay 6: Bay Epsilon (Polymer Compounding) */}
            <g 
              onClick={() => onNavigateToTelemetry(assets[5])}
              onMouseEnter={() => setHoveredAssetId(assets[5].id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect 
                x="680" y="220" width="260" height="110" rx="6"
                fill={hoveredAssetId === assets[5].id ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)'}
                stroke={assets[5].status === 'CRITICAL' ? '#f43f5e' : assets[5].status === 'WARNING' ? '#f59e0b' : '#10b981'}
                strokeWidth={hoveredAssetId === assets[5].id ? '2' : '1.2'}
              />
              <text x="695" y="245" fill="#f8fafc" fontSize="13" fontWeight="bold">Bay Epsilon: Polymer Compounding</text>
              <text x="695" y="265" fill="#94a3b8" fontSize="11">Asset: {assets[5].name}</text>
              <text x="695" y="285" fill="#64748b" fontSize="10">Tag: {assets[5].tag} · RUL: {assets[5].rulHours} {assets[5].rulUnit}</text>
              <circle cx="915" cy="240" r="5" fill="#10b981" />
              <text x="695" y="312" fill="#cbd5e1" fontSize="10" fontFamily="JetBrains Mono">
                Melt: 148.5 bar · Zone 4: 232°C
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Asset Directory & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets ({totalAssets})
            </button>
            <button
              onClick={() => setFilterStatus('CRITICAL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'CRITICAL'
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilterStatus('WARNING')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'WARNING'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Warning ({warningCount})
            </button>
            <button
              onClick={() => setFilterStatus('NOMINAL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterStatus === 'NOMINAL'
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Nominal ({nominalCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tag, bay, or machine name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map(asset => {
            const isCritical = asset.status === 'CRITICAL';
            const isWarning = asset.status === 'WARNING';

            return (
              <div 
                key={asset.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg overflow-hidden flex flex-col transition-all duration-200"
              >
                {/* Header Image + Status Strip */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img 
                    src={asset.image} 
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Top Overlay Badge & Location */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 backdrop-blur-sm">
                      {asset.tag}
                    </span>
                    <div className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 backdrop-blur-sm">
                      {getStatusBadge(asset.status)}
                    </div>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-sm font-bold text-white tracking-tight truncate">
                      {asset.name}
                    </h3>
                    <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{asset.bay}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content & Metrics */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Health Score & RUL Strip */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-md p-2.5">
                    <div>
                      <div className="text-[11px] text-slate-400">Health Index</div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={`text-lg font-bold font-mono tabular-nums ${
                          asset.healthScore > 80 ? 'text-emerald-400' : asset.healthScore > 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {asset.healthScore}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {asset.uptimePct}% Up
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Remaining Useful Life</div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={`text-lg font-bold font-mono tabular-nums ${
                          asset.rulHours < 25 ? 'text-rose-400 animate-pulse' : asset.rulHours < 50 ? 'text-amber-400' : 'text-cyan-400'
                        }`}>
                          {asset.rulHours}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {asset.rulUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Sensor Gauges preview */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Primary Telemetry Channels</span>
                      <span className="font-mono text-[10px] text-slate-500">3s simulated update</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {asset.sensors.slice(0, 2).map(sensor => {
                        const isOverWarning = sensor.value >= sensor.warningThreshold;
                        return (
                          <div key={sensor.id} className="bg-slate-950/40 border border-slate-800/50 rounded p-1.5">
                            <div className="text-[10px] text-slate-400 truncate">{sensor.name}</div>
                            <div className={`font-semibold tabular-nums mt-0.5 ${isOverWarning ? 'text-amber-400' : 'text-slate-200'}`}>
                              {sensor.value} {sensor.unit}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons Strip */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenFaultSimulator(asset)}
                      title="Inject simulated faults like bearing spalls or coolant starvation"
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded border border-slate-700 transition-colors whitespace-nowrap"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Inject Fault</span>
                    </button>

                    <button
                      onClick={() => onTriggerDiagnosis(asset)}
                      title="Trigger Gemini AI Root Cause Analysis"
                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs text-cyan-300 hover:text-cyan-100 bg-cyan-950/60 hover:bg-cyan-900/60 rounded border border-cyan-800/60 transition-colors whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Diagnosis</span>
                    </button>

                    <button
                      onClick={() => onNavigateToTelemetry(asset)}
                      title="Open full telemetry stream and FFT spectrum"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded border border-slate-700 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
