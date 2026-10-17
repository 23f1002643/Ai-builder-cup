/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopNavigation, NavTab } from './components/TopNavigation';
import { StartupLanding } from './components/StartupLanding';
import { FleetOverview } from './components/FleetOverview';
import { TelemetryView } from './components/TelemetryView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { RealDatasetExplorer } from './components/RealDatasetExplorer';
import { BenchmarkStudio } from './components/BenchmarkStudio';
import { ThermalInspectionView } from './components/ThermalInspectionView';
import { AiCopilotModal } from './components/AiCopilotModal';
import { FloatingChatbot } from './components/FloatingChatbot';
import { FaultSimulator } from './components/FaultSimulator';
import { FleetScanModal } from './components/FleetScanModal';
import { INITIAL_ASSETS } from './data/assets';
import { INITIAL_WORK_ORDERS } from './data/workOrders';
import { Asset, WorkOrder, WorkOrderStatus, DiagnosticReport, ThermalScanResult } from './types';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [currentTab, setCurrentTab] = useState<NavTab>('startup'); // Startup homepage by default
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_ASSETS[1]); // Default to CNC-04 (Critical)
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modals
  const [isFaultSimulatorOpen, setIsFaultSimulatorOpen] = useState<boolean>(false);
  const [simulatorTargetAsset, setSimulatorTargetAsset] = useState<Asset>(INITIAL_ASSETS[1]);
  const [isFleetScanOpen, setIsFleetScanOpen] = useState<boolean>(false);

  // Critical alerts count for badge
  const criticalCount = workOrders.filter(o => o.priority === 'P1-CRITICAL' && o.status !== 'RESOLVED').length;

  // Real-time sensor stream simulation (organic IoT fluctuations every 3 seconds)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setAssets(prevAssets =>
        prevAssets.map(asset => {
          const updatedSensors = asset.sensors.map(sensor => {
            const noise = (Math.random() - 0.49) * 0.012 * sensor.value;
            const nextVal = Number((sensor.value + noise).toFixed(sensor.value > 100 ? 1 : 2));
            const updatedHistory = [...sensor.history.slice(1), nextVal];
            const trend: 'UP' | 'DOWN' | 'STABLE' = nextVal > sensor.value ? 'UP' : nextVal < sensor.value ? 'DOWN' : 'STABLE';
            
            return {
              ...sensor,
              value: nextVal,
              trend,
              history: updatedHistory,
            };
          });

          return {
            ...asset,
            sensors: updatedSensors,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Keep selectedAsset synced with assets array
  useEffect(() => {
    const updated = assets.find(a => a.id === selectedAsset.id);
    if (updated) {
      setSelectedAsset(updated);
    }
  }, [assets]);

  // Handlers
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleNavigateToTelemetry = (asset: Asset) => {
    setSelectedAsset(asset);
    setCurrentTab('telemetry');
  };

  const handleOpenFaultSimulator = (asset: Asset) => {
    setSimulatorTargetAsset(asset);
    setIsFaultSimulatorOpen(true);
  };

  const handleApplyFault = async (updatedAsset: Asset, faultDescription: string) => {
    setActionError(null);
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    setSelectedAsset(updatedAsset);

    try {
      const response = await fetch('/api/generate-work-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: updatedAsset,
          triggerReason: faultDescription,
          sensorSnapshot: updatedAsset.sensors.map(s => ({ name: s.name, value: s.value, unit: s.unit }))
        })
      });
      const generatedOrder = await response.json();
      if (!response.ok) {
        throw new Error(generatedOrder?.error || `Work-order service returned HTTP ${response.status}`);
      }

      const draftTasks = Array.isArray(generatedOrder.tasks) && generatedOrder.tasks.length > 0
        ? generatedOrder.tasks
        : [{ step: 1, instruction: 'Review the reported fault and follow site-approved procedures. AI did not provide a verified task list.', verified: false }];

      const newWorkOrder: WorkOrder = {
        id: `WO-DEMO-${Date.now()}`,
        assetId: updatedAsset.id,
        assetName: updatedAsset.name,
        title: generatedOrder.title || `Review maintenance alert: ${faultDescription.split(':')[0]}`,
        priority: generatedOrder.priority || 'P3-MEDIUM',
        status: 'TRIGGERED',
        createdAt: 'Just now',
        triggerReason: faultDescription,
        assignedTechnician: `${generatedOrder.assignedTeam || 'Unassigned'} (Draft — not dispatched)`,
        estimatedDurationMinutes: generatedOrder.estimatedDurationMinutes || 0,
        tasks: draftTasks,
        consumableParts: Array.isArray(generatedOrder.consumableParts) ? generatedOrder.consumableParts : [],
        safetyPrecautions: Array.isArray(generatedOrder.safetyPrecautions)
          ? generatedOrder.safetyPrecautions
          : ['Technician review required. Follow site-approved lock-out/tag-out and OEM procedures.']
      };

      setWorkOrders(prev => [newWorkOrder, ...prev]);
    } catch (err) {
      console.error('Work order generation error:', err);
      setActionError(err instanceof Error
        ? `Work-order draft was not created: ${err.message}`
        : 'Work-order draft was not created. Check AI service configuration and try again.');
    }

    setCurrentTab('telemetry');
  };

  const handleResetAsset = (assetId: string) => {
    const original = INITIAL_ASSETS.find(a => a.id === assetId);
    if (original) {
      setAssets(prev => prev.map(a => a.id === assetId ? original : a));
      setSelectedAsset(original);
    }
  };

  const handleTriggerDiagnosis = (asset: Asset) => {
    setSelectedAsset(asset);
    setCurrentTab('telemetry');
  };

  const handleOpenWorkOrderFromDiagnosis = (asset: Asset, diagnosis: DiagnosticReport) => {
    const newOrder: WorkOrder = {
      id: `WO-2026-${Math.floor(3000 + Math.random() * 7000)}`,
      assetId: asset.id,
      assetName: asset.name,
      title: `${diagnosis.faultType} Corrective Overhaul`,
      priority: diagnosis.severity === 'CRITICAL' ? 'P1-CRITICAL' : 'P2-HIGH',
      status: 'DISPATCHED',
      createdAt: 'Just now',
      triggerReason: `AI Diagnosis (${diagnosis.confidenceScore}% conf): ${diagnosis.rootCauseSummary}`,
      assignedTechnician: 'Condition Monitoring Specialist',
      estimatedDurationMinutes: Math.round(diagnosis.estimatedRepairHours * 60),
      safetyPrecautions: [
        'Apply NFPA 70E Lock-Out Tag-Out protocol',
        `Compliance Standard: ${diagnosis.standardsCompliance}`,
        'Verify zero mechanical stored energy'
      ],
      tasks: [
        { step: 1, instruction: 'Isolate main electrical breaker and test for zero voltage with calibrated meter', verified: false },
        { step: 2, instruction: diagnosis.recommendedAction, verified: false },
        { step: 3, instruction: 'Re-assemble and verify baseline vibration FFT peak < 2.2 mm/s', verified: false }
      ],
      consumableParts: (diagnosis.requiredParts || []).map(p => ({
        sku: p.partNumber,
        name: p.description,
        quantity: 1,
        unit: 'pcs'
      }))
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setCurrentTab('work-orders');
  };

  const handleDispatchThermalWorkOrder = (scanResult: ThermalScanResult) => {
    const newOrder: WorkOrder = {
      id: `WO-DEMO-${Date.now()}`,
      assetId: 'asset-blower-02',
      assetName: 'Rotary Kiln Induction Blower KB-02 (demo asset)',
      title: 'Review AI-assisted thermal inspection findings',
      priority: scanResult.severityRating === 'CRITICAL' ? 'P1-CRITICAL' : 'P2-HIGH',
      status: 'TRIGGERED',
      createdAt: 'Just now',
      triggerReason: `Draft from image analysis: ${scanResult.primaryAnomaly}. Temperatures and observations require qualified review.`,
      assignedTechnician: 'Unassigned — human review required',
      estimatedDurationMinutes: 0,
      safetyPrecautions: [
        'This is an unapproved draft; do not use it as a work instruction.',
        'Have a qualified technician validate the image, measurements, and site-approved procedures before action.'
      ],
      tasks: [
        { step: 1, instruction: 'Have a qualified technician validate the inspection findings against calibrated equipment and site procedures.', verified: false },
        { step: 2, instruction: scanResult.correctiveAction || 'No corrective action was validated by this prototype.', verified: false }
      ],
      consumableParts: []
    };

    setWorkOrders(prev => [newOrder, ...prev]);
    setCurrentTab('work-orders');
  };

  const handleUpdateWorkOrderStatus = (orderId: string, status: WorkOrderStatus) => {
    setWorkOrders(prev =>
      prev.map(order => order.id === orderId ? { ...order, status } : order)
    );
  };

  const handleToggleTaskStep = (orderId: string, stepNumber: number) => {
    setWorkOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        const updatedTasks = order.tasks.map(t =>
          t.step === stepNumber ? { ...t, verified: !t.verified } : t
        );
        return { ...order, tasks: updatedTasks };
      })
    );
  };

  const handleCreateWorkOrder = (newOrder: WorkOrder) => {
    setWorkOrders(prev => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <TopNavigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickScan={() => setIsFleetScanOpen(true)}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        criticalAlertsCount={criticalCount}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {actionError && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm">
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="shrink-0 rounded-lg px-2 py-1 font-semibold hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-500"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Startup Website Landing */}
        {currentTab === 'startup' && (
          <StartupLanding
            onEnterConsole={() => setCurrentTab('fleet')}
            onExploreDatasets={() => setCurrentTab('real-datasets')}
            onOpenCopilot={() => setIsChatbotOpen(true)}
            assets={assets}
          />
        )}

        {/* Fleet Floor Map & Bay Operations */}
        {currentTab === 'fleet' && (
          <FleetOverview
            assets={assets}
            onSelectAsset={handleSelectAsset}
            onOpenFaultSimulator={handleOpenFaultSimulator}
            onTriggerDiagnosis={handleTriggerDiagnosis}
            onNavigateToTelemetry={handleNavigateToTelemetry}
          />
        )}

        {/* Live Telemetry & FFT Frequency Spectrum */}
        {currentTab === 'telemetry' && (
          <TelemetryView
            assets={assets}
            selectedAsset={selectedAsset}
            onSelectAsset={handleSelectAsset}
            onOpenFaultSimulator={handleOpenFaultSimulator}
            onOpenWorkOrderFromDiagnosis={handleOpenWorkOrderFromDiagnosis}
          />
        )}

        {/* Real Industrial Datasets Explorer (NASA C-MAPSS & UCI AI4I) */}
        {currentTab === 'real-datasets' && (
          <RealDatasetExplorer />
        )}

        {/* CMMS Work Orders & Dispatch */}
        {currentTab === 'work-orders' && (
          <WorkOrdersView
            workOrders={workOrders}
            assets={assets}
            onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
            onToggleTaskStep={handleToggleTaskStep}
            onCreateWorkOrder={handleCreateWorkOrder}
          />
        )}

        {/* Thermal Infrared Thermogram Inspection */}
        {currentTab === 'thermal' && (
          <ThermalInspectionView
            assets={assets}
            onDispatchThermalWorkOrder={handleDispatchThermalWorkOrder}
          />
        )}

        {/* Dedicated Fullscreen AI Copilot */}
        {currentTab === 'copilot' && (
          <AiCopilotModal
            assets={assets}
            currentAsset={selectedAsset}
          />
        )}

      </main>

      {/* Persistent Floating Gemini AI Chatbot Drawer */}
      <FloatingChatbot
        assets={assets}
        selectedAsset={selectedAsset}
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      {/* Fault Injection Simulator Modal */}
      <FaultSimulator
        asset={simulatorTargetAsset}
        isOpen={isFaultSimulatorOpen}
        onClose={() => setIsFaultSimulatorOpen(false)}
        onApplyFault={handleApplyFault}
        onResetAsset={handleResetAsset}
      />

      {/* Fleet Automated Diagnostic Scan Modal */}
      <FleetScanModal
        assets={assets}
        isOpen={isFleetScanOpen}
        onClose={() => setIsFleetScanOpen(false)}
        onSelectAssetAndTab={handleNavigateToTelemetry}
      />

    </div>
  );
}
