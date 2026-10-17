import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Maximize2, 
  Radio, 
  RotateCcw, 
  Sparkles, 
  Sliders,
  Wrench,
  Download,
  Info
} from 'lucide-react';
import { Asset, SensorMetric, DiagnosticReport } from '../types';

interface TelemetryViewProps {
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
  onOpenFaultSimulator: (asset: Asset) => void;
  onOpenWorkOrderFromDiagnosis: (asset: Asset, diagnosis: DiagnosticReport) => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
  onOpenFaultSimulator,
  onOpenWorkOrderFromDiagnosis,
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>(selectedAsset.sensors[0].id);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  const [spectrumMode, setSpectrumMode] = useState<'FFT' | 'TIME_WAVE'>('FFT');

  const fftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync selected sensor if asset changes
  useEffect(() => {
    if (!selectedAsset.sensors.find(s => s.id === selectedSensorId)) {
      setSelectedSensorId(selectedAsset.sensors[0].id);
    }
  }, [selectedAsset]);

  const activeSensor = selectedAsset.sensors.find(s => s.id === selectedSensorId) || selectedAsset.sensors[0];

  // Draw real-time FFT / Vibration Waveform on Canvas
  useEffect(() => {
    const canvas = fftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 40; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const isWarning = selectedAsset.status === 'WARNING';
      const isCritical = selectedAsset.status === 'CRITICAL';

      if (spectrumMode === 'FFT') {
        // Draw FFT Frequency Spectrum (0 to 500 Hz)
        const numBins = 64;
        const binWidth = (canvas.width - 60) / numBins;

        ctx.fillStyle = isCritical ? 'rgba(244, 63, 94, 0.7)' : isWarning ? 'rgba(245, 158, 11, 0.7)' : 'rgba(6, 182, 212, 0.7)';
        ctx.strokeStyle = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#06b6d4';
        ctx.lineWidth = 1.5;

        // Baseline noise floor
        for (let i = 0; i < numBins; i++) {
          const freq = (i / numBins) * 500;
          let amp = Math.sin(i * 0.3 + phase) * 6 + 12 + Math.random() * 4;

          // 1X Running speed peak (~120 Hz)
          if (Math.abs(freq - 120) < 15) {
            amp += (isCritical ? 95 : isWarning ? 65 : 35);
          }
          // 2X Harmonic (~240 Hz)
          if (Math.abs(freq - 240) < 12) {
            amp += (isCritical ? 60 : isWarning ? 35 : 15);
          }
          // Defect frequency spike (e.g. Bearing BPFO ~340 Hz)
          if (Math.abs(freq - 340) < 10) {
            amp += (isCritical ? 80 : isWarning ? 45 : 8);
          }

          const barHeight = Math.min(canvas.height - 30, amp * 1.4);
          const x = 50 + i * binWidth;
          const y = canvas.height - 25 - barHeight;

          ctx.fillRect(x, y, binWidth - 2, barHeight);
          ctx.strokeRect(x, y, binWidth - 2, barHeight);
        }

        // Draw ISO Alarm Threshold line
        const thresholdY = canvas.height - 25 - 110;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(50, thresholdY);
        ctx.lineTo(canvas.width - 10, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('ISO 10816-3 Zone C Alarm (4.5 mm/s)', canvas.width - 240, thresholdY - 6);

        // Axis labels
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('0 Hz', 50, canvas.height - 8);
        ctx.fillText('120 Hz (1X)', 170, canvas.height - 8);
        ctx.fillText('240 Hz (2X)', 310, canvas.height - 8);
        ctx.fillText('340 Hz (BPFO)', 430, canvas.height - 8);
        ctx.fillText('500 Hz', canvas.width - 40, canvas.height - 8);

      } else {
        // Time-Domain Raw Accelerometer Waveform
        ctx.beginPath();
        ctx.strokeStyle = isCritical ? '#f43f5e' : isWarning ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 2;

        const baselineY = canvas.height / 2;
        for (let x = 50; x < canvas.width - 10; x++) {
          const t = (x + phase * 20) * 0.05;
          let y = baselineY + Math.sin(t) * 30 + Math.sin(t * 2.8) * 15 + Math.sin(t * 7.5) * (isCritical ? 35 : 10);
          if (x === 50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('Amplitude [g]', 10, 15);
        ctx.fillText('Time [ms]', canvas.width - 60, canvas.height - 8);
      }

      phase += 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [spectrumMode, selectedAsset]);

  // Request a diagnostic draft from the configured AI service.
  const handleRunAiDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnosticError(null);
    setDiagnosticReport(null);
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: selectedAsset,
          currentSensors: selectedAsset.sensors.map(s => ({ name: s.name, value: s.value, unit: s.unit })),
          telemetryHistory: activeSensor.history,
        }),
      });

