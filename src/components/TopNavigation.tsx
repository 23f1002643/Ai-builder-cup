import React from 'react';
import { 
  Activity, 
  Layers, 
  Wrench, 
  Database, 
  Eye, 
  Bot, 
  Zap,
  Radio,
  Sparkles,
  Home
} from 'lucide-react';

export type NavTab = 'startup' | 'fleet' | 'telemetry' | 'work-orders' | 'real-datasets' | 'thermal' | 'copilot';

interface TopNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickScan: () => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  criticalAlertsCount: number;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickScan,
  isStreaming,
  onToggleStreaming,
  criticalAlertsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onSelectTab('startup')}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-950">
            <Activity className="w-5 h-5 text-cyan-100" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Daxoriq
          </span>
        </div>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onSelectTab('startup')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'startup'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('fleet')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'fleet'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fleet Operations</span>
          </button>

          <button
            onClick={() => onSelectTab('telemetry')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'telemetry'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Telemetry & FFT</span>
          </button>

          <button
            onClick={() => onSelectTab('real-datasets')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'real-datasets'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Real NASA Datasets</span>
          </button>

          <button
            onClick={() => onSelectTab('work-orders')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'work-orders'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>CMMS Work Orders</span>
            {criticalAlertsCount > 0 && (
              <span className="text-xs bg-rose-900/80 text-rose-300 font-mono px-1.5 py-0.5 rounded ml-1">
                {criticalAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('thermal')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'thermal'
                ? 'bg-slate-800 text-cyan-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Thermal IR</span>
          </button>

          <button
            onClick={() => onSelectTab('copilot')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'copilot'
                ? 'bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 font-semibold'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Copilot</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleStreaming}
            title={isStreaming ? 'Pause live sensor telemetry ingest' : 'Resume live sensor telemetry ingest'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded border transition-colors whitespace-nowrap ${
              isStreaming
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
            <span>{isStreaming ? 'IoT LIVE' : 'IoT PAUSED'}</span>
          </button>

          {currentTab === 'startup' ? (
            <button
              onClick={() => onSelectTab('fleet')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-md shadow-cyan-950"
            >
              <span>Launch Live Console</span>
            </button>
          ) : (
            <button
              onClick={onOpenQuickScan}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-cyan-950"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Run Fleet Audit</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile navigation strip */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2 pb-1 border-t border-slate-800 mt-2 text-xs">
        <button
          onClick={() => onSelectTab('startup')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'startup' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('fleet')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'fleet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Fleet Operations
        </button>
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'telemetry' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Telemetry & FFT
        </button>
        <button
          onClick={() => onSelectTab('real-datasets')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'real-datasets' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Real Datasets
        </button>
        <button
          onClick={() => onSelectTab('work-orders')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'work-orders' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Work Orders ({criticalAlertsCount})
        </button>
        <button
          onClick={() => onSelectTab('thermal')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'thermal' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
        >
          Thermal
        </button>
        <button
          onClick={() => onSelectTab('copilot')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'copilot' ? 'bg-cyan-950 text-cyan-300' : 'text-cyan-400'}`}
        >
          AI Copilot
        </button>
      </div>
    </header>
  );
};
