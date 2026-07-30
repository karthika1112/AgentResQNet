import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <ShieldAlert className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse"></div>
        </div>
        <span className="text-xl font-heading font-bold tracking-wider text-white">
          ResQ<span className="text-primary">Net</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-4">
        <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/command-center" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Command Center</Link>
        <Link to="/login" className="btn-secondary text-sm">Login</Link>
      </div>
    </nav>
  );
};
