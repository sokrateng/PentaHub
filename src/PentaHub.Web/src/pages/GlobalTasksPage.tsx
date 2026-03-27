import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  Calendar,
  User as UserIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { projectsApi, tasksApi } from '@/services/api';
import type { ProjectTask, TaskKanbanColumn } from '@/types';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function PriorityStars({ priority }: { priority: number }) {
  if (priority === 0)
    return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className="w-3 h-3"
          style={{
            color: i <= priority ? '#f59e0b' : '#d1d5db',
            fill: i <= priority ? '#f59e0b' : 'none',
          }}
        />
      ))}
    </div>
  );
}

function flattenColumns(columns: TaskKanbanColumn[]): ProjectTask[] {
  return columns.flatMap((col) => col.tasks);
}

export function GlobalTasksPage() {
  const navigate = useNavigate();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const { data: projectsResponse, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true }),
  });

  const projects = projectsResponse?.data ?? [];

  const selectedId = selectedProjectId !== 'all' ? Number(selectedProjectId) : null;

  const { data: tasksResponse, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['project-tasks', selectedId],
    queryFn: () => tasksApi.getByProject(selectedId!),
    enabled: selectedId !== null,
  });

  const tasks: ProjectTask[] = selectedId !== null
    ? flattenColumns(tasksResponse?.data ?? [])
    : [];

  const isLoading = isLoadingProjects || (selectedId !== null && isLoadingTasks);

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-foreground">Görevler</h1>

        {/* Project filter */}
        <div className="flex items-center gap-2">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue placeholder="Proje seçin..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Projeler</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {isLoadingProjects ? (
        <div className="bg-white rounded-xl border border-border p-8 flex items-center justify-center">
          <div className="space-y-2 w-full max-w-md animate-pulse">
            <div className="h-8 bg-muted rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      ) : selectedProjectId === 'all' ? (
        <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'hsl(153 60% 96%)' }}
          >
            <UserIcon className="w-5 h-5" style={{ color: 'hsl(153 60% 33%)' }} />
          </div>
          <h3 className="text-base font-semibold text-foreground">Proje Seçin</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Görevleri görüntülemek için yukarıdaki filtreden bir proje seçin.
          </p>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="h-10 bg-muted" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-muted border-t border-border/50" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Görev No</TableHead>
                <TableHead className="min-w-[200px]">Başlık</TableHead>
                <TableHead>Proje</TableHead>
                <TableHead>Atanan</TableHead>
                <TableHead>Aşama</TableHead>
                <TableHead>Öncelik</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Son Tarih
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12 text-sm"
                  >
                    Bu projede henüz görev bulunmuyor.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <TableCell>
                      <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {task.taskNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm text-foreground line-clamp-1">
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {task.projectName ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {task.assigneeName ? (
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                            style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                          >
                            {getInitials(task.assigneeName)}
                          </div>
                          <span className="text-sm">{task.assigneeName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.stageName ? (
                        <Badge variant="outline" className="text-xs font-normal">
                          {task.stageName}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <PriorityStars priority={task.priority} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
