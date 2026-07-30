import { motion } from 'framer-motion';
import clsx from 'clsx';

export const SecondaryButton = ({ children, className, onClick, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx('btn-secondary', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
