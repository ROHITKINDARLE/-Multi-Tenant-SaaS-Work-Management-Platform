import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Lock, Users, Shield, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { Card, Button, Badge, Input, Avatar } from '@components/ui/BaseComponents';

export const RBACPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const roles = [
    {
      id: '1',
      name: 'Admin',
      description: 'Full access to all features and settings',
      permissions: ['create_project', 'manage_users', 'delete_project', 'configure_workflows', 'view_analytics'],
      userCount: 2,
      icon: '👑',
      color: 'from-red-500 to-pink-500',
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Can manage projects and team members',
      permissions: ['create_project', 'manage_tasks', 'view_analytics'],
      userCount: 4,
      icon: '📋',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: '3',
      name: 'Contributor',
      description: 'Can create and update tasks',
      permissions: ['create_task', 'edit_task', 'comment'],
      userCount: 8,
      icon: '🛠️',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: '4',
      name: 'Viewer',
      description: 'Read-only access to projects and tasks',
      permissions: ['view_project', 'view_task'],
      userCount: 3,
      icon: '👁️',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  const users = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'admin',
      workspace_role: 'owner',
      status: 'active',
      joinedDate: '2024-01-15',
      avatar: 'SC',
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'manager',
      workspace_role: 'admin',
      status: 'active',
      joinedDate: '2024-01-20',
      avatar: 'JD',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@company.com',
      role: 'contributor',
      workspace_role: 'member',
      status: 'active',
      joinedDate: '2024-02-01',
      avatar: 'MW',
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma@company.com',
      role: 'contributor',
      workspace_role: 'member',
      status: 'active',
      joinedDate: '2024-02-05',
      avatar: 'ED',
    },
    {
      id: '5',
      name: 'Alex Johnson',
      email: 'alex@company.com',
      role: 'viewer',
      workspace_role: 'member',
      status: 'active',
      joinedDate: '2024-02-10',
      avatar: 'AJ',
    },
  ];

  const permissionDescriptions: Record<string, string> = {
    create_project: 'Create new projects',
    manage_users: 'Manage team members and roles',
    delete_project: 'Delete projects',
    configure_workflows: 'Configure workflow automation',
    view_analytics: 'View team analytics',
    create_task: 'Create new tasks',
    edit_task: 'Edit existing tasks',
    comment: 'Comment on tasks',
    view_project: 'View projects',
    view_task: 'View tasks',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-in-down">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Access Control
        </h1>
        <p className="text-slate-400 mt-2">Manage roles, permissions, and team members</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700/50 animate-slide-in-up">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-medium transition-all relative group ${
            activeTab === 'roles'
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock size={16} />
            Roles & Permissions
          </div>
          {activeTab === 'roles' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 animate-slide-in-left"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition-all relative group ${
            activeTab === 'users'
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} />
            Team Members
          </div>
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 animate-slide-in-left"></div>
          )}
        </button>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setShowRoleForm(!showRoleForm)}>
              <Plus size={18} />
              New Role
            </Button>
          </div>

          {showRoleForm && (
            <Card className="border-indigo-500/50">
              <h3 className="text-lg font-bold text-white mb-4">Create Custom Role</h3>
              <div className="space-y-4">
                <Input label="Role Name" placeholder="e.g., Project Lead" />
                <Input label="Description" placeholder="Describe the role responsibilities" />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(permissionDescriptions).map(([key, desc]) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 bg-slate-800 border border-slate-700 rounded accent-indigo-500 mt-1"
                        />
                        <div>
                          <p className="text-sm text-white">{desc}</p>
                          <p className="text-xs text-slate-500">{key}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="primary">Create Role</Button>
                  <Button variant="secondary" onClick={() => setShowRoleForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-up">
            {roles.map((role, idx) => (
              <div
                key={role.id}
                className="group glass-dark rounded-2xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] cursor-pointer animate-bounce-in"
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                {/* Header with gradient */}
                <div className={`h-24 bg-gradient-to-br ${role.color} relative overflow-hidden flex items-center justify-between p-6`}>
                  <div className="text-3xl">{role.icon}</div>
                  <Shield size={20} className="text-white/70" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {role.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{role.description}</p>
                  </div>

                  {/* Permissions */}
                  <div className="pt-3 border-t border-slate-700/50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Key Permissions ({role.permissions.length})
                    </p>
                    <div className="space-y-2">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <div key={perm} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                          {permissionDescriptions[perm]}
                        </div>
                      ))}
                      {role.permissions.length > 3 && (
                        <div className="text-xs text-indigo-400 font-medium">
                          +{role.permissions.length - 3} more permissions
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Members */}
                  <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-400">{role.userCount} members</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {hoveredRole === role.id && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 animate-fade-in flex gap-2">
                      <button className="flex-1 py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-1">
                        <Edit2 size={12} />
                        Edit
                      </button>
                      <button className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-semibold text-red-300 transition-all duration-200 flex items-center justify-center gap-1">
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button variant="primary">
              <Plus size={18} />
              Invite Member
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="table-header text-left">Name</th>
                    <th className="table-header text-left">Email</th>
                    <th className="table-header text-left">Role</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Joined</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50 transition-all">
                      <td className="table-cell">
                        <p className="text-white font-medium">{user.name}</p>
                      </td>
                      <td className="table-cell text-slate-400">{user.email}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <Badge variant="primary">{user.role}</Badge>
                          <Badge variant="primary">{user.workspace_role}</Badge>
                        </div>
                      </td>
                      <td className="table-cell">
                        <Badge variant="success">{user.status}</Badge>
                      </td>
                      <td className="table-cell text-slate-500">
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-center gap-2">
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-all">
                            <Edit2 size={16} className="text-slate-400 hover:text-indigo-400" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-700 rounded transition-all">
                            <Trash2 size={16} className="text-slate-400 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
