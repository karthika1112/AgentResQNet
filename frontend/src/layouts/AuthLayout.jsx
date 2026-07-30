import { Outlet, Link } from 'react-router-dom';
import { AnimatedBackground } from '../components/common/AnimatedBackground';
import { GlassCard } from '../components/common/GlassCard';
import { ShieldAlert } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      <AnimatedBackground />
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-primary" />
            <span className="text-2xl font-heading font-bold text-white">
              ResQ<span className="text-primary">Net</span>
            </span>
          </Link>
        </div>
        <GlassCard className="p-8">
          <Outlet />
        </GlassCard>
      </div>
    </div>
  );
};
