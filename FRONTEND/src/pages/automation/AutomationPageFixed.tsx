import React, { useEffect, useState } from 'react';
import { Plus, Zap, Clock, AlertCircle, X, Edit2, Trash2 } from 'lucide-react';
import { Card, Badge } from '@components/ui/BaseComponents';
import {
  runEscalation,
  getStuckTasks,
  getOverdueTasks,
  listAutomations,
  createAutomation,
  updateAutomation,
  deleteAutomation,
  type Automation,
} from '@services/automationService';
import { useUIStore } from '@stores/uiStore';

export const AutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'stuck' | 'overdue'>('rules');
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [stuckTasks, setStuckTasks] = useState<any[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'escalation' as const,
    enabled: true,
    triggerType: 'stuck_task' as const,
    hoursThreshold: 24,
  });

  const { addNotification } = useUIStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [autos, stuck, overdue] = await Promise.all([
        listAutomations(),
        getStuckTasks(24),
        getOverdueTasks(),
      ]);
      setAutomations(autos);
      setStuckTasks(stuck);
      setOverdueTasks(overdue);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'escalation',
      enabled: true,
      triggerType: 'stuck_task',
      hoursThreshold: 24,
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setIsSaving(true);

    try {
      const payload: Partial<Automation> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        enabled: formData.enabled,
        trigger: { type: formData.triggerType, hoursThreshold: formData.hoursThreshold },
        action: { type: formData.type, config: {} },
      };

      if (editingId) {
        const updated = await updateAutomation(editingId, payload);
        setAutomations((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...updated } : a)));
      } else {
        const created = await createAutomation(payload);
        setAutomations((prev) => [...prev, created as Automation]);
      }
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAutomation(id);
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (automation: Automation) => {
    setFormData({
      name: automation.name,
      description: automation.description || '',
      type: automation.type,
      enabled: automation.enabled,
      triggerType: automation.trigger.type as any,
      hoursThreshold: automation.trigger.hoursThreshold || 24,
    });
    setEditingId(automation.id);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Automations</h1>
          <p className="text-slate-400 mt-1">Manage automation rules</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                console.log('🚀 Escalate button clicked');
                const result = await runEscalation();
                console.log('✅ Escalation result:', result);
                addNotification({ type: 'success', message: `Escalated ${result?.affected || 0} tasks` });
              } catch (err: any) {
                console.error('❌ Escalate error:', err?.response?.data || err?.message || err);
                addNotification({ 
                  type: 'error', 
                  message: err?.response?.data?.message || 'Failed to escalate tasks' 
                });
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <Zap size={18} />
            Escalate
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            New Rule
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-700">
        {[
          { id: 'rules', label: 'Rules', icon: Zap },
          { id: 'stuck', label: 'Stuck', icon: Clock },
          { id: 'overdue', label: 'Overdue', icon: AlertCircle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id as any)}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === id ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit' : 'Create'}</h2>
              <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
                rows={3}
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
              >
                <option value="escalation">Escalation</option>
                <option value="notification">Notification</option>
                <option value="status_update">Status Update</option>
              </select>
              <select
                value={formData.triggerType}
                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
              >
                <option value="stuck_task">Stuck Task</option>
                <option value="overdue_task">Overdue Task</option>
                <option value="manual">Manual</option>
              </select>
              {formData.triggerType !== 'manual' && (
                <input
                  type="number"
                  placeholder="Hours"
                  value={formData.hoursThreshold}
                  onChange={(e) => setFormData({ ...formData, hoursThreshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600"
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-white">Enabled</span>
              </label>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-slate-600 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <Card>
          {automations.length === 0 ? (
            <p className="text-slate-400">No automations</p>
          ) : (
            <div className="space-y-2">
              {automations.map((auto) => (
                <div key={auto.id} className="flex justify-between items-start p-3 bg-slate-700/30 rounded border border-slate-700">
                  <div>
                    <h3 className="font-medium text-white">{auto.name}</h3>
                    <p className="text-sm text-slate-400">{auto.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(auto)} className="p-2 hover:bg-slate-600 rounded">
                      <Edit2 size={16} className="text-indigo-400" />
                    </button>
                    <button type="button" onClick={() => handleDelete(auto.id)} className="p-2 hover:bg-slate-600 rounded">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'stuck' && (
        <Card>
          {stuckTasks.length === 0 ? (
            <p className="text-slate-400">No stuck tasks</p>
          ) : (
            <div className="space-y-2">
              {stuckTasks.map((task) => (
                <div key={task.id} className="p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                  <p className="text-white font-medium">{task.title}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'overdue' && (
        <Card>
          {overdueTasks.length === 0 ? (
            <p className="text-slate-400">No overdue tasks</p>
          ) : (
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div key={task.id} className="p-3 bg-red-900/20 border border-red-700 rounded">
                  <p className="text-white font-medium">{task.title}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
