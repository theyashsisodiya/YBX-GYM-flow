import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { makeScenariosData, MakeScenario, MakeNodeData, MakeBranch } from '../data/makeScenariosData';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Database, 
  Settings, 
  Webhook, 
  Split, 
  Filter, 
  Play,
  Clock,
  Wrench,
  ChevronRight,
  Search,
  Activity,
  Download,
  X,
  Code
} from 'lucide-react';

const appIcons: Record<string, React.ElementType> = {
  mindbody: Activity,
  ghl: Database,
  tools: Settings,
  router: Split,
  webhook: Webhook,
  formula: Wrench,
  flow: Activity,
};

const appColors: Record<string, string> = {
  mindbody: 'bg-[#ed7d31]', // Mindbody orange
  ghl: 'bg-[#188bf6]',      // GHL blue
  tools: 'bg-[#8e44ad]',    // Tools purple
  router: 'bg-[#27ae60]',   // Router green
  webhook: 'bg-[#e74c3c]',  // Webhook red
  formula: 'bg-[#f1c40f]',  // Formula yellow
  flow: 'bg-[#34495e]',     // Flow dark blue
};

const MakeConnection = ({ filter, isActive, isCompleted }: { filter?: string, isActive?: boolean, isCompleted?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center relative w-16 h-16 shrink-0">
      <div className={`w-full h-[3px] absolute top-1/2 -translate-y-1/2 z-0 transition-colors duration-500 overflow-hidden rounded-full ${isActive || isCompleted ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
        {isActive && (
          <motion.div 
            className="h-full bg-white opacity-50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      {filter && (
        <div className={`z-10 bg-white dark:bg-gray-800 border-2 rounded-full p-1 shadow-sm cursor-pointer transition-colors group relative ${isActive || isCompleted ? 'border-blue-500' : 'border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`} title={filter}>
          <Filter size={14} className={isActive || isCompleted ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500'} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
            {filter}
          </div>
        </div>
      )}
    </div>
  );
};

const MakeNode = ({ node, isTrigger = false, isActive = false, isCompleted = false, onClick }: { node: MakeNodeData, isTrigger?: boolean, isActive?: boolean, isCompleted?: boolean, onClick?: () => void }) => {
  const Icon = appIcons[node.app] || Settings;
  const bgColor = appColors[node.app] || 'bg-gray-500';

  return (
    <div className="flex flex-col items-center relative group w-32 shrink-0">
      {/* Operation Bubble (Make.com style) */}
      {isCompleted && !isActive && (
        <div className="absolute -top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-full px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 z-30 flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
          <Search size={10} /> 1
        </div>
      )}

      {/* Node Circle */}
      <div 
        onClick={onClick}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md relative z-10 ${bgColor} cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-300 ${isActive ? 'ring-4 ring-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' : ''}`}
      >
        <Icon size={28} strokeWidth={1.5} />
        
        {/* Polling / Clock icon */}
        {node.isPolling && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full p-0.5 shadow-sm border border-gray-200 dark:border-gray-600">
            <Clock size={12} />
          </div>
        )}

        {/* Success Checkmark */}
        {isCompleted && !isActive && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-sm border border-white dark:border-gray-800">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        )}
      </div>

      {/* Node Label */}
      <div className="mt-3 text-center w-full px-1">
        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate w-full">{node.title}</div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2">{node.subtitle}</div>
      </div>
      
      {/* Hover options (like Make.com) */}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-xl rounded-lg p-1 flex gap-1 border border-gray-200 dark:border-gray-700 z-20">
         <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300" title="Settings"><Wrench size={14}/></button>
         <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300" title="Run this module only"><Play size={14}/></button>
      </div>
    </div>
  );
};

const MakeScenarioVisualizer = ({ scenario, activeNodeId, completedNodeIds, onNodeClick }: { scenario: MakeScenario, activeNodeId: string | null, completedNodeIds: string[], onNodeClick: (node: MakeNodeData) => void }) => {
  return (
    <div className="flex items-center overflow-x-auto p-8 min-h-[400px] bg-[#f8f9fa] dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 custom-scrollbar">
      <MakeNode node={scenario.trigger} isTrigger={true} isActive={activeNodeId === scenario.trigger.id} isCompleted={completedNodeIds.includes(scenario.trigger.id)} onClick={() => onNodeClick(scenario.trigger)} />
      
      {scenario.nodes.map((node, idx) => {
        const prevNodeId = idx === 0 ? scenario.trigger.id : scenario.nodes[idx - 1].id;
        const isConnectionActive = activeNodeId === node.id || completedNodeIds.includes(node.id);
        
        return (
          <React.Fragment key={node.id}>
            <MakeConnection isActive={activeNodeId === node.id} isCompleted={completedNodeIds.includes(node.id)} />
            <MakeNode node={node} isActive={activeNodeId === node.id} isCompleted={completedNodeIds.includes(node.id)} onClick={() => onNodeClick(node)} />
          </React.Fragment>
        );
      })}

      {scenario.branches && scenario.branches.length > 0 && (
        <React.Fragment>
          <MakeConnection isActive={activeNodeId === 'router'} isCompleted={completedNodeIds.includes('router')} />
          {/* Router Node */}
          <MakeNode node={{ id: 'router', app: 'router', title: 'Flow Control', subtitle: 'Router' }} isActive={activeNodeId === 'router'} isCompleted={completedNodeIds.includes('router')} onClick={() => onNodeClick({ id: 'router', app: 'router', title: 'Flow Control', subtitle: 'Router' })} />
          
          <div className="flex flex-col justify-center relative py-4">
            {scenario.branches.map((branch, bIdx) => {
              const isFirst = bIdx === 0;
              const isLast = bIdx === scenario.branches!.length - 1;
              const isBranchActive = branch.nodes.length > 0 && (activeNodeId === branch.nodes[0].id || completedNodeIds.includes(branch.nodes[0].id));
              
              return (
                <div key={branch.id} className="flex items-center relative my-4">
                  {/* SVG for branch curves */}
                  <div className="absolute left-0 top-1/2 w-8 h-full -translate-y-1/2 pointer-events-none">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      {isFirst && (
                        <path d="M 0,50 Q 16,50 16,100 L 16,200" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-colors duration-500 ${isBranchActive ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      )}
                      {isLast && (
                        <path d="M 0,50 Q 16,50 16,0 L 16,-100" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-colors duration-500 ${isBranchActive ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      )}
                      {!isFirst && !isLast && (
                        <path d="M 0,50 L 32,50" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-colors duration-500 ${isBranchActive ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      )}
                    </svg>
                  </div>
                  
                  {/* Horizontal line to branch first node */}
                  <div className={`w-8 h-[3px] shrink-0 transition-colors duration-500 relative overflow-hidden rounded-full ${isBranchActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    {isBranchActive && (
                      <motion.div 
                        className="h-full bg-white opacity-50 absolute top-0 left-0"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                  
                  <MakeConnection filter={branch.filter} isActive={branch.nodes.length > 0 && activeNodeId === branch.nodes[0].id} isCompleted={branch.nodes.length > 0 && completedNodeIds.includes(branch.nodes[0].id)} />
                  
                  {branch.nodes.map((bNode, nIdx) => (
                    <React.Fragment key={bNode.id}>
                      {nIdx > 0 && <MakeConnection isActive={activeNodeId === bNode.id} isCompleted={completedNodeIds.includes(bNode.id)} />}
                      <MakeNode node={bNode} isActive={activeNodeId === bNode.id} isCompleted={completedNodeIds.includes(bNode.id)} onClick={() => onNodeClick(bNode)} />
                    </React.Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default function MakeVisualizer() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(makeScenariosData[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<MakeNodeData | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  const activeScenario = makeScenariosData.find(s => s.id === activeScenarioId) || makeScenariosData[0];

  const runAnimation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCompletedNodeIds([]);
    
    // Flatten nodes for animation
    const sequence = [activeScenario.trigger.id];
    for (const node of activeScenario.nodes) {
      sequence.push(node.id);
    }
    if (activeScenario.branches && activeScenario.branches.length > 0) {
      sequence.push('router');
      // Just animate the first branch for simplicity
      for (const node of activeScenario.branches[0].nodes) {
        sequence.push(node.id);
      }
    }

    const currentCompleted: string[] = [];
    
    for (const nodeId of sequence) {
      setActiveNodeId(nodeId);
      currentCompleted.push(nodeId);
      setCompletedNodeIds([...currentCompleted]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setActiveNodeId(null);
    setIsPlaying(false);
  };

  const downloadPDF = async () => {
    if (!visualizerRef.current) return;
    try {
      const canvas = await html2canvas(visualizerRef.current, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#f9fafb',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Make-Scenario-${activeScenario.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Make.com Scenarios</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visual representation of Mindbody to GHL integrations.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={runAnimation}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${isPlaying ? 'bg-blue-100 text-blue-400 cursor-not-allowed dark:bg-blue-900/50 dark:text-blue-500' : 'bg-[#188bf6] text-white hover:bg-blue-600'}`}
          >
            <Play size={16} className={isPlaying ? 'animate-pulse' : ''} /> {isPlaying ? 'Running...' : 'Run once'}
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Scenario Selector Sidebar */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-[calc(100vh-200px)]">
          {makeScenariosData.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => {
                setActiveScenarioId(scenario.id);
                setCompletedNodeIds([]);
                setActiveNodeId(null);
                setSelectedNode(null);
                setIsPlaying(false);
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                activeScenarioId === scenario.id
                  ? 'bg-white dark:bg-gray-800 border-[#188bf6] shadow-md ring-1 ring-[#188bf6]'
                  : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{scenario.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <Activity size={12} /> {scenario.trigger.title}
              </div>
            </button>
          ))}
        </div>

        {/* Visualizer Canvas */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{activeScenario.name}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock size={14}/> Scheduling: Immediately</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto relative p-4" ref={visualizerRef}>
            {/* Grid Background */}
            <div className="absolute inset-0 pointer-events-none" style={{ 
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
              opacity: 0.5
            }}></div>
            <div className="absolute inset-0 pointer-events-none dark:hidden" style={{ 
              backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
            }}></div>
            <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ 
              backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)', 
              backgroundSize: '24px 24px',
            }}></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScenario.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 w-full h-full flex items-center"
              >
                <MakeScenarioVisualizer scenario={activeScenario} activeNodeId={activeNodeId} completedNodeIds={completedNodeIds} onNodeClick={(node) => setSelectedNode(node)} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Configuration Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col shrink-0 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${appColors[selectedNode.app] || 'bg-gray-500'}`}>
                    {React.createElement(appIcons[selectedNode.app] || Settings, { size: 16 })}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{selectedNode.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedNode.subtitle}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
                {/* Configuration Section */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <Wrench size={14} /> Configuration
                  </h5>
                  {selectedNode.config ? (
                    <div className="space-y-3">
                      {Object.entries(selectedNode.config).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-200 dark:border-gray-700">
                          <label className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 block mb-1">{key}</label>
                          <div className="text-sm text-gray-800 dark:text-gray-200 font-mono break-all">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">No configuration available for this module.</div>
                  )}
                </div>

                {/* Input Bundle */}
                {selectedNode.input && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <ChevronRight size={14} /> Input Bundle
                    </h5>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      <pre>{JSON.stringify(selectedNode.input, null, 2)}</pre>
                    </div>
                  </div>
                )}

                {/* Output Bundle */}
                {selectedNode.output && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <Code size={14} /> Output Bundle
                    </h5>
                    <div className="bg-gray-900 text-blue-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      <pre>{JSON.stringify(selectedNode.output, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
