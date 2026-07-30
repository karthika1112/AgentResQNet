import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { PremiumLoader } from './components/loader/PremiumLoader';
import { LandingLayout } from './layouts/LandingLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/landing/LandingPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { DemoProvider } from './contexts/DemoContext';
import { DemoModeToggle } from './components/Presentation/DemoModeToggle';
import { PresentationPanel } from './components/Presentation/PresentationPanel';
import { ArchitecturePage } from './pages/presentation/ArchitecturePage';
import { AboutPage } from './pages/presentation/AboutPage';
import { RoleRoute } from './components/common/RoleRoute';

// Lazy loaded pages for performance optimization (Code Splitting)
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const AdminDashboard = React.lazy(() => import('./pages/dashboards/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const VictimDashboard = React.lazy(() => import('./pages/dashboards/VictimDashboard').then(module => ({ default: module.VictimDashboard })));
const VolunteerDashboard = React.lazy(() => import('./pages/dashboards/VolunteerDashboard').then(module => ({ default: module.VolunteerDashboard })));
const ResponderDashboard = React.lazy(() => import('./pages/dashboards/ResponderDashboard').then(module => ({ default: module.ResponderDashboard })));
const AIAgentsPage = React.lazy(() => import('./pages/dashboards/AIAgentsPage').then(module => ({ default: module.AIAgentsPage })));
const VictimChatPage = React.lazy(() => import('./pages/dashboards/VictimChatPage').then(module => ({ default: module.VictimChatPage })));
const VictimReportPage = React.lazy(() => import('./pages/dashboards/VictimReportPage').then(module => ({ default: module.VictimReportPage })));
const VolunteerOfferPage = React.lazy(() => import('./pages/dashboards/VolunteerOfferPage').then(module => ({ default: module.VolunteerOfferPage })));

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <AuthProvider>
      <DemoProvider>
        <BrowserRouter>
          {loading && <PremiumLoader onComplete={() => setLoading(false)} />}
          
          <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
            <DemoModeToggle />
            <PresentationPanel />
            <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#030712] text-white">Loading modules...</div>}>
              <Routes>
                <Route element={<LandingLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/architecture" element={<ArchitecturePage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Route>
              
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {/* Victim Routes */}
                <Route path="/victim-dashboard" element={<RoleRoute allowedRoles={['Victim']}><VictimDashboard /></RoleRoute>} />
                <Route path="/report" element={<RoleRoute allowedRoles={['Victim']}><VictimReportPage /></RoleRoute>} />
                <Route path="/shelters" element={<RoleRoute allowedRoles={['Victim', 'Admin']}><PlaceholderPage title="View Shelters" message="Safe zones map." /></RoleRoute>} />
                <Route path="/chat" element={<RoleRoute allowedRoles={['Victim']}><VictimChatPage /></RoleRoute>} />

                {/* Volunteer Routes */}
                <Route path="/volunteer-dashboard" element={<RoleRoute allowedRoles={['Volunteer']}><VolunteerDashboard /></RoleRoute>} />
                <Route path="/missions" element={<RoleRoute allowedRoles={['Volunteer']}><VolunteerOfferPage /></RoleRoute>} />
                <Route path="/navigation" element={<RoleRoute allowedRoles={['Volunteer']}><PlaceholderPage title="Navigation" message="Routing to drop zones." /></RoleRoute>} />

                {/* Responder Routes */}
                <Route path="/responder-dashboard" element={<RoleRoute allowedRoles={['Responder']}><ResponderDashboard /></RoleRoute>} />
                <Route path="/rescues" element={<RoleRoute allowedRoles={['Responder']}><PlaceholderPage title="Active Rescues" message="Track assigned rescues." /></RoleRoute>} />
                <Route path="/map" element={<RoleRoute allowedRoles={['Responder']}><PlaceholderPage title="Live Map" message="Incident locations." /></RoleRoute>} />
                <Route path="/comms" element={<RoleRoute allowedRoles={['Responder']}><PlaceholderPage title="Comms" message="Emergency communications channel." /></RoleRoute>} />

                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<RoleRoute allowedRoles={['Admin']}><AdminDashboard /></RoleRoute>} />
                <Route path="/command-center" element={<RoleRoute allowedRoles={['Admin']}><PlaceholderPage title="Command Center" message="Live operational map and live events feed." /></RoleRoute>} />
                <Route path="/agents" element={<RoleRoute allowedRoles={['Admin']}><AIAgentsPage /></RoleRoute>} />
                <Route path="/responder" element={<RoleRoute allowedRoles={['Admin']}><PlaceholderPage title="Responder Management" message="Advanced tactical interface for emergency responders." /></RoleRoute>} />
                <Route path="/volunteer" element={<RoleRoute allowedRoles={['Admin']}><PlaceholderPage title="Volunteer Management" message="Task assignment and coordination for volunteers." /></RoleRoute>} />
                <Route path="/victim" element={<RoleRoute allowedRoles={['Admin']}><PlaceholderPage title="Victim Management" message="SOS requests and live guidance for citizens." /></RoleRoute>} />
                <Route path="/admin" element={<RoleRoute allowedRoles={['Admin']}><PlaceholderPage title="Admin Console" message="System configuration and role management." /></RoleRoute>} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </div>
        
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'rgba(20, 28, 45, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} />
      </BrowserRouter>
    </DemoProvider>
  </AuthProvider>
);
}

export default App;
