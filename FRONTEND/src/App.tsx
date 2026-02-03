// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { TasksPage } from '@pages/tasks/TasksPage';
import { ProjectsPage } from '@pages/projects/ProjectsPage';
import { AnalyticsPage } from '@pages/analytics/AnalyticsPage';
import { WorkflowsPage } from '@pages/workflows/WorkflowsPage';
import { RBACPage } from '@pages/rbac/RBACPage';
import { TeamPage } from '@pages/team/TeamPage';
import { AutomationPage as AutomationPageFixed } from '@pages/automation/AutomationPageFixed';
import { SettingsPage } from '@pages/settings/SettingsPage';

import { Header } from '@components/layout/Header';
import { Sidebar } from '@components/layout/Sidebar';
import { useAuthStore } from '@stores/authStore';

/* ============================
   Layout
============================ */
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/* ============================
   Auth Guard
============================ */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Wait for session restoration to complete
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

/* ============================
   RBAC Guard (UI only)
============================ */
const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: Array<'Admin' | 'Manager' | 'Contributor' | 'Viewer'>;
}> = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/* ============================
   App
============================ */
export const App: React.FC = () => {
  const { restoreSession } = useAuthStore();

  /* 🔁 Restore session on refresh */
  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---------- PROTECTED ---------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN / MANAGER ---------- */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['Admin', 'Manager']}>
                <AnalyticsPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ONLY ---------- */}
        <Route
          path="/workflows"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['Admin']}>
                <WorkflowsPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rbac"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['Admin']}>
                <RBACPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/automation"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['Admin']}>
                <AutomationPageFixed />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* ---------- DEFAULT ---------- */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
