import React, { useState } from 'react';
import { Settings, Bell, Lock, Users, Eye, Zap, Save } from 'lucide-react';
import { Card, Button, Input } from '@components/ui/BaseComponents';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'notifications' | 'security'>('workspace');
  const [settings, setSettings] = useState({
    workspaceName: 'Acme Corporation',
    description: 'Product development and innovation',
    defaultLanguage: 'English',
    timezone: 'UTC-8 (Pacific)',
  });

  const tabs = [
    { id: 'workspace', label: 'Workspace', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage workspace preferences and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-indigo-400 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Workspace Settings */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-white mb-6">Workspace Settings</h2>

            <div className="space-y-4">
              <Input
                label="Workspace Name"
                value={settings.workspaceName}
                onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
              />

              <Input
                label="Description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Language
                </label>
                <select className="input-field">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Timezone
                </label>
                <select className="input-field">
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC-6 (Central)</option>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC (GMT)</option>
                </select>
              </div>

              <Button variant="primary" className="w-full">
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Member Management</h2>
            <p className="text-slate-400 mb-4">
              Manage workspace members and their access levels
            </p>
            <Button variant="secondary">View Members</Button>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

          <div className="space-y-4">
            {[
              { label: 'Task assigned to you', checked: true },
              { label: 'Task status changed', checked: true },
              { label: 'Comment on your task', checked: true },
              { label: 'Team member joined', checked: false },
              { label: 'Project milestone reached', checked: true },
              { label: 'Weekly digest', checked: true },
              { label: 'Automation rule triggered', checked: true },
              { label: 'System updates', checked: false },
            ].map((notif, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={notif.checked}
                  className="w-4 h-4 bg-slate-800 border border-slate-700 rounded accent-indigo-500"
                />
                <span className="text-white">{notif.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <Button variant="primary">
              <Save size={18} />
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm Password" type="password" />
              <Button variant="primary" className="w-full">
                Update Password
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Two-Factor Authentication</h2>
            <p className="text-slate-400 mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="secondary">Enable 2FA</Button>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows', location: 'San Francisco, CA', time: 'Active now' },
                { device: 'Safari on iPhone', location: 'San Francisco, CA', time: '2 hours ago' },
              ].map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{session.device}</p>
                    <p className="text-slate-500 text-sm">{session.location} • {session.time}</p>
                  </div>
                  <Button variant="danger" size="sm">Logout</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-red-500/30 bg-red-500/5">
            <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-slate-400 mb-4">
              These actions cannot be undone. Please be careful.
            </p>
            <Button variant="danger">Delete Workspace</Button>
          </Card>
        </div>
      )}
    </div>
  );
};
