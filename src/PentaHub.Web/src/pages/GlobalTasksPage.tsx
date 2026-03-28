import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  Calendar,
  User as UserIcon,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { projectsApi, tasksApi, usersApi } from '@/services/api';
import type { ProjectTask, TaskKanbanColumn, CreateTaskRequest } from '@/types';
import { getInitials, formatDate } from '@/lib/utils';
import { PRIMARY_COLOR } from '@/lib/constants';

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

interface NewTaskForm {
  title: string;
  description: string;
  assigneeId: string;
  priority: string;
  isBillable: boolean;
  startDate: string;
  dueDate: string;
  plannedHours: string;
}

const defaultTaskForm: NewTaskForm = {
  title: '',
  description: '',
  assigneeId: '',
  priority: '0',
  isBillable: false,
  startDate: '',
  dueDate: '',
  plannedHours: '0',
};

export function GlobalTasksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState<NewTaskForm>(defaultTaskForm);

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

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const users = usersResponse?.data ?? [];

  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskRequest) =>
      tasksApi.create(selectedId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', selectedId] });
      setTaskDialogOpen(false);
      setTaskForm(defaultTaskForm);
    },
  });

  const handleCreateTask = () => {
    if (!taskForm.title.trim() || selectedId === null) return;
    const payload: CreateTaskRequest = {
      title: taskForm.title.trim(),
      description: taskForm.description || undefined,
      projectId: selectedId,
      assigneeId: taskForm.assigneeId ? Number(taskForm.assigneeId) : undefined,
      priority: Number(taskForm.priority),
      isBillable: taskForm.isBillable,
      startDate: taskForm.startDate || undefined,
      dueDate: taskForm.dueDate || undefined,
      plannedHours: Number(taskForm.plannedHours) || 0,
    };
    createTaskMutation.mutate(payload);
  };

  const allTasks: ProjectTask[] = selectedId !== null
    ? flattenColumns(tasksResponse?.data ?? [])
    : [];
  const normalize = (s: string) => s.toLocaleLowerCase('tr-TR');
  const tasks = searchQuery
    ? allTasks.filter((t) => normalize(t.title).includes(normalize(searchQuery)))
    : allTasks;

  const isLoading = isLoadingProjects || (selectedId !== null && isLoadingTasks);

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-foreground">Görevler</h1>

        {/* Project filter + new task button */}
        <div className="flex items-center gap-2">
          <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v ?? 'all')}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue placeholder="Proje seçin...">
                {selectedProjectId === 'all'
                  ? 'Tüm Projeler'
                  : projects.find((p) => String(p.id) === selectedProjectId)?.name ?? 'Proje seçin...'}
              </SelectValue>
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

          {selectedProjectId !== 'all' && (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
              onClick={() => setTaskDialogOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Görev
            </Button>
          )}
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
                            style={{ backgroundColor: PRIMARY_COLOR }}
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

      {/* New Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Başlık <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Görev başlığı..."
                value={taskForm.title}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Açıklama</label>
              <textarea
                placeholder="Görev açıklaması..."
                value={taskForm.description}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Atanan Kişi</label>
              <Select
                value={taskForm.assigneeId}
                onValueChange={(v) => setTaskForm((prev) => ({ ...prev, assigneeId: v ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kişi seçin...">
                    {taskForm.assigneeId
                      ? users.find((u) => String(u.id) === taskForm.assigneeId)?.fullName ?? 'Kişi seçin...'
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Öncelik</label>
              <Select
                value={taskForm.priority}
                onValueChange={(v) => setTaskForm((prev) => ({ ...prev, priority: v ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    {taskForm.priority === '0' ? 'Yok'
                      : taskForm.priority === '1' ? 'Düşük'
                      : taskForm.priority === '2' ? 'Normal'
                      : taskForm.priority === '3' ? 'Yüksek'
                      : taskForm.priority === '4' ? 'Acil'
                      : 'Yok'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Yok</SelectItem>
                  <SelectItem value="1">Düşük</SelectItem>
                  <SelectItem value="2">Normal</SelectItem>
                  <SelectItem value="3">Yüksek</SelectItem>
                  <SelectItem value="4">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Başlangıç Tarihi</label>
                <Input
                  type="date"
                  value={taskForm.startDate}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Bitiş Tarihi</label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Planlanan Saat</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={taskForm.plannedHours}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, plannedHours: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={taskForm.isBillable}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, isBillable: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium">Faturalanabilir</span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!taskForm.title.trim() || createTaskMutation.isPending}
              style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            >
              {createTaskMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
