import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Activity, 
  TrendingDown, 
  Play, 
  Pause, 
  RotateCcw, 
  Cpu, 
  BarChart3, 
  CheckCircle2, 
  Layers,
  Award
} from 'lucide-react';
import { BENCHMARK_DATASETS } from '../data/benchmarks';
import { BenchmarkDataset, BenchmarkDataPoint } from '../types';

export const BenchmarkStudio: React.FC = () => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<'cmapss' | 'ai4i' | 'bearing_cwru'>('cmapss');
  const [currentCycleIndex, setCurrentCycleIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const dataset: BenchmarkDataset = BENCHMARK_DATASETS.find(d => d.id === selectedDatasetId) || BENCHMARK_DATASETS[0];
  const activeDataPoint: BenchmarkDataPoint = dataset.dataPoints[currentCycleIndex] || dataset.dataPoints[0];

  // Auto-play through cycles
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentCycleIndex(prev => {
          if (prev >= dataset.dataPoints.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, dataset.dataPoints.length]);

  const handleDatasetChange = (id: 'cmapss' | 'ai4i' | 'bearing_cwru') => {
    setSelectedDatasetId(id);
    setCurrentCycleIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Benchmark Sample Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Illustrative interactive trajectories derived from embedded sample points. This page does not run a trained model or report measured evaluation metrics.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {BENCHMARK_DATASETS.map(d => (
            <button
              key={d.id}
              onClick={() => handleDatasetChange(d.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                d.id === selectedDatasetId
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {d.name.split(' ')[0]} {d.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              {dataset.institution}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {dataset.name}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {dataset.description}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs shrink-0 font-mono">
            <span className="text-slate-400 block text-[10px]">Benchmarked Plant Asset</span>
            <span className="text-white font-bold">{dataset.sampleAsset}</span>
          </div>
        </div>

        {/* Evaluation status — no trained model metrics are available in this repository. */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs">
          {[
            ['Source points', 'Embedded illustration'],
            ['RUL model', 'Not included'],
            ['RMSE / MAE', 'Not evaluated'],
            ['Failure lead time', 'Not evaluated'],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="text-slate-500 text-[10px] block">{label}</span>
              <span className="text-slate-800 text-sm font-semibold block mt-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Degradation Trajectory & Sensor Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Run-to-Failure Degradation Curve & Replay Controls */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>Illustrative degradation sequence</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Synthetic points to demonstrate the chart interaction only; not an actual-vs-predicted model evaluation.
              </p>
            </div>

            {/* Play/Pause Replay Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Run' : 'Play illustration'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentCycleIndex(0);
                }}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Trajectory Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Illustrative RUL series
                <span className="w-3 h-0.5 bg-cyan-400 inline-block ml-2" /> Comparison series (synthetic)
              </span>
              <span className="text-white">
                Active Cycle: <strong className="text-cyan-400 font-bold">{activeDataPoint.cycle}</strong>
              </span>
            </div>

            <div className="h-56 w-full relative">
              <svg viewBox="0 0 600 200" className="w-full h-full">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(51, 65, 85, 0.3)" strokeDasharray="4 4" />

                {/* Ground Truth Polyline */}
                {(() => {
                  const maxRul = 200;
                  const actualPoints = dataset.dataPoints.map((pt, idx) => {
                    const x = (idx / (dataset.dataPoints.length - 1)) * 580 + 10;
                    const y = 180 - (pt.rulActual / maxRul) * 150;
                    return `${x},${y}`;
                  }).join(' ');

                  const predictedPoints = dataset.dataPoints.map((pt, idx) => {
                    const x = (idx / (dataset.dataPoints.length - 1)) * 580 + 10;
                    const y = 180 - (pt.rulPredicted / maxRul) * 150;
                    return `${x},${y}`;
                  }).join(' ');

                  const activeX = (currentCycleIndex / (dataset.dataPoints.length - 1)) * 580 + 10;

                  return (
                    <>
                      <polyline points={actualPoints} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                      <polyline points={predictedPoints} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                      
                      {/* Active Cursor Indicator */}
                      <line x1={activeX} y1="10" x2={activeX} y2="190" stroke="#38bdf8" strokeWidth="1.5" />
                      <circle 
                        cx={activeX} 
                        cy={180 - (activeDataPoint.rulPredicted / maxRul) * 150} 
                        r="5" 
                        fill="#38bdf8" 
                        stroke="#0f172a" 
                        strokeWidth="2" 
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Slider to scrub through cycles */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Cycle 10 (Nominal)</span>
                <span>Scrub: Cycle {activeDataPoint.cycle}</span>
                <span>Cycle 206 (Failure)</span>
              </div>
              <input
                type="range"
                min="0"
                max={dataset.dataPoints.length - 1}
                value={currentCycleIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentCycleIndex(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Current Cycle State Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
              <span className="text-slate-400 text-[10px] block">Illustrative RUL</span>
              <span className="text-rose-400 font-bold text-base">{activeDataPoint.rulActual} Cycles</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
              <span className="text-slate-400 text-[10px] block">Comparison value</span>
              <span className="text-cyan-400 font-bold text-base">{activeDataPoint.rulPredicted} Cycles</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
              <span className="text-slate-400 text-[10px] block">Anomaly Deviation</span>
              <span className={`font-bold text-base ${activeDataPoint.anomalyScore > 0.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {(activeDataPoint.anomalyScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
              <span className="text-slate-400 text-[10px] block">HPC Temp (T30)</span>
              <span className="text-white font-bold text-base">{activeDataPoint.s2_temp_hpc} °R</span>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Feature Importance & Industrial Architecture */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Explainability status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-700" />
              <span>Model explainability</span>
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              No trained predictive model or SHAP explanations are bundled with this prototype. The channels below are dataset fields, not ranked causal factors. Train and evaluate a model on the full source data before presenting predictions or feature importance.
            </p>
          </div>

          {/* Dataset Variables List */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Monitored Benchmark Channels</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              {dataset.features.map((feat, i) => (
                <div key={i} className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800">
                  {feat}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
