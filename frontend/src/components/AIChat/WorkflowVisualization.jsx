import React from 'react';
import { WorkflowNode } from './WorkflowNode';
import { ShieldCheck, Activity } from 'lucide-react';

export const WorkflowVisualization = ({ workflowId, nodes, overallConfidence }) => {
  if (!workflowId && (!nodes || nodes.length === 0)) return null;

  return (
    <div className="w-full bg-[#141C2D] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          <Activity size={16} className="mr-2 text-blue-400" />
          Live Orchestration Engine
        </h3>
        {workflowId && (
          <span className="text-xs font-mono text-gray-500">ID: {workflowId}</span>
        )}
      </div>

      <div className="flex flex-col">
        {nodes && nodes.map((node, idx) => (
          <WorkflowNode 
            key={`${node.agent}-${idx}`} 
            agent={node.agent} 
            status={node.status} 
            latency={node.latency} 
          />
        ))}
      </div>

      {overallConfidence !== undefined && (
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center">
            <ShieldCheck size={14} className="mr-1 text-green-400" />
            Verified Confidence Score
          </span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-800 rounded-full mr-3 overflow-hidden">
              <div 
                className={`h-full ${overallConfidence > 80 ? 'bg-green-500' : overallConfidence > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${overallConfidence}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-white">{overallConfidence}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
