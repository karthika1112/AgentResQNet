import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { AnimatedBackground } from '../components/common/AnimatedBackground';

export const LandingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
