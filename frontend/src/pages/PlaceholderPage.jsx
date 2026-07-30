import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Settings } from 'lucide-react';

export const PlaceholderPage = ({ title, message }) => {
  return (
    <div className="h-full flex flex-col">
      <PageHeader title={title} subtitle="Module Placeholder" />
      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          title={`${title} Module Under Construction`} 
          message={message} 
          icon={Settings} 
        />
      </div>
    </div>
  );
};
