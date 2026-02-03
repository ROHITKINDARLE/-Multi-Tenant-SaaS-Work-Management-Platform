// dashboard/DashboardPage.tsx
import React, { useEffect } from 'react';
import {
  CheckCircle,
  Users,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import {
  Card,
  Avatar,
} from '@components/ui/BaseComponents';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAnalyticsStore } from '@stores/analyticsStore';

export const DashboardPage: React.FC = () => {
  const {
    efficiency,
    workload,
    loadAnalytics,
  } = useAnalyticsStore();

  useEffect(() => {
    loadAnalytics();
  }, []);

  /* =======================
     DERIVED METRICS
     ======================= */
  const metrics = [
    {
      title: 'Total Tasks',
      value: workload?.totalTasks ?? '--',
      icon: CheckCircle,
    },
    {
      title: 'In Progress',
      value: workload?.inProgress ?? '--',
      icon: Zap,
    },
    {
      title: 'Completion Rate',
      value: efficiency?.completionRate
        ? `${efficiency.completionRate}%`
        : '--',
      icon: Target,
    },
    {
      title: 'Team Members',
      value: workload?.activeMembers ?? '--',
      icon: Users,
    },
  ];

  const throughputData =
    efficiency?.throughput?.map((d: any) => ({
      label: d.label,
      completed: d.completed ?? 0,
      inProgress: d.inProgress ?? 0,
      inReview: d.inReview ?? 0,
    })) ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-in-down">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Welcome back! Here's what's happening with your work
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="glass-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">
                {metric.title}
              </h3>
              <p className="text-3xl font-bold text-white">
                {metric.value}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Throughput Chart */}
      <div className="glass-dark p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">
          Weekly Throughput
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="inProgress" fill="#6366f1" />
              <Bar dataKey="inReview" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity (placeholder – backend not exposed) */}
      <div className="glass-dark p-6 rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            Recent Activity
          </h3>
          <Activity size={22} className="text-indigo-400" />
        </div>

        <p className="text-slate-400 text-sm">
          Recent activity will appear here once supported by the backend.
        </p>
      </div>
    </div>
  );
};
