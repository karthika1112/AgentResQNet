import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Menu, Bell, User, LogOut, ChevronRight, ChevronDown, Activity, 
  Database, Server, Cpu, Cloud, Settings, LayoutDashboard, Crosshair, Globe, 
  Brain, AlertOctagon, Radio, Home, Ambulance, Package, Users, UsersRound, 
  Shield, BarChart2, HeartPulse, Workflow, ScrollText, Play, HeartHandshake
} from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemo } from '../contexts/DemoContext';

const GlobalStatusStrip = () => {
  const [time, setTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toUTCString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-7 w-full bg-[#030712] border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between px-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest z-50 relative">
      <div className="flex items-center space-x-6">
        <span className="flex items-center text-blue-500"><Activity size={10} className="mr-1 animate-pulse" /> SYSTEM ONLINE</span>
        <span>UTC: {time}</span>
        <span className="hidden md:inline">ENC: AES-256</span>
      </div>
      <div className="flex items-center space-x-6">
        <span className="flex items-center text-green-500"><Database size={10} className="mr-1" /> DB: 12ms</span>
        <span className="flex items-center text-green-500"><Server size={10} className="mr-1" /> WSS: 4ms</span>
        <span className="flex items-center text-green-500"><Cpu size={10} className="mr-1" /> AI: 350ms</span>
        <span className="flex items-center text-yellow-500 hidden md:flex"><Cloud size={10} className="mr-1" /> USGS: 1.2s</span>
      </div>
    </div>
  );
};

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const path = location.pathname.split('/')[1] || 'dashboard';
  const { role } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toggleDemoMode } = useDemo();
  
  // State for expandable menus
  const [expandedMenus, setExpandedMenus] = useState({
    commandCenter: true,
    aiAgents: false,
    admin: false
  });

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const adminMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
    { 
      name: 'Command Center', 
      icon: Crosshair, 
      isParent: true,
      id: 'commandCenter',
      subItems: [
        { name: 'Live Global Map', icon: Globe, path: '/admin-dashboard?tab=map' },
        { name: 'Incidents', icon: AlertOctagon, path: '/admin-dashboard?tab=incidents' },
        { name: 'Emergency Alerts', icon: Radio, path: '/admin-dashboard?tab=alerts', badge: 3 },
        { name: 'SOS Requests', icon: HeartPulse, path: '/admin-dashboard?tab=sos-requests' },
        { name: 'Evacuation Centers', icon: Home, path: '/admin-dashboard?tab=shelters' },
        { name: 'Rescue Operations', icon: Ambulance, path: '/admin-dashboard?tab=rescues' },
        { name: 'Resources', icon: Package, path: '/admin-dashboard?tab=resources' },
      ]
    },
    { 
      name: 'AI Agents', 
      icon: Brain, 
      isParent: true,
      id: 'aiAgents',
      subItems: [
        { name: 'Commander', path: '/admin-dashboard?tab=agent-commander' },
        { name: 'Disaster Intelligence', path: '/admin-dashboard?tab=agent-intelligence' },
        { name: 'Incident Verification', path: '/admin-dashboard?tab=agent-verification' },
        { name: 'Evacuation', path: '/admin-dashboard?tab=agent-evacuation' },
        { name: 'Rescue', path: '/admin-dashboard?tab=agent-rescue' },
        { name: 'Resources', path: '/admin-dashboard?tab=agent-resources' },
      ]
    },
    { 
      name: 'Administration', 
      icon: Shield, 
      isParent: true,
      id: 'admin',
      subItems: [
        { name: 'Volunteer Offers', icon: HeartHandshake, path: '/admin-dashboard?tab=volunteer-offers', badge: 1 },
        { name: 'Volunteers', icon: Users, path: '/admin-dashboard?tab=volunteers' },
        { name: 'Victims', icon: UsersRound, path: '/admin-dashboard?tab=victims' },
        { name: 'Users & Roles', icon: Shield, path: '/admin-dashboard?tab=users' },
        { name: 'Analytics', icon: BarChart2, path: '/admin-dashboard?tab=analytics' },
        { name: 'System Health', icon: HeartPulse, path: '/admin-dashboard?tab=health' },
        { name: 'Workflow Monitor', icon: Workflow, path: '/admin-dashboard?tab=workflow' },
        { name: 'Audit Logs', icon: ScrollText, path: '/admin-dashboard?tab=logs' },
        { name: 'Settings', icon: Settings, path: '/admin-dashboard?tab=settings' },
      ]
    }
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'Admin':
        return adminMenu;
      case 'Responder':
        return [
          { name: 'Tactical Center', path: '/responder-dashboard' },
          { name: 'Active Rescues', path: '/rescues' },
          { name: 'Live Map', path: '/map' }
        ];
      case 'Volunteer':
        return [
          { name: 'Operations', path: '/volunteer-dashboard' },
          { name: 'Offer Help', path: '/missions' }
        ];
      case 'Victim':
      default:
        return [
          { name: 'SOS Portal', path: '/victim-dashboard' },
          { name: 'AI Assistant', path: '/chat' },
          { name: 'Request Help', path: '/report' }
        ];
    }
  };

  const menuItems = getMenuItems();

  const renderLink = (item, isSubItem = false) => {
    // Determine active state based on search params for admin dashboard routing
    const search = location.search;
    const isActive = item.path.includes('?') 
      ? location.pathname + search === item.path 
      : location.pathname === item.path && search === '';

    const Icon = item.icon || ChevronRight;

    return (
      <Link 
        key={item.path} 
        to={item.path}
        title={item.name}
        className={`group flex items-center justify-between py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
          isSubItem ? 'pl-10 pr-4 mt-1 text-sm' : 'px-4'
        } ${
          isActive 
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
            : 'text-gray-400 hover:bg-[rgba(255,255,255,0.03)] hover:text-white border border-transparent'
        }`}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>}
        <div className="flex items-center">
          <Icon size={16} className={`mr-3 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
          <span className="font-medium tracking-wide">{item.name}</span>
        </div>
        
        {item.badge && (
          <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col text-gray-200 font-sans overflow-hidden">
      <GlobalStatusStrip />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-[rgba(255,255,255,0.05)] bg-[rgba(10,15,28,0.85)] backdrop-blur-2xl flex flex-col relative z-20"
            >
              <div className="p-6 border-b border-[rgba(255,255,255,0.05)]">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <ShieldAlert className="w-8 h-8 text-blue-500 relative z-10" />
                  </div>
                  <span className="text-xl font-black tracking-[0.1em] text-white uppercase font-['Space_Grotesk']">ResQNet AI</span>
                </Link>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold px-4 py-3">
                  Operations
                </div>
                
                {menuItems.map(item => {
                  if (item.isParent) {
                    const isExpanded = expandedMenus[item.id];
                    const ParentIcon = item.icon;
                    return (
                      <div key={item.id} className="mb-1">
                        <button 
                          onClick={() => toggleMenu(item.id)}
                          className="w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[rgba(255,255,255,0.03)] text-gray-400 hover:text-white"
                        >
                          <div className="flex items-center">
                            <ParentIcon size={16} className="mr-3 text-gray-500 group-hover:text-gray-300" />
                            <span className="font-medium tracking-wide text-sm">{item.name}</span>
                          </div>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {item.subItems.map(sub => renderLink(sub, true))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  
                  return renderLink(item);
                })}
              </nav>

              {/* Presentation Mode Button in Sidebar for Admins */}
              {role === 'Admin' && (
                <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
                  <button 
                    onClick={toggleDemoMode}
                    className="w-full flex items-center justify-center py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  >
                    <Play size={14} className="mr-2" />
                    Presentation Mode
                  </button>
                  <Link to="/about" className="block text-center mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    About Platform
                  </Link>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Floating Navbar */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(10,15,28,0.5)] backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-['Space_Grotesk'] font-bold text-white tracking-widest uppercase hidden sm:block drop-shadow-lg">
                {path.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase mr-2 items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
                Role: {role}
              </div>

              <button className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.03)] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.05)] relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
              </button>
              
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors border border-red-500/20"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};
