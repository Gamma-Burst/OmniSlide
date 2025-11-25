import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LiquidEditor from './components/LiquidEditor';
import Sidebar from './components/Sidebar';
import { useProjectStore } from './store';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/dashboard" element={
          <div className="flex bg-[#050505] min-h-screen text-white">
            <Sidebar />
            <main className="flex-1 ml-64">
              <Dashboard />
            </main>
          </div>
        } />
        
        <Route path="/project/:id" element={
           <LiquidEditor />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;