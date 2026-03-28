import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { TasksPage } from '@/pages/TasksPage';
import { TaskDetailPage } from '@/pages/TaskDetailPage';
import { SprintsPage } from '@/pages/SprintsPage';
import { SprintDetailPage } from '@/pages/SprintDetailPage';
import { BacklogPage } from '@/pages/BacklogPage';
import { GanttPage } from '@/pages/GanttPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { UserTimeSheetsPage } from '@/pages/UserTimeSheetsPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { ContactDetailPage } from '@/pages/ContactDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { GlobalTasksPage } from '@/pages/GlobalTasksPage';
import { UserSettingsPage } from '@/pages/UserSettingsPage';
import { useAuthStore } from '@/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppWithAuth() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
          <Route path="/projects/:projectId/gantt" element={<GanttPage />} />
          <Route path="/tasks" element={<GlobalTasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/sprints" element={<SprintsPage />} />
          <Route path="/sprints/:id" element={<SprintDetailPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/timesheets" element={<UserTimeSheetsPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/PentaHub">
        <AppWithAuth />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
