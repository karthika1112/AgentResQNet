import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ title, message, icon: Icon = AlertCircle }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
      <Icon className="w-12 h-12 text-gray-500 mb-4" />
      <h3 className="text-lg font-heading font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 font-sans max-w-sm">{message}</p>
    </div>
  );
};
