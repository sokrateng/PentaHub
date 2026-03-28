import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  Plus,
  Calendar,
  ChevronRight,
  Banknote,
  Star,
  User as UserIcon,
  Filter,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { tasksApi, usersApi, projectsApi } from '@/services/api';
import type { ProjectTask, TaskKanbanColumn, CreateTaskRequest } from '@/types';
import { getInitials, formatDate } from '@/lib/utils';
import { PRIMARY_COLOR, PRIORITY_LABELS } from '@/lib/constants';

const COLUMN_COLORS = [
  '#f59e0b',
  '#3b82f6',
  'hsl(153 60% 33%)',
  '#8b5cf6',
  '#10b981',
  '#ef4444',
  '#f97316',
];


function PriorityStars({ priority }: { priority: number }) {
  if (priority === 0) return null;
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

interface TaskCardProps {
  task: ProjectTask;
  index: number;
  onClick: () => void;
}

function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={[
            'bg-white rounded-lg border border-border p-3 cursor-pointer',
            'hover:shadow-md hover:border-border/80 transition-all duration-150',
            snapshot.isDragging ? 'shadow-lg rotate-1 opacity-90' : '',
          ].join(' ')}
        >
          {/* Task number */}
          <div className="flex items-start justify-between gap-1.5 mb-1.5">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {task.taskNumber}
            </span>
            <PriorityStars priority={task.priority} />
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2">
            {task.title}
          </h4>

          {/* Assignee */}
          {task.assigneeName && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {getInitials(task.assigneeName)}
              </div>
              <span className="text-xs text-muted-foreground truncate">{task.assigneeName}</span>
            </div>
          )}

          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-1 flex-wrap">
            {task.isBillable && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5 font-medium">
                <Banknote className="w-2.5 h-2.5" />
                Faturalanabilir
              </Badge>
            )}
            {task.subTaskCount > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-medium">
                {task.subTaskCount} alt görev
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          {task.progressPercent > 0 && (
            <div className="mt-2.5">
              <div className="w-full bg-muted rounded-full h-1">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${task.progressPercent}%`,
                    backgroundColor: 'hsl(153 60% 33%)',
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                %{task.progressPercent}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

interface QuickAddProps {
  onAdd: (title: string) => void;
  isLoading: boolean;
}

function QuickAddInput({ onAdd, isLoading }: QuickAddProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
    if (e.key === 'Escape') {
      setValue('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className="mt-2 px-1">
      <Input
        ref={inputRef}
        placeholder="Görev adı... (Enter ile ekle)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="h-8 text-xs"
      />
    </div>
  );
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

const defaultForm: NewTaskForm = {
  title: '',
  description: '',
  assigneeId: '',
  priority: '0',
  isBillable: false,
  startDate: '',
  dueDate: '',
  plannedHours: '0',
};

function KanbanSkeleton() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-shrink-0 w-72 min-w-[280px]">
          <div className="h-8 bg-muted rounded mb-3 animate-pulse" />
          <div className="space-y-2.5">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TasksPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = Number(projectIdParam);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewTaskForm>(defaultForm);
  const [activeQuickAdd, setActiveQuickAdd] = useState<number | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const { data: columnsResponse, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: () => tasksApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const { data: projectResponse } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const moveStageMutation = useMutation({
    mutationFn: ({ id, stageId }: { id: number; stageId: number }) =>
      tasksApi.moveStage(id, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (task: CreateTaskRequest) => tasksApi.create(projectId, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      setDialogOpen(false);
      setForm(defaultForm);
    },
  });

  const quickCreateMutation = useMutation({
    mutationFn: ({ stageId, title }: { stageId: number; title: string }) => {
      const task: CreateTaskRequest = {
        title,
        projectId,
        priority: 0,
        isBillable: false,
        plannedHours: 0,
      };
      return tasksApi.create(projectId, task).then(async (result) => {
        if (result.data) {
          await tasksApi.moveStage(result.data.id, stageId);
        }
        return result;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      setActiveQuickAdd(null);
    },
  });

  const columns: TaskKanbanColumn[] = columnsResponse?.data ?? [];
  const project = projectResponse?.data;
  const users = usersResponse?.data ?? [];

  const filteredColumns = columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter((task) => {
      if (filterAssignee !== 'all' && String(task.assigneeId) !== filterAssignee) return false;
      if (filterPriority !== 'all' && String(task.priority) !== filterPriority) return false;
      return true;
    }),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStageId = Number(result.destination.droppableId);
    const taskId = Number(result.draggableId);
    const sourceStageId = Number(result.source.droppableId);
    if (sourceStageId === newStageId) return;
    moveStageMutation.mutate({ id: taskId, stageId: newStageId });
  };

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const payload: CreateTaskRequest = {
      title: form.title.trim(),
      description: form.description || undefined,
      projectId,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : undefined,
      priority: Number(form.priority),
      isBillable: form.isBillable,
      startDate: form.startDate || undefined,
      dueDate: form.dueDate || undefined,
      plannedHours: Number(form.plannedHours) || 0,
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Breadcrumb + top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projeler
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          {project ? (
            <Link
              to={`/projects/${projectId}`}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]"
            >
              {project.name}
            </Link>
          ) : (
            <span className="text-muted-foreground">...</span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">Görevler</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Assignee filter */}
          <Select value={filterAssignee} onValueChange={(v) => setFilterAssignee(v ?? 'all')}>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <UserIcon className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Atanan">
                {filterAssignee === 'all'
                  ? 'Tüm Kişiler'
                  : users.find((u) => String(u.id) === filterAssignee)?.fullName ?? 'Atanan'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kişiler</SelectItem>
              {users.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority filter */}
          <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? 'all')}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <Filter className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Öncelik">
                {filterPriority === 'all'
                  ? 'Tüm Öncelikler'
                  : PRIORITY_LABELS[Number(filterPriority)] ?? 'Öncelik'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Öncelikler</SelectItem>
              {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={() => navigate(`/projects/${projectId}/gantt`)}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Gantt
          </Button>

          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Görev
          </Button>
        </div>
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <KanbanSkeleton />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-4 flex-1">
            {filteredColumns.map((col, colIndex) => {
              const color = COLUMN_COLORS[colIndex % COLUMN_COLORS.length];
              return (
                <div key={col.stageId} className="flex-shrink-0 w-72 min-w-[280px]">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold text-foreground flex-1 truncate">
                      {col.stageName}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {col.tasks.length}
                    </span>
                    <button
                      onClick={() => setActiveQuickAdd(activeQuickAdd === col.stageId ? null : col.stageId)}
                      className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      aria-label="Hızlı görev ekle"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Column body */}
                  <div className="rounded-xl pt-0.5">
                    <div
                      className="rounded-t-xl h-0.5 mb-2"
                      style={{ backgroundColor: color }}
                    />
                    <Droppable droppableId={String(col.stageId)}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={[
                            'space-y-2.5 min-h-[100px] rounded-lg p-1 transition-colors',
                            snapshot.isDraggingOver ? 'bg-muted/60' : '',
                          ].join(' ')}
                        >
                          {col.tasks.map((task, index) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={index}
                              onClick={() => navigate(`/tasks/${task.id}`)}
                            />
                          ))}
                          {provided.placeholder}
                          {col.tasks.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-xs text-muted-foreground text-center py-8 opacity-60">
                              Görev yok
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>

                    {/* Quick add input */}
                    {activeQuickAdd === col.stageId && (
                      <QuickAddInput
                        onAdd={(title) =>
                          quickCreateMutation.mutate({ stageId: col.stageId, title })
                        }
                        isLoading={quickCreateMutation.isPending}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* New Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Görev Adı <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Görev adı giriniz..."
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Açıklama</label>
              <textarea
                placeholder="Görev açıklaması..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Atanan Kişi</label>
              <Select
                value={form.assigneeId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, assigneeId: value ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kişi seçin...">
                    {form.assigneeId
                      ? users.find((u) => String(u.id) === form.assigneeId)?.fullName ?? 'Kişi seçin...'
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {user.fullName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Öncelik</label>
              <Select
                value={form.priority}
                onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    {PRIORITY_LABELS[Number(form.priority)] ?? 'Yok'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Başlangıç Tarihi</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Bitiş Tarihi</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Planned hours */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Planlanan Saat</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={form.plannedHours}
                onChange={(e) => setForm((prev) => ({ ...prev, plannedHours: e.target.value }))}
              />
            </div>

            {/* isBillable */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBillable}
                onChange={(e) => setForm((prev) => ({ ...prev, isBillable: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium">Faturalanabilir</span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.title.trim() || createMutation.isPending}
              style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            >
              {createMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
