import React from 'react';
import { motion } from 'framer-motion';

export const ThinkingAnimation = () => {
  return (
    <div className="flex items-center space-x-1 p-2 bg-[#1A2333] rounded-lg w-16 h-8">
      <motion.div 
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div 
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2, ease: "easeInOut" }}
      />
      <motion.div 
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
};
