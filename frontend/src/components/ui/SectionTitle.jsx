export const SectionTitle = ({ title }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-xl font-heading font-semibold text-white">{title}</h2>
      <div className="h-px bg-white/10 flex-1"></div>
    </div>
  );
};
