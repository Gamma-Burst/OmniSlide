
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LiquidEditor from './components/LiquidEditor';
import Sidebar from './components/Sidebar';

// Wrapper for Dashboard Layout
const DashboardLayout = () => (
  <div className="flex bg-[#050505] min-h-screen text-white">
    <Sidebar />
    <main className="flex-1 ml-64">
      <Dashboard />
    </main>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <LiquidEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
