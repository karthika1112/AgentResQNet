import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const LoadingSpinner = ({ className, size = 24 }) => (
  <Loader2 
    size={size} 
    className={clsx('animate-spin text-primary', className)} 
  />
);
