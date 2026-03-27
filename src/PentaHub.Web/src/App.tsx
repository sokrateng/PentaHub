import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
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
import { PlaceholderPage } from '@/pages/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
            <Route path="/projects/:projectId/gantt" element={<GanttPage />} />
            <Route path="/tasks" element={<PlaceholderPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/sprints" element={<SprintsPage />} />
            <Route path="/sprints/:id" element={<SprintDetailPage />} />
            <Route path="/backlog" element={<BacklogPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
