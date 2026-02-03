import React from 'react';
import { Menu, Bell, Settings, LogOut, User, Zap } from 'lucide-react';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { Avatar } from '../ui/BaseComponents';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">DOPS</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-all"
            >
              <Avatar name={user?.name || 'User'} size="md" />
              <span className="text-sm font-medium text-slate-300">{user?.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-dark rounded-lg shadow-lg p-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all text-sm">
                  <User size={16} />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all text-sm">
                  <Settings size={16} />
                  Settings
                </button>
                <hr className="my-2 border-slate-700" />
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
