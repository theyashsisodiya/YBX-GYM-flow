import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { workflows, ghlTags, StepType, WorkflowStep } from './data/workflows';
import { 
  Zap, 
  MessageSquare, 
  Clock, 
  GitBranch, 
  Tag, 
  UserCircle,
  CalendarCheck,
  AlertCircle,
  CheckCircle2,
  Menu,
  X,
  Play,
  Download,
  Moon,
  Sun,
  LayoutTemplate,
  FileText,
  Tags
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const stepColors: Record<StepType, { bg: string; text: string; border: string; icon: any; darkBg: string; darkText: string; darkBorder: string }> = {
  trigger: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400', darkBorder: 'dark:border-blue-800', icon: Zap },
  action: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400', darkBorder: 'dark:border-emerald-800', icon: MessageSquare },
  wait: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400', darkBorder: 'dark:border-amber-800', icon: Clock },
  condition: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400', darkBorder: 'dark:border-purple-800', icon: GitBranch },
  tag: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', darkBg: 'dark:bg-pink-900/30', darkText: 'dark:text-pink-400', darkBorder: 'dark:border-pink-800', icon: Tag },
  task: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-400', darkBorder: 'dark:border-rose-800', icon: UserCircle },
  end: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-400', darkBorder: 'dark:border-gray-700', icon: CheckCircle2 },
};

const FlowStepList = ({ steps, activeStepId, playedStepIds }: { steps: WorkflowStep[], activeStepId: string | null, playedStepIds: string[] }) => {
  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => {
        const style = stepColors[step.type] || stepColors.action;
        const StepIcon = style.icon;
        const isActive = activeStepId === step.id;
        const isPlayed = playedStepIds.includes(step.id);
        const isLineActive = isPlayed || isActive;

        return (
          <div key={step.id} className="flex flex-col items-center relative group">
            {/* Vertical line from previous step */}
            {index > 0 && <div className={`w-0.5 h-8 transition-colors duration-300 ${isLineActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10' : 'bg-gray-300 dark:bg-gray-700'}`} />}
            
            {/* Step Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col items-center w-64 bg-white dark:bg-gray-800 rounded-xl p-4 border shadow-sm text-center relative z-20 transition-all duration-300
                ${style.border} ${style.darkBorder}
                ${isActive ? 'ring-4 ring-blue-500/50 dark:ring-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-105' : 'hover:shadow-md'}
              `}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-3 ${style.bg} ${style.text} ${style.darkBg} ${style.darkText}`}>
                <StepIcon size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${style.bg} ${style.text} ${style.darkBg} ${style.darkText}`}>
                {step.type}
              </span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{step.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{step.description}</p>
              
              {/* Hover Detail Tooltip */}
              {step.hoverDetail && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-xl">
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                  <p className="font-semibold mb-1 text-blue-300">Details & Context:</p>
                  {step.hoverDetail}
                </div>
              )}
            </motion.div>

            {/* Branches */}
            {step.branches && step.branches.length > 0 && (
              <div className="flex justify-center relative pt-8 mt-2">
                {/* Vertical line down to horizontal split */}
                <div className={`absolute top-0 left-1/2 w-0.5 h-8 -translate-x-1/2 transition-colors duration-300 ${step.branches.some(b => b.steps.length > 0 && (playedStepIds.includes(b.steps[0].id) || activeStepId === b.steps[0].id)) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                
                {step.branches.map((branch, i) => {
                  const isFirst = i === 0;
                  const isLast = i === step.branches!.length - 1;
                  const isOnly = step.branches!.length === 1;
                  const isBranchActive = branch.steps.length > 0 && (playedStepIds.includes(branch.steps[0].id) || activeStepId === branch.steps[0].id);
                  
                  return (
                    <div key={i} className="relative flex flex-col items-center px-2 sm:px-6">
                      {/* Horizontal line */}
                      {!isOnly && (
                        <div className={`absolute top-0 h-0.5 transition-colors duration-300 ${
                          isFirst ? 'left-1/2 right-0' : 
                          isLast ? 'left-0 right-1/2' : 
                          'left-0 right-0'
                        } ${isBranchActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10' : 'bg-gray-300 dark:bg-gray-700'}`} />
                      )}
                      {/* Vertical line down to label */}
                      <div className={`w-0.5 h-6 transition-colors duration-300 ${isBranchActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                      
                      {/* Branch Label */}
                      <div className={`z-20 bg-white dark:bg-gray-800 border shadow-sm px-3 py-1 rounded-full text-xs font-bold mb-4 whitespace-nowrap transition-colors duration-300 ${isBranchActive ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {branch.label}
                      </div>
                      
                      {/* Steps */}
                      <FlowStepList steps={branch.steps} activeStepId={activeStepId} playedStepIds={playedStepIds} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [activeWorkflowId, setActiveWorkflowId] = useState(workflows[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'technical' | 'tags'>('visualizer');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [playingStepId, setPlayingStepId] = useState<string | null>(null);
  const [playedStepIds, setPlayedStepIds] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const flowchartRef = useRef<HTMLDivElement>(null);
  const activeWorkflow = workflows.find(w => w.id === activeWorkflowId) || workflows[0];

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const downloadPDF = async () => {
    if (!flowchartRef.current) return;
    try {
      const canvas = await html2canvas(flowchartRef.current, {
        scale: 2,
        backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`YBX-Workflow-${activeWorkflow.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const playAnimation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlayedStepIds([]);
    
    // Flatten steps for a simple sequential animation (taking the first branch if exists)
    const flattenSteps = (steps: WorkflowStep[]): string[] => {
      let flat: string[] = [];
      for (const step of steps) {
        flat.push(step.id);
        if (step.branches && step.branches.length > 0) {
          // Just follow the first branch for the animation preview
          flat = flat.concat(flattenSteps(step.branches[0].steps));
        }
      }
      return flat;
    };

    const sequence = flattenSteps(activeWorkflow.steps);
    const currentPlayed: string[] = [];
    
    for (const stepId of sequence) {
      setPlayingStepId(stepId);
      currentPlayed.push(stepId);
      setPlayedStepIds([...currentPlayed]);
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1500ms per step
    }
    
    setPlayingStepId(null);
    setIsPlaying(false);
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h1 className="text-xl font-bold">YBX Fitness</h1>
            <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>GHL Automation</p>
          </div>
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className={`text-xs font-bold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Workflows
          </div>
          {workflows.map((workflow) => {
            const Icon = workflow.icon;
            const isActive = activeWorkflowId === workflow.id;
            return (
              <button
                key={workflow.id}
                onClick={() => {
                  setActiveWorkflowId(workflow.id);
                  setIsMobileMenuOpen(false);
                  setPlayingStepId(null);
                  setPlayedStepIds([]);
                  setIsPlaying(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? (isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-900 text-white shadow-md')
                    : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-400')} />
                <span className="font-medium text-sm truncate">{workflow.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className={`border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button 
              className={`lg:hidden p-2 -ml-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Tabs */}
            <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <button 
                onClick={() => setActiveTab('visualizer')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'visualizer' ? (isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
              >
                <LayoutTemplate size={16} /> <span className="hidden sm:inline">Flowchart</span>
              </button>
              <button 
                onClick={() => setActiveTab('technical')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'technical' ? (isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
              >
                <FileText size={16} /> <span className="hidden sm:inline">Details</span>
              </button>
              <button 
                onClick={() => setActiveTab('tags')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'tags' ? (isDarkMode ? 'bg-gray-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')}`}
              >
                <Tags size={16} /> <span className="hidden sm:inline">GHL Tags</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'visualizer' && (
              <>
                <button 
                  onClick={playAnimation}
                  disabled={isPlaying}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isPlaying ? 'bg-blue-100 text-blue-400 cursor-not-allowed dark:bg-blue-900/50 dark:text-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'}`}
                >
                  <Play size={16} className={isPlaying ? 'animate-pulse' : ''} /> Play
                </button>
                <button 
                  onClick={downloadPDF}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : 'border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'}`}
                >
                  <Download size={16} /> PDF
                </button>
              </>
            )}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-auto p-6 md:p-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50/50'}`}>
          
          {activeTab === 'visualizer' && (
            <div className="min-w-max mx-auto pb-20" ref={flowchartRef} id="flowchart-container">
              <div className="mb-8 text-center max-w-2xl mx-auto whitespace-normal">
                <h2 className="text-3xl font-bold mb-3">{activeWorkflow.name}</h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activeWorkflow.description}</p>
                <p className={`mt-4 text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500 border shadow-sm'}`}>
                  💡 Hover over nodes for more details
                </p>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorkflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <FlowStepList steps={activeWorkflow.steps} activeStepId={playingStepId} playedStepIds={playedStepIds} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="max-w-4xl mx-auto pb-20">
              <h2 className="text-3xl font-bold mb-8">Technical Details</h2>
              <div className="space-y-6">
                {workflows.map(wf => (
                  <div key={wf.id} className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                        <wf.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold">{wf.name}</h3>
                    </div>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{wf.description}</p>
                    <div className={`p-4 rounded-xl text-sm leading-relaxed ${isDarkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-700'}`}>
                      <strong>Implementation Notes:</strong><br/>
                      {wf.technicalDetails}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="max-w-4xl mx-auto pb-20">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold">GHL Tags Dictionary</h2>
                <div className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={14} />
                  All tags converted from PDFs
                </div>
              </div>
              <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>A complete list of all tags used across the YBX Fitness automation system for routing and duplicate prevention.</p>
              
              <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                      <th className="p-4 font-semibold text-sm w-1/3">Tag Name</th>
                      <th className="p-4 font-semibold text-sm">Purpose & Logic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {ghlTags.map((tag, idx) => (
                      <tr key={idx} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                            <Tag size={12} /> {tag.name}
                          </span>
                        </td>
                        <td className={`p-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {tag.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