      const report = await response.json();
      if (!response.ok) {
        throw new Error(report?.error || `Diagnostic service returned HTTP ${response.status}`);
      }
      setDiagnosticReport(report);
    } catch (err) {
      console.error('Diagnostic request failed:', err);
      setDiagnosticError(err instanceof Error
        ? err.message
        : 'The AI diagnosis could not be generated. No diagnosis was produced.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div role="note" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <strong>Demo mode:</strong> sensor readings and the waveform below are simulated in the browser. AI output is advisory only and must be reviewed by a qualified maintainer.
      </div>
      {diagnosticError && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{diagnosticError}</span>
          <button type="button" onClick={() => setDiagnosticError(null)} className="rounded-lg px-2 py-1 font-semibold hover:bg-rose-100" aria-label="Dismiss diagnostic error">Dismiss</button>
        </div>
      )}
      
      {/* Top Asset Selector & Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
            <img 
              src={selectedAsset.image} 
              alt={selectedAsset.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {selectedAsset.name}
              </h2>
              <span className="text-xs font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                {selectedAsset.tag}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{selectedAsset.bay}</span>
              <span>·</span>
              <span>Model: {selectedAsset.model}</span>
              <span>·</span>
              <span>SN: {selectedAsset.serialNo}</span>
            </div>
          </div>
        </div>

        {/* Machine Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Switch Asset:</span>
          {assets.map(a => (
            <button
              key={a.id}
              onClick={() => onSelectAsset(a)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap ${
                a.id === selectedAsset.id
                  ? 'bg-cyan-950 border-cyan-600 text-cyan-300 font-semibold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {a.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Telemetry & Spectral Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Real-Time Waveform & FFT Spectrum + Multi-Channel Sensors */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Canvas Spectrum Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Spectral Vibration & Harmonic Defect Analysis</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-frequency accelerometer demodulation & harmonic orders (1X, 2X, BPFO inner/outer race pass)
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                <button
                  onClick={() => setSpectrumMode('FFT')}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    spectrumMode === 'FFT' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  FFT Spectrum
                </button>
                <button
                  onClick={() => setSpectrumMode('TIME_WAVE')}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    spectrumMode === 'TIME_WAVE' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Time Waveform
                </button>
              </div>
            </div>

            {/* FFT Canvas */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-md overflow-hidden p-2">
              <canvas 
                ref={fftCanvasRef} 
                width={700} 
                height={240} 
                className="w-full h-auto block"
              />
            </div>

            {/* Spectral Metrics Bar */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2">
                <span className="text-slate-400 block text-[10px]">1X Peak Amplitude</span>
                <span className="text-white font-bold text-sm">2.45 mm/s</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2">
                <span className="text-slate-400 block text-[10px]">Harmonic Distortion</span>
                <span className="text-amber-400 font-bold text-sm">18.4% THD</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2">
                <span className="text-slate-400 block text-[10px]">Crest Factor</span>
                <span className="text-cyan-400 font-bold text-sm">3.82</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded p-2">
                <span className="text-slate-400 block text-[10px]">Kurtosis Index</span>
                <span className="text-rose-400 font-bold text-sm">4.19 (Pitted)</span>
              </div>
            </div>
          </div>

          {/* Time Series Multi-Channel Sensor Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Continuous Time-Series Telemetry Trend
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspecting: <span className="text-cyan-300 font-medium">{activeSensor.name}</span>
                </p>
              </div>

              {/* Sensor Channel Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {selectedAsset.sensors.map(sensor => (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensorId(sensor.id)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap ${
                      sensor.id === activeSensor.id
                        ? 'bg-slate-800 border-cyan-500/80 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sensor.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Time Series Plot */}
            <div className="bg-slate-950 border border-slate-800 rounded-md p-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Value: <strong className="text-white">{activeSensor.value} {activeSensor.unit}</strong></span>
                <span>Warning Limit: <strong className="text-amber-400">{activeSensor.warningThreshold} {activeSensor.unit}</strong></span>
                <span>Critical Limit: <strong className="text-rose-400">{activeSensor.criticalThreshold} {activeSensor.unit}</strong></span>
              </div>

              <div className="h-44 w-full relative">
                <svg viewBox="0 0 500 160" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(244, 63, 94, 0.3)" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(245, 158, 11, 0.3)" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(51, 65, 85, 0.3)" />

                  {/* Sensor Data Polyline */}
                  {(() => {
                    const min = Math.min(...activeSensor.history) * 0.95;
                    const max = Math.max(...activeSensor.history, activeSensor.criticalThreshold) * 1.05;
                    const range = (max - min) || 1;

                    const points = activeSensor.history.map((val, idx) => {
                      const x = (idx / (activeSensor.history.length - 1)) * 500;
                      const y = 150 - ((val - min) / range) * 130;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline 
                          points={points} 
                          fill="none" 
                          stroke="#06b6d4" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                        {activeSensor.history.map((val, idx) => {
                          const x = (idx / (activeSensor.history.length - 1)) * 500;
                          const y = 150 - ((val - min) / range) * 130;
                          return (
                            <circle 
                              key={idx} 
                              cx={x} 
                              cy={y} 
                              r={idx === activeSensor.history.length - 1 ? 5 : 3} 
                              fill={idx === activeSensor.history.length - 1 ? '#38bdf8' : '#0891b2'} 
                              stroke="#0f172a"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2">
                <span>T - 10 min</span>
                <span>T - 5 min</span>
                <span>T - 2 min</span>
                <span>Live Now (Latest Sample)</span>
              </div>
            </div>

            {/* Quick Sensor Channels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {selectedAsset.sensors.map(s => {
                const isOver = s.value >= s.warningThreshold;
                return (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedSensorId(s.id)}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      s.id === activeSensor.id
                        ? 'bg-slate-800/90 border-cyan-500 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400 truncate">{s.name}</div>
                    <div className={`text-base font-bold font-mono tabular-nums mt-1 ${isOver ? 'text-amber-400' : 'text-white'}`}>
                      {s.value} <span className="text-xs font-normal text-slate-400">{s.unit}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Nominal: {s.nominalMin}-{s.nominalMax}</span>
                      <span className={s.trend === 'UP' ? 'text-rose-400' : s.trend === 'DOWN' ? 'text-cyan-400' : 'text-slate-400'}>
                        {s.trend === 'UP' ? '▲ Up' : s.trend === 'DOWN' ? '▼ Down' : '— Flat'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col: AI Predictive Diagnostic Panel & Root Cause Engine */}
        <div className="space-y-6">
          
          {/* Machine Health & RUL Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-3">
              Prognostic State & Remaining Useful Life (RUL)
            </h3>
            
            <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Health Index</span>
                <span className={`text-xl font-bold font-mono tabular-nums ${
                  selectedAsset.healthScore > 80 ? 'text-emerald-400' : selectedAsset.healthScore > 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {selectedAsset.healthScore} / 100
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className={`h-full ${
                    selectedAsset.healthScore > 80 ? 'bg-emerald-500' : selectedAsset.healthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${selectedAsset.healthScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
                <span className="text-slate-400 block text-[11px]">Forecasted RUL</span>
                <span className={`text-lg font-bold font-mono tabular-nums ${
                  selectedAsset.rulHours < 25 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}>
                  {selectedAsset.rulHours} {selectedAsset.rulUnit}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded p-2.5">
                <span className="text-slate-400 block text-[11px]">Operating Hours</span>
                <span className="text-lg font-bold font-mono tabular-nums text-white">
                  {selectedAsset.operatingHours} hrs
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                onClick={handleRunAiDiagnosis}
                disabled={isDiagnosing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded border border-cyan-500/50 transition-colors shadow-sm disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isDiagnosing ? 'animate-spin' : ''}`} />
                <span>{isDiagnosing ? 'Running Root-Cause Inference...' : 'Run Gemini AI Diagnostics'}</span>
              </button>

              <button
                onClick={() => onOpenFaultSimulator(selectedAsset)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 rounded border border-amber-800/60 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Fault Injection</span>
              </button>
            </div>
          </div>

          {/* AI Diagnostic Output */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center justify-between">
              <span>Root Cause Diagnosis</span>
              {diagnosticReport && (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {diagnosticReport.confidenceScore == null ? 'AI triage · confidence not calibrated' : `AI-assessed: ${diagnosticReport.confidenceScore}% (not calibrated)`}
                </span>
              )}
            </h3>

            {diagnosticReport ? (
              <div className="space-y-3.5 text-xs">
                
                {/* Fault Type & Severity */}
                <div className="bg-slate-950 border border-slate-800 rounded p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">
                      {diagnosticReport.faultType}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      diagnosticReport.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      diagnosticReport.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {diagnosticReport.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mt-1">
                    {diagnosticReport.rootCauseSummary}
                  </p>
                </div>

                {/* ISO Standards & Urgency */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="bg-slate-950 border border-slate-800 rounded p-2">
                    <span className="text-slate-400 block text-[10px]">Failure probability (72h)</span>
                    <span className="text-rose-400 font-bold">{diagnosticReport.failureProbability72h == null ? 'Not estimated' : `${diagnosticReport.failureProbability72h}% · not model-validated`}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded p-2">
                    <span className="text-slate-400 block text-[10px]">Estimated repair duration</span>
                    <span className="text-white font-bold">{diagnosticReport.estimatedRepairHours == null ? 'Not estimated' : `${diagnosticReport.estimatedRepairHours} hrs · unverified`}</span>
                  </div>
                </div>

                {/* Compliance info */}
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-cyan-400">Standard: </strong>
                  {diagnosticReport.standardsCompliance}
                </div>

                {/* Recommended Technician Action */}
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Suggested next step (human review):</span>
                  </div>
                  <p className="text-slate-300">
                    {diagnosticReport.recommendedAction}
                  </p>
                </div>

                {/* Required Spare Parts */}
                {diagnosticReport.requiredParts && diagnosticReport.requiredParts.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[11px] font-medium">Possible parts (unverified):</span>
                    <div className="space-y-1">
                      {diagnosticReport.requiredParts.map((part, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] bg-slate-950 px-2 py-1.5 rounded border border-slate-800">
                          <span className="font-mono text-cyan-300">{part.partNumber}</span>
                          <span className="text-slate-300 truncate max-w-[140px]">{part.description}</span>
                          <span className={part.inStock ? 'text-emerald-400' : 'text-rose-400'}>
                            {part.inStock == null ? 'Not checked' : part.inStock ? 'In stock' : 'Not in stock'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto Work Order Button */}
                <button
                  onClick={() => onOpenWorkOrderFromDiagnosis(selectedAsset, diagnosticReport)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-cyan-200 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 rounded transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Create maintenance draft</span>
                </button>

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Info className="w-6 h-6 mx-auto text-slate-600" />
                <p className="text-xs">
                  Run an AI-assisted qualitative triage on the selected demo asset. There is no trained predictive model or connected OEM manual source.
                </p>
              </div>
            )}
          </div>

          {/* OEM Technical Manual Excerpt */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Sample maintenance notes · demo</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {selectedAsset.manuals.map((manual, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded p-2.5 space-y-1">
                  <div className="font-bold text-cyan-300 text-[11px]">{manual.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{manual.section}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {manual.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
