import clsx from 'clsx';

export const StatusBadge = ({ status, type = 'default' }) => {
  const colors = {
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    primary: 'bg-primary/20 text-primary border-primary/30',
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  };

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium border', colors[type] || colors.default)}>
      {status}
    </span>
  );
};
