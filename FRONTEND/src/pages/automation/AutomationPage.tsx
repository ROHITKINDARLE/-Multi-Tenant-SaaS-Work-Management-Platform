import React, { useEffect, useState } from 'react';
import { Plus, Zap, Clock, AlertCircle, X, Edit2, Trash2 } from 'lucide-react';
import { Card, Button, Badge } from '@components/ui/BaseComponents';
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

  // Load data on mount
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
      console.error('Load data error:', err);
      addNotification({
        type: 'error',
        message: 'Failed to load data',
      });
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

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        message: 'Name is required',
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Automation> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        enabled: formData.enabled,
        trigger: {
          type: formData.triggerType,
          hoursThreshold: formData.hoursThreshold,
        },
        action: {
          type: formData.type,
          config: {},
        },
      };

      if (editingId) {
        const updated = await updateAutomation(editingId, payload);
        setAutomations((prev) =>
          prev.map((a) => (a.id === editingId ? { ...a, ...updated } : a))
        );
        addNotification({
          type: 'success',
          message: 'Updated successfully',
        });
      } else {
        const created = await createAutomation(payload);
        setAutomations((prev) => [...prev, created as Automation]);
        addNotification({
          type: 'success',
          message: 'Created successfully',
        });
      }

      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      addNotification({
        type: 'error',
        message: 'Failed to save',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this automation?')) return;

    try {
      await deleteAutomation(id);
      setAutomations((prev) => prev.filter((a) => a.id !== id));
      addNotification({
        type: 'success',
        message: 'Deleted',
      });
    } catch (err) {
      console.error('Delete error:', err);
      addNotification({
        type: 'error',
        message: 'Failed to delete',
      });
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

  const handleEscalate = async () => {
    try {
      const result = await runEscalation();
      addNotification({
        type: 'success',
        message: `Escalated ${result.affected || 0} tasks`,
      });
    } catch (err) {
      console.error('Escalate error:', err);
      addNotification({
        type: 'error',
        message: 'Failed to escalate',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Automations</h1>
          <p className="text-slate-400">
            Configure intelligent automation rules
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEscalate} className="flex items-center gap-2" type="button">
            <Zap size={18} />
            Run Escalation
          </Button>
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
            type="button"
          >
            <Plus size={18} />
            New Rule
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        {[
          { id: 'rules', label: 'Rules', icon: Zap },
          { id: 'stuck', label: 'Stuck Tasks', icon: Clock },
          { id: 'overdue', label: 'Overdue Tasks', icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 ${
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

      {/* Debug: Show modal state */}
      <div className="mb-4 p-2 bg-blue-900/50 rounded text-blue-200 text-sm">
        Modal Open: {showCreateModal ? 'YES' : 'NO'}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Automation' : 'Create Automation'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g., Auto Escalate Stuck Tasks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe what this automation does"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="escalation">Escalation</option>
                  <option value="notification">Notification</option>
                  <option value="status_update">Status Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Trigger Type
                </label>
                <select
                  value={formData.triggerType}
                  onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="stuck_task">Stuck Task</option>
                  <option value="overdue_task">Overdue Task</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {formData.triggerType !== 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hours Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.hoursThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, hoursThreshold: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="enabled" className="text-sm text-slate-300">
                  Enabled
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveAutomation}
                  variant="primary"
                  className="flex-1"
                >
                  {editingId ? 'Update' : 'Create'} Automation
                </Button>
                <Button
                  onClick={handleCloseModal}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'rules' && (
        <Card>
          {loading ? (
            <p className="text-slate-400">Loading automations...</p>
          ) : automations.length === 0 ? (
            <p className="text-slate-400">No automations configured yet.</p>
          ) : (
            <div className="space-y-3">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">{automation.name}</h3>
                    {automation.description && (
                      <p className="text-sm text-slate-400 mb-2">{automation.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{automation.type}</Badge>
                      <Badge variant={automation.enabled ? 'primary' : 'secondary'}>
                        {automation.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {automation.trigger.type}
                        {automation.trigger.hoursThreshold && ` (${automation.trigger.hoursThreshold}h)`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditAutomation(automation)}
                      className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} className="text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteAutomation(automation.id)}
                      className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                    >
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
          {loading ? (
            <p className="text-slate-400">Loading stuck tasks...</p>
          ) : stuckTasks.length === 0 ? (
            <p className="text-slate-400">No stuck tasks found.</p>
          ) : (
            <div className="space-y-2">
              {stuckTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg"
                >
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-xs text-slate-400">
                    Status: {task.status} • Hours: {task.hours_in_state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'overdue' && (
        <Card>
          {loading ? (
            <p className="text-slate-400">Loading overdue tasks...</p>
          ) : overdueTasks.length === 0 ? (
            <p className="text-slate-400">No overdue tasks found.</p>
          ) : (
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-red-900/20 border border-red-700 rounded-lg"
                >
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-xs text-slate-400">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

