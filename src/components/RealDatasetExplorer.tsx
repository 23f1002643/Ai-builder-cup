import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Sliders,
  TrendingDown,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { 
  REAL_CMAPSS_DATA, 
  REAL_AI4I_DATA, 
  RealCMAPSSRow, 
  RealAI4IRow, 
  convertCMAPSSToCSV, 
  convertAI4IToCSV 
} from '../data/realDatasets';

export const RealDatasetExplorer: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'cmapss' | 'ai4i'>('cmapss');
  const [selectedUnit, setSelectedUnit] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFailureOnly, setFilterFailureOnly] = useState<boolean>(false);
  const [customRowsCount, setCustomRowsCount] = useState<number | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Filtered NASA C-MAPSS
  const filteredCmapss = REAL_CMAPSS_DATA.filter(row => {
    const matchesUnit = selectedUnit === 'ALL' || row.unit === selectedUnit;
    const matchesSearch = searchQuery === '' || 
                          row.cycle.toString().includes(searchQuery) ||
                          row.s3_temp_hpc.toString().includes(searchQuery);
    const matchesFailure = !filterFailureOnly || row.rul <= 30;
    return matchesUnit && matchesSearch && matchesFailure;
  });

  // Filtered UCI AI4I
  const filteredAi4i = REAL_AI4I_DATA.filter(row => {
    const matchesSearch = searchQuery === '' || 
                          row.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.udi.toString().includes(searchQuery);
    const matchesFailure = !filterFailureOnly || row.machineFailure === 1;
    return matchesSearch && matchesFailure;
  });

  // Handle CSV Download
  const handleDownloadCSV = () => {
    let csvContent = '';
    let fileName = '';

    if (activeDataset === 'cmapss') {
      csvContent = convertCMAPSSToCSV(REAL_CMAPSS_DATA);
      fileName = 'daxoriq_nasa_cmapss_embedded_sample.csv';
    } else {
      csvContent = convertAI4IToCSV(REAL_AI4I_DATA);
      fileName = 'daxoriq_uci_ai4i_2020_embedded_sample.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Custom CSV Ingestion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      setCustomRowsCount(lines.length - 1);
      setUploadSuccessMessage(`Read ${Math.max(0, lines.length - 1)} data rows from ${file.name}. This prototype only counts CSV rows; no inference was run.`);
      setTimeout(() => setUploadSuccessMessage(null), 5000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Public Benchmark Samples & Data Explorer</span>
            </h2>
            <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
              Embedded sample rows
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspect a small set of example rows based on public NASA C-MAPSS and UCI AI4I benchmark datasets. This view does not contain the complete source datasets or run model inference. CSV upload currently counts rows only.
          </p>
        </div>

        {/* Action Buttons: Export & Custom Upload */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Custom CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Dataset Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tab 1: NASA C-MAPSS */}
        <div
          onClick={() => {
            setActiveDataset('cmapss');
            setFilterFailureOnly(false);
          }}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeDataset === 'cmapss'
              ? 'bg-slate-900 border-cyan-500 shadow-lg'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">NASA Ames Prognostics</span>
            <span className="text-[10px] font-mono text-slate-400">FD001 Sea-Level Simulation</span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            NASA C-MAPSS Turbofan Sample Rows
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Selected example rows based on NASA C-MAPSS FD001 fields. The complete official dataset contains many more engine-cycle records; these embedded samples are not a full source-data download.
          </p>
          <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/70">
            <span>21 Sensor Channels</span>
            <span>·</span>
            <span>Sampled cycles only</span>
            <span>·</span>
            <span className="text-emerald-400">Model: not evaluated</span>
          </div>
        </div>

        {/* Tab 2: UCI AI4I CNC Machining */}
        <div
          onClick={() => {
            setActiveDataset('ai4i');
            setFilterFailureOnly(false);
          }}
          className={`p-4 rounded-lg border cursor-pointer transition-all ${
            activeDataset === 'ai4i'
              ? 'bg-slate-900 border-cyan-500 shadow-lg'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">UCI ML Repository</span>
            <span className="text-[10px] font-mono text-slate-400">10,000-row synthetic dataset</span>
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            UCI AI4I 2020 CNC Predictive Maintenance
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            UCI AI4I 2020 is a synthetic dataset designed to reflect predictive-maintenance use cases. The embedded sample here contains selected rows only, including failure-mode labels when present.
          </p>
          <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/70">
            <span>6 Key Physical Features</span>
            <span>·</span>
            <span>5 Failure Modes</span>
            <span>·</span>
            <span className="text-emerald-400">Model: not evaluated</span>
          </div>
        </div>

      </div>

      {/* Dataset Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {activeDataset === 'cmapss' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 shrink-0 font-medium">Engine Unit:</span>
                <button
                  onClick={() => setSelectedUnit('ALL')}
                  className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                    selectedUnit === 'ALL' ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  All Units
                </button>
                <button
                  onClick={() => setSelectedUnit(1)}
                  className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                    selectedUnit === 1 ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Engine #1 (Nominal Degradation)
                </button>
                <button
                  onClick={() => setSelectedUnit(2)}
                  className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                    selectedUnit === 2 ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Engine #2 (Accelerated Fatigue)
                </button>
              </div>
            )}

            <button
              onClick={() => setFilterFailureOnly(!filterFailureOnly)}
              className={`px-3 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap ml-2 ${
                filterFailureOnly
                  ? 'bg-rose-950 border-rose-600 text-rose-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filterFailureOnly ? 'Showing Failure Events Only' : 'Show Failure Events Only'}
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cycle, temp, product ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

        </div>

        {/* Real Data Table */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono">
          {activeDataset === 'cmapss' ? (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="px-3 py-2.5">Engine Unit</th>
                  <th className="px-3 py-2.5">Operational Cycle</th>
                  <th className="px-3 py-2.5">T30 (HPC Outlet °R)</th>
                  <th className="px-3 py-2.5">T50 (LPT Outlet °R)</th>
                  <th className="px-3 py-2.5">P30 (Pressure psia)</th>
                  <th className="px-3 py-2.5">NRc (Core Speed rpm)</th>
                  <th className="px-3 py-2.5">BPR (Bypass Ratio)</th>
                  <th className="px-3 py-2.5">W32 (Bleed Flow)</th>
                  <th className="px-3 py-2.5 text-right">RUL (Cycles Left)</th>
                  <th className="px-3 py-2.5 text-right">Health %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCmapss.map((row, i) => {
                  const isCrit = row.rul < 25;
                  const isWarn = row.rul < 65;
                  return (
                    <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-3 py-2 font-bold text-white">Unit #{row.unit}</td>
                      <td className="px-3 py-2 text-cyan-300">Cycle {row.cycle}</td>
                      <td className={`px-3 py-2 font-semibold ${row.s3_temp_hpc > 1610 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {row.s3_temp_hpc.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-slate-300">{row.s4_temp_lpt.toFixed(1)}</td>
                      <td className="px-3 py-2 text-slate-300">{row.s7_press_hpc.toFixed(1)}</td>
                      <td className="px-3 py-2 text-slate-300">{row.s14_corrected_core_speed.toFixed(1)}</td>
                      <td className="px-3 py-2 text-slate-300">{row.s15_bypass_ratio.toFixed(3)}</td>
                      <td className="px-3 py-2 text-slate-300">{row.s21_lpt_coolant.toFixed(2)}</td>
                      <td className={`px-3 py-2 text-right font-bold ${isCrit ? 'text-rose-400 animate-pulse' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {row.rul} {row.rul === 0 ? '(FAILED)' : ''}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.healthPct > 75 ? 'bg-emerald-950 text-emerald-300' :
                          row.healthPct > 35 ? 'bg-amber-950 text-amber-300' :
                          'bg-rose-950 text-rose-300'
                        }`}>
                          {row.healthPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="px-3 py-2.5">UDI / ID</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Air Temp [K]</th>
                  <th className="px-3 py-2.5">Process Temp [K]</th>
                  <th className="px-3 py-2.5">Speed [rpm]</th>
                  <th className="px-3 py-2.5">Torque [Nm]</th>
                  <th className="px-3 py-2.5">Tool Wear [min]</th>
                  <th className="px-3 py-2.5">Failure Mode</th>
                  <th className="px-3 py-2.5 text-right">Machine Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAi4i.map((row, i) => {
                  const isFail = row.machineFailure === 1;
                  const failureName = row.twf ? 'Tool Wear (TWF)' :
                                      row.hdf ? 'Heat Dissipation (HDF)' :
                                      row.pwf ? 'Power Failure (PWF)' :
                                      row.osf ? 'Overstrain (OSF)' : 'Normal';
                  return (
                    <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                      <td className="px-3 py-2 font-bold text-white">#{row.udi} ({row.productId})</td>
                      <td className="px-3 py-2 text-cyan-300">Class {row.type}</td>
                      <td className="px-3 py-2 text-slate-300">{row.airTempK} K</td>
                      <td className="px-3 py-2 text-slate-300">{row.processTempK} K</td>
                      <td className="px-3 py-2 text-slate-300">{row.rotationalSpeedRpm} rpm</td>
                      <td className={`px-3 py-2 ${row.torqueNm > 60 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                        {row.torqueNm} Nm
                      </td>
                      <td className={`px-3 py-2 font-bold ${row.toolWearMin > 210 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {row.toolWearMin} min
                      </td>
                      <td className="px-3 py-2">
                        {isFail ? (
                          <span className="text-rose-400 font-bold bg-rose-950/70 border border-rose-800 px-1.5 py-0.5 rounded text-[10px]">
                            {failureName}
                          </span>
                        ) : (
                          <span className="text-emerald-400 text-[10px]">Nominal Operation</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isFail ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {isFail ? 'CRITICAL ALARM' : 'NOMINAL'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Dataset Summary Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>
            Displaying <strong className="text-white font-mono">{activeDataset === 'cmapss' ? filteredCmapss.length : filteredAi4i.length}</strong> embedded sample rows — not the complete source dataset.
          </span>
          <span className="font-mono text-cyan-400">
            Sources: NASA C-MAPSS & UCI AI4I 2020 · selected embedded sample rows
          </span>
        </div>

      </div>

    </div>
  );
};
