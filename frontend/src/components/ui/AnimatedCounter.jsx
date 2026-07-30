import { motion } from 'framer-motion';

export const AnimatedCounter = ({ value, label }) => {
  // Placeholder implementation for AnimatedCounter
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-4xl font-heading font-bold text-primary"
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-400 font-sans mt-1">{label}</div>
    </div>
  );
};
