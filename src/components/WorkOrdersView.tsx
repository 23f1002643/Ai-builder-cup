import React, { useState } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Filter, 
  Search, 
  User, 
  ShieldAlert, 
  FileText, 
  Printer, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, Asset } from '../types';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  onUpdateWorkOrderStatus: (orderId: string, status: WorkOrderStatus) => void;
  onToggleTaskStep: (orderId: string, stepNumber: number) => void;
  onCreateWorkOrder: (newOrder: WorkOrder) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  assets,
  onUpdateWorkOrderStatus,
  onToggleTaskStep,
  onCreateWorkOrder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // New Work Order Form State
  const [formAssetId, setFormAssetId] = useState<string>(assets[0]?.id || '');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formPriority, setFormPriority] = useState<WorkOrderPriority>('P2-HIGH');
  const [formTechnician, setFormTechnician] = useState<string>('Marcus Vance (Reliability Specialist)');
  const [formDuration, setFormDuration] = useState<number>(120);
  const [isGeneratingAiTasks, setIsGeneratingAiTasks] = useState<boolean>(false);

  const selectedOrder = workOrders.find(o => o.id === selectedOrderId) || workOrders[0];

  const filteredOrders = workOrders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityBadge = (priority: WorkOrderPriority) => {
    switch (priority) {
      case 'P1-CRITICAL':
        return <span className="text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded">P1 CRITICAL</span>;
      case 'P2-HIGH':
        return <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">P2 HIGH</span>;
      case 'P3-MEDIUM':
        return <span className="text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">P3 MEDIUM</span>;
      default:
        return <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">P4 ROUTINE</span>;
    }
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'TRIGGERED':
        return <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">TRIGGERED</span>;
      case 'DISPATCHED':
        return <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">DISPATCHED</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">IN PROGRESS</span>;
      case 'RESOLVED':
        return <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">RESOLVED</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === formAssetId) || assets[0];
    const newOrder: WorkOrder = {
      id: `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      title: formTitle || `Preventive Maintenance: ${targetAsset.name}`,
      priority: formPriority,
      status: 'DISPATCHED',
      createdAt: 'Just now',
      triggerReason: 'Manual Engineer Dispatch from Daxoriq Operations Console',
      assignedTechnician: formTechnician,
      estimatedDurationMinutes: formDuration,
      safetyPrecautions: [
        'Apply NFPA 70E Lock-out / Tag-out at local electrical disconnect switch',
        'Verify zero stored hydraulic/pneumatic kinetic energy in accumulators',
        'Wear eye protection and composite-toe safety footwear'
      ],
      tasks: [
        { step: 1, instruction: 'De-energize main distribution breaker and lock hasp', verified: false },
        { step: 2, instruction: 'Execute physical condition inspection and baseline vibration reading', verified: false },
        { step: 3, instruction: 'Replace specified wear components and inspect tolerances', verified: false },
        { step: 4, instruction: 'Clean work zone and perform operational test run', verified: false }
      ],
      consumableParts: [
        { sku: 'OEM-SEAL-KIT', name: 'Standard Elastomer Seal Set', quantity: 1, unit: 'sets' },
        { sku: 'LUB-IND-SYN', name: 'Industrial Synthetic Lubricant 5L', quantity: 1, unit: 'can' }
      ]
    };

    onCreateWorkOrder(newOrder);
    setSelectedOrderId(newOrder.id);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <span>CMMS Work Orders & Maintenance Dispatch</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated work order creation from AI anomaly trips, technician task execution, and digital sign-off.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Main Grid: Orders List & Detailed Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filter & Orders List */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {['ALL', 'TRIGGERED', 'DISPATCHED', 'IN_PROGRESS', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search work orders, assets, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* List of Orders */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredOrders.map(order => {
              const isSelected = order.id === selectedOrderId;
              const completedTasks = order.tasks.filter(t => t.verified).length;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-cyan-300">
                      {order.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getPriorityBadge(order.priority)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white tracking-tight line-clamp-1 mb-1">
                    {order.title}
                  </h4>

                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {order.assetName}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/70">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[130px]">{order.assignedTechnician}</span>
                    </span>
                    <span>
                      {completedTasks}/{order.tasks.length} Steps
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Work Order Detailed Drawer & Step Execution */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
              
              {/* Header Info & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-cyan-400">{selectedOrder.id}</span>
                    {getPriorityBadge(selectedOrder.priority)}
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {selectedOrder.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Target Asset: <strong className="text-slate-200">{selectedOrder.assetName}</strong> · Created: {selectedOrder.createdAt}
                  </div>
                </div>

                {/* Print button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Order</span>
                  </button>
                </div>
              </div>

              {/* Status Progression Controls */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">Update Work Order Status:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['TRIGGERED', 'DISPATCHED', 'IN_PROGRESS', 'RESOLVED'] as WorkOrderStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => onUpdateWorkOrderStatus(selectedOrder.id, st)}
                      className={`px-2 py-1.5 text-xs font-mono rounded border text-center transition-colors ${
                        selectedOrder.status === st
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Reason & Technician Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 border border-slate-800/80 rounded p-3 space-y-1">
                  <span className="text-[11px] text-slate-400">Trigger Mechanism:</span>
                  <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                    {selectedOrder.triggerReason}
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded p-3 space-y-1">
                  <span className="text-[11px] text-slate-400">Assigned Field Specialist:</span>
                  <p className="text-white font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedOrder.assignedTechnician}</span>
                  </p>
                  <span className="text-[11px] text-slate-400 block">
                    Estimated Duration: <strong className="text-slate-300 font-mono">{selectedOrder.estimatedDurationMinutes} minutes</strong>
                  </span>
                </div>
              </div>

              {/* Safety Precautions & LOTO Section */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Mandatory OSHA / Lock-Out Tag-Out (LOTO) Precautions</span>
                </div>
                <ul className="space-y-1 text-xs text-rose-200/90 list-disc list-inside">
                  {selectedOrder.safetyPrecautions.map((prec, idx) => (
                    <li key={idx}>{prec}</li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Maintenance Execution Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Technician Task Execution Checklist</span>
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedOrder.tasks.filter(t => t.verified).length} of {selectedOrder.tasks.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedOrder.tasks.map((task) => (
                    <div
                      key={task.step}
                      onClick={() => onToggleTaskStep(selectedOrder.id, task.step)}
                      className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                        task.verified
                          ? 'bg-emerald-950/20 border-emerald-800/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.verified}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-mono text-slate-400 mr-2">Step {task.step}.</span>
                        <span className={task.verified ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {task.instruction}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requisitioned Spare Parts Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  Requisitioned Consumables & Spare Parts
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-md overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/60 text-slate-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="px-3 py-2">Part Number</th>
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedOrder.consumableParts.map((part, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-3 py-2 font-mono text-cyan-300">{part.sku}</td>
                          <td className="px-3 py-2 text-slate-200">{part.name}</td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums text-slate-300">
                            {part.quantity} {part.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500">
              Select or create a work order to view tasks and sign-off.
            </div>
          )}
        </div>

      </div>

      {/* Create New Work Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Create CMMS Work Order</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target Asset</label>
                <select
                  value={formAssetId}
                  onChange={(e) => setFormAssetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Order Title</label>
                <input
                  type="text"
                  placeholder="e.g., Immediate Bearing Inspection & Lubrication Flush"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as WorkOrderPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="P1-CRITICAL">P1 - CRITICAL</option>
                    <option value="P2-HIGH">P2 - HIGH</option>
                    <option value="P3-MEDIUM">P3 - MEDIUM</option>
                    <option value="P4-LOW">P4 - ROUTINE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Est. Duration (Min)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(parseInt(e.target.value) || 60)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Assigned Lead Technician</label>
                <input
                  type="text"
                  value={formTechnician}
                  onChange={(e) => setFormTechnician(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
                >
                  Create & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
