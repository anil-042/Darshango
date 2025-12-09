import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserManagement from './pages/admin/UserManagement';
import NotFound from './pages/NotFound';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomeDashboard } from './components/HomeDashboard';
import { AgencyMapping } from './components/AgencyMapping';
import { ProjectManagement } from './components/ProjectManagement';
import { ProjectDetails } from './components/ProjectDetails';
import { FundFlow } from './components/FundFlow';
import { HelpChatbox } from './components/HelpChatbox';
import { MonitoringInspections } from './components/MonitoringInspections';
import { InspectionDetails } from './components/InspectionDetails';

import { AlertsEscalations } from './components/AlertsEscalations';
import { Reports } from './components/Reports';
import { Communication } from './components/Communication';
import { Admin } from './components/Admin';
import { GrievanceList } from './components/grievances/GrievanceList';
import { GrievanceDetail } from './components/grievances/GrievanceDetail';


function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-saffron-50 via-white to-india-green-50">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto bg-transparent">
            {children}
          </main>
        </div>
      </div>
      <HelpChatbox />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><HomeDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/agency-mapping" element={
            <ProtectedRoute>
              <Layout><AgencyMapping /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout><ProjectManagement /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <Layout><ProjectDetails /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/adarsh-gram" element={
            <ProtectedRoute>
              <Layout><ProjectManagement component="Adarsh Gram" /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/gia" element={
            <ProtectedRoute>
              <Layout><ProjectManagement component="GIA" /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/hostel" element={
            <ProtectedRoute>
              <Layout><ProjectManagement component="Hostel" /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/fund-flow" element={
            <ProtectedRoute>
              <Layout><FundFlow /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/monitoring" element={
            <ProtectedRoute>
              <Layout><MonitoringInspections /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/monitoring/:id" element={
            <ProtectedRoute>
              <Layout><InspectionDetails /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/grievances" element={
            <ProtectedRoute>
              <Layout><GrievanceList /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/grievances/:id" element={
            <ProtectedRoute>
              <Layout><GrievanceDetail /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/alerts" element={
            <ProtectedRoute>
              <Layout><AlertsEscalations /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/communication" element={
            <ProtectedRoute>
              <Layout><Communication /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin Only Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><Admin /></Layout>
            </ProtectedRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
