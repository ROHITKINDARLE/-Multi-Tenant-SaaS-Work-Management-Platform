import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare2,
  Users,
  Settings,
  BarChart3,
  Zap,
  FolderOpen,
  Workflow,
  ArrowRight,
} from 'lucide-react';
import { useUIStore } from '@stores/uiStore';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', group: 'Main' },
  { icon: CheckSquare2, label: 'Tasks', path: '/tasks', group: 'Main' },
  { icon: FolderOpen, label: 'Projects', path: '/projects', group: 'Main' },
  { icon: Users, label: 'Team', path: '/team', group: 'Workspace' },
  { icon: Workflow, label: 'Workflows', path: '/workflows', group: 'Workspace' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', group: 'Insights' },
  { icon: Zap, label: 'Automation', path: '/automation', group: 'Insights' },
  { icon: Users, label: 'RBAC', path: '/rbac', group: 'Admin' },
  { icon: Settings, label: 'Settings', path: '/settings', group: 'Admin' },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const group = acc.find((g) => g.name === item.group);
      if (group) {
        group.items.push(item);
      } else {
        acc.push({ name: item.group, items: [item] });
      }
      return acc;
    },
    [] as Array<{ name: string; items: typeof menuItems }>
  );

  return (
    <aside
      className={clsx(
        'bg-slate-900/50 backdrop-blur-sm border-r border-slate-800 transition-all duration-300 sticky top-0 h-screen overflow-y-auto',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="p-6 space-y-8">
        {groupedItems.map((group) => (
          <div key={group.name}>
            {sidebarOpen && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">
                {group.name}
              </h3>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      'sidebar-link w-full justify-start',
                      isActive &&
                        'active bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-600'
                    )}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {sidebarOpen && (
        <div className="p-6 border-t border-slate-800">
          <div className="glass-dark p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Need Help?</h4>
            <p className="text-xs text-slate-400 mb-3">
              Check our docs or contact support
            </p>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-all">
              Get Help
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
