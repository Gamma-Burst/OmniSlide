import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, PlusCircle, Settings, LogOut, FileText } from 'lucide-react';
import { useProjectStore } from '../store';

const Sidebar: React.FC = () => {
  const { currentUser } = useProjectStore();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-64 border-r border-white/5 bg-[#080808] flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
            O
          </div>
          <span className="font-bold text-lg tracking-tight text-white">OmniSlide</span>
        </div>

        <nav className="space-y-2">
          <NavLink to="/dashboard" className={navClass}>
            <LayoutGrid size={20} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <FileText size={20} />
            <span className="font-medium">Templates</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-not-allowed opacity-50">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className="glass-panel p-4 rounded-xl flex items-center space-x-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
             {currentUser?.name?.charAt(0) || 'U'}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
             <p className="text-xs text-blue-400">Pro Plan Active</p>
           </div>
        </div>
        
        <NavLink to="/" className="flex items-center space-x-2 text-xs text-gray-500 hover:text-white transition-colors">
          <LogOut size={14} />
          <span>Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
