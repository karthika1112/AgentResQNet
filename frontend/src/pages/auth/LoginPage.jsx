import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Secure connection established.');
      
      const role = user?.role;
      if (role === 'Admin') navigate('/admin-dashboard');
      else if (role === 'Responder') navigate('/responder-dashboard');
      else if (role === 'Volunteer') navigate('/volunteer-dashboard');
      else navigate('/victim-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#030712] to-[#030712] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -mt-[300px] -ml-[300px] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0B0F19]/80 backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-black text-white font-['Space_Grotesk'] tracking-widest uppercase">Secure Login</h2>
            <p className="text-gray-400 text-sm mt-2 font-mono tracking-wider">ENTER CREDENTIALS TO ACCESS EOC</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Agent Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-[rgba(15,23,42,0.6)] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm"
                  placeholder="agent@resqnet.gov"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Passcode</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-[rgba(15,23,42,0.6)] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm tracking-widest"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest uppercase py-3.5 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center mt-6">
              <LogIn className="w-5 h-5 mr-2" />
              Authenticate
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6 font-mono">
            New operative? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Request Access</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
