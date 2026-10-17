import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Printer,
  Sparkles,
  Download
} from 'lucide-react';
import { Asset } from '../types';

interface FleetScanModalProps {
  assets: Asset[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAssetAndTab: (asset: Asset) => void;
}

export const FleetScanModal: React.FC<FleetScanModalProps> = ({
  assets,
  isOpen,
  onClose,
  onSelectAssetAndTab,
}) => {
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setScanProgress(0);
      setIsScanning(true);
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 20;
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const criticalAssets = assets.filter(a => a.status === 'CRITICAL');
  const warningAssets = assets.filter(a => a.status === 'WARNING');
  const nominalAssets = assets.filter(a => a.status === 'NOMINAL');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Automated Fleet Health & Sensor Telemetry Audit
              </h3>
              <p className="text-xs text-slate-400">
                128 multi-modal sensor channels scanned across 6 production machinery bays
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Progress Bar */}
          {isScanning ? (
            <div className="space-y-2 py-8 text-center">
              <Sparkles className="w-8 h-8 mx-auto text-cyan-400 animate-spin" />
              <div className="text-sm font-semibold text-white">
                Auditing IoT streams, harmonic spectral orders, and RUL degradation curves...
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden max-w-md mx-auto mt-3">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-300" 
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-cyan-400">{scanProgress}% Completed</div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-slate-950 border border-slate-800 rounded p-3">
                  <span className="text-slate-400 text-[10px] block">Nominal Equipment</span>
                  <span className="text-emerald-400 text-lg font-bold">{nominalAssets.length} Units</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Zero variance</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-3">
                  <span className="text-slate-400 text-[10px] block">Advisory Warnings</span>
                  <span className="text-amber-400 text-lg font-bold">{warningAssets.length} Units</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Vibration/Temp</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded p-3">
                  <span className="text-slate-400 text-[10px] block">Critical Action Required</span>
                  <span className="text-rose-400 text-lg font-bold">{criticalAssets.length} Units</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Immediate stop</span>
                </div>
              </div>

              {/* Priority Equipment Action List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white tracking-tight uppercase tracking-wider text-slate-400">
                  Priority Findings & Action Items
                </h4>

                {criticalAssets.map(asset => (
                  <div 
                    key={asset.id}
                    className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-300">{asset.name}</span>
                        <span className="text-[10px] font-mono bg-rose-950 text-rose-400 px-1.5 rounded">
                          {asset.tag}
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/80 mt-1">
                        Critical tool wear VB saturation (238 min vs 230 max) and cutting torque exceeding 72.8 Nm. Immediate index required.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectAssetAndTab(asset);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-800 rounded transition-colors whitespace-nowrap shrink-0"
                    >
                      Inspect Telemetry
                    </button>
                  </div>
                ))}

                {warningAssets.map(asset => (
                  <div 
                    key={asset.id}
                    className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300">{asset.name}</span>
                        <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-1.5 rounded">
                          {asset.tag}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/80 mt-1">
                        Vibration elevation approaching ISO 10816-3 Zone C boundary. Schedule lubrication & balance check within 24 hours.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectAssetAndTab(asset);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-900/60 hover:bg-amber-800 rounded transition-colors whitespace-nowrap shrink-0"
                    >
                      Inspect Telemetry
                    </button>
                  </div>
                ))}
              </div>

              {/* Plant Reliability Assessment */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ISO 13374 Condition Monitoring Certification Assessment</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Overall plant health index is at <strong>77.2%</strong>. Unplanned downtime risk is mitigated by an estimated <strong>$142,000 / month</strong> through Daxoriq early prognostic warning algorithms.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
