import React from 'react';
import { CheckCircle2, CircleDashed, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const WorkflowNode = ({ agent, status, latency }) => {
  const isPending = status === 'Pending' || !status;
  const isRunning = status === 'Running';
  const isSuccess = status === 'Success';
  const isFailed = status === 'Failed';

  const getIcon = () => {
    if (isRunning) return <CircleDashed className="animate-spin text-blue-400" size={16} />;
    if (isSuccess) return <CheckCircle2 className="text-green-400" size={16} />;
    if (isFailed) return <XCircle className="text-red-400" size={16} />;
    return <Clock className="text-gray-500" size={16} />;
  };

  const getBorderColor = () => {
    if (isRunning) return 'border-blue-500/50';
    if (isSuccess) return 'border-green-500/50';
    if (isFailed) return 'border-red-500/50';
    return 'border-gray-700';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between p-3 rounded-lg border ${getBorderColor()} bg-[#0F1523] mb-2`}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div>
          <div className="text-sm font-medium text-gray-200">{agent}</div>
          <div className="text-xs text-gray-500">{status || 'Waiting in queue...'}</div>
        </div>
      </div>
      
      {latency && (
        <div className="text-xs font-mono text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
          {latency}
        </div>
      )}
    </motion.div>
  );
};
