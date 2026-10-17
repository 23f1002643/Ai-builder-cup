import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Wrench, 
  Upload, 
  Crosshair, 
  CheckCircle2, 
  ZoomIn,
  Camera
} from 'lucide-react';
import { ThermalScanResult, Asset } from '../types';

interface ThermalInspectionViewProps {
  assets: Asset[];
  onDispatchThermalWorkOrder: (scanResult: ThermalScanResult) => void;
}

export const ThermalInspectionView: React.FC<ThermalInspectionViewProps> = ({
  assets,
  onDispatchThermalWorkOrder,
}) => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>(
    '/src/assets/images/thermal_inspection_bearing_1792234528935.jpg'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<ThermalScanResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [probeCoords, setProbeCoords] = useState<{ x: number; y: number } | null>(null);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Show cursor coordinates only. Pixel coordinates are not calibrated temperature readings.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setProbeCoords({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleMouseLeave = () => {
    setProbeCoords(null);
  };

  const handleRunThermalAi = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setInspectionResult(null);
    try {
      // Convert the currently displayed image (uploaded data URL or bundled asset)
      // into the base64 payload required by the API.
      let dataUrl = selectedImageSrc;
      if (!selectedImageSrc.startsWith('data:')) {
        const imageResponse = await fetch(selectedImageSrc);
        if (!imageResponse.ok) {
          throw new Error('Could not load the example image. Upload an inspection image and try again.');
        }
        const imageBlob = await imageResponse.blob();
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read the image.'));
          reader.onerror = () => reject(new Error('Could not read the image.'));
          reader.readAsDataURL(imageBlob);
        });
      }

      const commaIndex = dataUrl.indexOf(',');
      if (commaIndex < 0) {
        throw new Error('The selected image could not be prepared. Please upload it again.');
      }
      const mimeType = dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/jpeg';
      const imageBase64 = dataUrl.slice(commaIndex + 1);

      const response = await fetch('/api/analyze-thermal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          inspectionNotes: 'Prototype image review. Do not assume calibrated radiometric temperature unless a readable scale appears in the image.',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `Image-analysis service returned HTTP ${response.status}`);
      }
      setInspectionResult(data);
    } catch (err) {
      console.error('Thermal image analysis failed:', err);
      setAnalysisError(err instanceof Error
        ? err.message
        : 'Thermal image analysis failed. No measurements or diagnosis were generated.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageSrc(reader.result as string);
        setInspectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div role="note" className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
        <strong>Image review only:</strong> a normal image is not a calibrated thermogram. Any AI observations are tentative and must be checked with calibrated equipment by a qualified technician.
      </div>
      {analysisError && (
        <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{analysisError}</span>
          <button type="button" onClick={() => setAnalysisError(null)} className="rounded-lg px-2 py-1 font-semibold hover:bg-rose-100" aria-label="Dismiss image analysis error">Dismiss</button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span>Visual & Infrared Thermography Diagnostic Station</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Radiometric thermographic defect analysis for bearing friction, motor stator hotspots, and insulation breakdown.
          </p>
        </div>

        {/* Upload Custom Thermal Photo */}
        <label className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md cursor-pointer transition-colors shadow-sm">
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload Thermal Scan</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Grid: Thermogram Viewer & AI Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Interactive Thermal Image Viewer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>FLIR E95 Image review · illustrative overlay</span>
              </h3>
              <p className="text-xs text-slate-400">
                Asset: <strong className="text-slate-200">Rotary Kiln Blower KB-02</strong> · Drive-End Bearing Housing
              </p>
            </div>

            {/* Probe Display */}
            <div className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono">
              <span className="text-slate-400">Image position: </span>
              <strong className="text-cyan-700">
                {probeCoords ? `X ${probeCoords.x}% · Y ${probeCoords.y}%` : 'Hover image'}
              </strong>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full rounded-lg overflow-hidden border border-slate-800 bg-black cursor-crosshair select-none group"
          >
            <img 
              src={selectedImageSrc} 
              alt="Thermal Bearing Scan" 
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover" 
            />

            {/* Crosshair following cursor */}
            {probeCoords && (
              <div 
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                style={{ left: `${probeCoords.x}%`, top: `${probeCoords.y}%` }}
              >
                <Crosshair className="w-6 h-6 text-cyan-300 drop-shadow-md animate-pulse" />
                <span className="bg-slate-950/90 text-white border border-cyan-500 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg">
                  X {probeCoords.x}% · Y {probeCoords.y}%
                </span>
              </div>
            )}

            {/* Pre-annotated Hotspot Callout Box */}
            <div className="absolute top-[35%] left-[38%] w-[28%] h-[32%] border-2 border-dashed border-rose-500 rounded pointer-events-none animate-pulse">
              <span className="absolute -top-6 left-0 bg-rose-950/90 text-rose-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-rose-800">
                Illustrative overlay · not measured
              </span>
            </div>
          </div>

          {/* Radiometric Palette Scale */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Color palette: illustrative</span>
              <span>Not a calibrated temperature scale</span>
              <span className="text-rose-400 font-bold">Use calibrated equipment</span>
            </div>
            <div className="h-3 w-full rounded bg-gradient-to-r from-blue-900 via-indigo-600 via-emerald-500 via-yellow-400 to-red-600 border border-slate-800" />
          </div>

          {/* Trigger AI Button */}
          <button
            onClick={handleRunThermalAi}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Reviewing image with Gemini...' : 'Review Image with Gemini AI'}</span>
          </button>

        </div>

        {/* Right 5 Cols: Thermal AI Diagnostic Report */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Thermal AI Inspection Findings</span>
              {inspectionResult && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  inspectionResult.severityRating === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300'
                }`}>
                  {inspectionResult.severityRating}
                </span>
              )}
            </h3>

            {inspectionResult ? (
              <div className="space-y-4 text-xs">
                
                {/* Temperature Overview */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="bg-slate-950 border border-slate-800 rounded p-3">
                    <span className="text-slate-400 text-[10px] block">Max Observed Temp</span>
                    <span className="text-rose-400 font-bold text-xl">{inspectionResult.maxObservedTempC}°C</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded p-3">
                    <span className="text-slate-400 text-[10px] block">Delta-T above Ambient</span>
                    <span className="text-amber-400 font-bold text-xl">+{inspectionResult.deltaT}°C</span>
                  </div>
                </div>

                {/* Primary Anomaly */}
                <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Primary Failure Mode:</span>
                  <div className="font-bold text-white text-xs">
                    {inspectionResult.primaryAnomaly}
                  </div>
                </div>

                {/* Identified Hotspots Breakdown */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 text-[11px] font-medium">Possible visual observations (unverified):</span>
                  <div className="space-y-1">
                    {inspectionResult.identifiedHotspots.map((hs, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 font-mono text-[11px]">
                        <span className="text-slate-300">{hs.zone}</span>
                        <span className="text-cyan-300 font-bold">{hs.tempC}°C</span>
                        <span className="text-slate-400 text-[10px]">{hs.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failure Risk Assessment */}
                <div className="bg-rose-950/20 border border-rose-900/40 rounded p-3 space-y-1">
                  <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Potential issue (unverified)</span>
                  </span>
                  <p className="text-rose-200/90 text-[11px] leading-relaxed">
                    {inspectionResult.failureRisk}
                  </p>
                </div>

                {/* Corrective Action */}
                <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-1">
                  <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Suggested next step (human review)</span>
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {inspectionResult.correctiveAction}
                  </p>
                </div>

                {/* Auto Work Order Trigger */}
                <button
                  onClick={() => onDispatchThermalWorkOrder(inspectionResult)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-200 bg-rose-950 hover:bg-rose-900 border border-rose-800 rounded transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5 text-rose-400" />
                  <span>Create review draft</span>
                </button>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  Upload or review an inspection image to get tentative visual observations. This prototype cannot determine calibrated temperature readings from a normal image.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
