import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, Badge } from '@components/ui/BaseComponents';
import { TrendingUp, Users, Zap, Clock } from 'lucide-react';
import { useAnalyticsStore } from '@stores/analyticsStore';
import { useAuthStore } from '@stores/authStore';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { user } = useAuthStore();
  const {
    efficiency,
    workload,
    delayRisk,
    loadAnalytics,
  } = useAnalyticsStore();

  /* =======================
     RBAC (UI ONLY)
     ======================= */
  if (user?.role !== 'Admin') {
    return null;
  }

  /* =======================
     LOAD DATA
     ======================= */
  useEffect(() => {
    const { loadAnalytics } = useAnalyticsStore.getState();
    loadAnalytics();
  }, []);

  /* =======================
     DEFENSIVE DATA MAPPING
     ======================= */

  // Throughput (workflow efficiency)
  const throughputData =
    efficiency?.throughput && Array.isArray(efficiency.throughput)
      ? efficiency.throughput.map((item: any) => ({
          date: item.label || item.date,
          completed: item.completed || 0,
          inProgress: item.inProgress || 0,
          inReview: item.inReview || 0,
        }))
      : [];

  // Task distribution by workflow state
  const taskDistribution =
    workload?.byState && Array.isArray(workload.byState)
      ? workload.byState.map((state: any) => ({
          name: state.name,
          value: state.count,
          color: state.color || '#6366f1',
        }))
      : [];

  // Team workload
  const teamPerformance =
    workload?.byUser && Array.isArray(workload.byUser)
      ? workload.byUser.map((u: any) => ({
          member: u.name,
          completed: u.completed ?? 0,
          inProgress: u.inProgress ?? 0,
          pending: u.pending ?? 0,
        }))
      : [];

  // Burndown (delay risk)
  const burndownData =
    delayRisk?.burndown && Array.isArray(delayRisk.burndown)
      ? delayRisk.burndown.map((b: any) => ({
          week: b.label,
          planned: b.planned,
          actual: b.actual,
        }))
      : [];

  /* =======================
     METRICS
     ======================= */
  const metrics = [
    {
      title: 'Avg Completion Time',
      value: efficiency?.avgCompletionTime
        ? `${efficiency.avgCompletionTime} days`
        : '--',
      trend: efficiency?.completionTrend ?? '--',
      icon: Clock,
      color: 'indigo',
    },
    {
      title: 'Team Efficiency',
      value: efficiency?.efficiencyRate
        ? `${efficiency.efficiencyRate}%`
        : '--',
      trend: efficiency?.efficiencyTrend ?? '--',
      icon: Zap,
      color: 'purple',
    },
    {
      title: 'On-Time Rate',
      value: delayRisk?.onTimeRate
        ? `${delayRisk.onTimeRate}%`
        : '--',
      trend: delayRisk?.onTimeTrend ?? '--',
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      title: 'Active Members',
      value: workload?.activeMembers ?? '--',
      trend: workload?.memberTrend ?? '--',
      icon: Users,
      color: 'pink',
    },
  ];

  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">
            Team performance and project insights
          </p>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const bgGradient =
            colorMap[metric.color as keyof typeof colorMap];

          return (
            <Card key={metric.title} className="hover:border-indigo-500">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`bg-gradient-to-br ${bgGradient} p-3 rounded-lg`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <Badge variant={metric.color as any}>
                  {metric.trend}
                </Badge>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Throughput */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">
            Task Throughput
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={throughputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="inProgress" fill="#6366f1" />
              <Bar dataKey="inReview" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task Distribution */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6">
            Task Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {taskDistribution.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">
          Team Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="member" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" />
            <Bar dataKey="inProgress" fill="#6366f1" />
            <Bar dataKey="pending" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Burndown */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6">
          Project Burndown
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={burndownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#8b5cf6"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
