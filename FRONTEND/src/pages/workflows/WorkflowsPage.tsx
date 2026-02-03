// workflows/WorkFlowsPage.tsx
import React, { useEffect, useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Card, Button, Badge } from '@components/ui/BaseComponents';
import { useAuthStore } from '@stores/authStore';
import {
  getWorkflowStates,
  getWorkflowTransitions,
} from '@services/workflowService';

interface WorkflowState {
  id: string;
  name: string;
  category: string;
  color?: string;
}

interface WorkflowTransition {
  id: string;
  from_state: string;
  to_state: string;
}

export const WorkflowsPage: React.FC = () => {
  const { user } = useAuthStore();

  const [states, setStates] = useState<WorkflowState[]>([]);
  const [transitions, setTransitions] = useState<WorkflowTransition[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     RBAC – UI ONLY
     ======================= */
  if (user?.role !== 'Admin') {
    return null;
  }

  /* =======================
     LOAD WORKFLOWS
     ======================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [statesRes, transitionsRes] = await Promise.all([
          getWorkflowStates(),
          getWorkflowTransitions(),
        ]);

        setStates(statesRes);
        setTransitions(transitionsRes);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getStateById = (id: string) =>
    states.find((s) => s.id === id);

  if (loading) {
    return (
      <div className="text-slate-400">
        Loading workflows…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Workflows
        </h1>
        <p className="text-slate-400">
          System-wide workflow states and allowed transitions
        </p>
      </div>

      {/* Workflow States */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">
            Workflow States
          </h2>
        </div>

        {states.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No workflow states configured.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {states.map((state) => (
              <div
                key={state.id}
                className="p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:border-indigo-500 transition-all text-center"
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: state.color ?? '#6366f1' }}
                />
                <p className="text-white font-medium text-sm">
                  {state.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {state.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Transitions */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <ArrowRight className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">
            Allowed Transitions
          </h2>
        </div>

        {transitions.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No transitions configured.
          </p>
        ) : (
          <div className="space-y-3">
            {transitions.map((t) => {
              const from = getStateById(t.from_state);
              const to = getStateById(t.to_state);

              if (!from || !to) return null;

              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="primary">
                      {from.name}
                    </Badge>
                    <ArrowRight size={16} className="text-slate-500" />
                    <Badge variant="success">
                      {to.name}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Automations */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-indigo-400" />
          <h2 className="text-xl font-bold text-white">
            Automations
          </h2>
        </div>

        <p className="text-slate-400 text-sm">
          Workflow automations are configured via backend rules.
          Use the Automations page to trigger escalation logic.
        </p>

        <Button variant="secondary" disabled className="mt-4">
          Manage Automations (Coming Soon)
        </Button>
      </Card>
    </div>
  );
};
