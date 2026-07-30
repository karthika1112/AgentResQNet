import React from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { User, Brain, Database, ShieldAlert, MapPin, Navigation, Package, CheckCircle } from 'lucide-react';

const workflowNodes = [
  { id: 0, icon: User, label: 'Victim (User)' },
  { id: 1, icon: Brain, label: 'Commander Agent' },
  { id: 2, icon: Database, label: 'Intelligence Agent' },
  { id: 3, icon: ShieldAlert, label: 'Verification Agent' },
  { id: 4, icon: MapPin, label: 'Evacuation Agent' },
  { id: 5, icon: Navigation, label: 'Rescue Agent' },
  { id: 6, icon: Package, label: 'Resource Agent' },
  { id: 7, icon: CheckCircle, label: 'Response Deployed' }
];

export const WorkflowAnimation = () => {
  const { currentWorkflowStep } = useDemo();

  return (
    <div className="bg-[#0B0F19] rounded-xl p-6 border border-[rgba(255,255,255,0.05)] w-full overflow-x-auto custom-scrollbar">
      <h3 className="text-white font-bold mb-6 tracking-wider text-sm uppercase text-center">Live Multi-Agent Workflow Execution</h3>
      
      <div className="flex items-center justify-between min-w-[800px] relative px-4">
        {/* Background connecting line */}
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-[rgba(255,255,255,0.1)] -translate-y-1/2 z-0"></div>
        
        {/* Active connecting line (animated) */}
        <div 
          className="absolute top-1/2 left-10 h-0.5 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          style={{ width: `calc(${currentWorkflowStep * (100 / (workflowNodes.length - 1))}% - 20px)` }}
        ></div>

        {workflowNodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = currentWorkflowStep === index;
          const isPassed = currentWorkflowStep > index;

          return (
            <div key={node.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive 
                    ? 'bg-blue-600 border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-125' 
                    : isPassed 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-500' 
                      : 'bg-[#141C2D] border border-gray-700 text-gray-500'
                }`}
              >
                <Icon size={isActive ? 24 : 18} className={isActive ? 'text-white' : ''} />
              </div>
              <div className={`mt-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                isActive ? 'text-blue-400' : isPassed ? 'text-green-500/70' : 'text-gray-600'
              }`}>
                {node.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
