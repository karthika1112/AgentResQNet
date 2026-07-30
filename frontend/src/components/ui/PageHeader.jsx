export const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-heading font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-gray-400 font-sans">{subtitle}</p>}
    </div>
  );
};
