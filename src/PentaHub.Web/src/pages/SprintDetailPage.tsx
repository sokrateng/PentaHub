import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  Target,
  Calendar,
  CheckCircle2,
  Star,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { sprintsApi, backlogApi } from '@/services/api';
import { SprintState } from '@/types';
import type { ProjectTask } from '@/types';

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
  if (priority === 0) return <span className="text-xs text-muted-foreground">—</span>;
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

const STATE_STEPS = [
  { state: SprintState.Draft, label: 'Taslak' },
  { state: SprintState.InProgress, label: 'Devam Eden' },
  { state: SprintState.Done, label: 'Tamamlandı' },
];

interface StateBarProps {
  currentState: SprintState;
  onChangeState: (newState: SprintState) => void;
  isChanging: boolean;
}

function StateBar({ currentState, onChangeState, isChanging }: StateBarProps) {
  return (
    <div className="flex items-center gap-0 bg-white rounded-xl border border-border overflow-hidden w-fit">
      {STATE_STEPS.map((step, index) => {
        const isActive = step.state === currentState;
        const isPast = step.state < currentState;
        const isClickable = step.state !== currentState && !isChanging;

        return (
          <button
            key={step.state}
            onClick={() => isClickable && onChangeState(step.state)}
            disabled={!isClickable || isChanging}
            className={[
              'px-4 py-2 text-xs font-medium transition-colors flex items-center gap-1.5',
              index > 0 ? 'border-l border-border' : '',
              isActive
                ? 'text-white'
                : isPast
                ? 'text-muted-foreground hover:bg-muted/50 cursor-pointer'
                : 'text-muted-foreground hover:bg-muted/50 cursor-pointer',
              !isClickable && !isActive ? 'cursor-default' : '',
            ].join(' ')}
            style={isActive ? { backgroundColor: 'hsl(153 60% 33%)' } : {}}
          >
            {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
            {step.label}
          </button>
        );
      })}
    </div>
  );
}

interface AddTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  sprintId: number;
  currentTaskIds: Set<number>;
  onAssign: (taskIds: number[]) => void;
  isAssigning: boolean;
}

function AddTasksDialog({
  open,
  onOpenChange,
  projectId,
  sprintId,
  currentTaskIds,
  onAssign,
  isAssigning,
}: AddTasksDialogProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { data: backlogResponse, isLoading } = useQuery({
    queryKey: ['backlog', projectId],
    queryFn: () => backlogApi.getByProject(projectId),
    enabled: open && !!projectId,
  });

  const backlogTasks = (backlogResponse?.data ?? []).filter(
    (t) => !currentTaskIds.has(t.id)
  );

  const toggleTask = (taskId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleAssign = () => {
    if (selected.size === 0) return;
    onAssign(Array.from(selected));
    setSelected(new Set());
  };

  const handleClose = () => {
    setSelected(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Görev Ekle</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : backlogTasks.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
              <AlertCircle className="w-8 h-8 opacity-30" />
              <p className="text-sm">Backlog'da atanabilecek görev yok</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {backlogTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(task.id)}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-border accent-primary"
                    style={{ accentColor: 'hsl(153 60% 33%)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                        {task.taskNumber}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </span>
                    </div>
                    {task.assigneeName && (
                      <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                    )}
                  </div>
                  <PriorityStars priority={task.priority} />
                </label>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {selected.size > 0 ? `${selected.size} görev seçildi` : ''}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                İptal
              </Button>
              <Button
                onClick={handleAssign}
                disabled={selected.size === 0 || isAssigning}
                style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
              >
                {isAssigning ? 'Atanıyor...' : 'Ata'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmStateChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetState: SprintState | null;
  onConfirm: () => void;
  isChanging: boolean;
}

function ConfirmStateChangeDialog({
  open,
  onOpenChange,
  targetState,
  onConfirm,
  isChanging,
}: ConfirmStateChangeDialogProps) {
  const label =
    targetState === SprintState.InProgress
      ? 'Sprinti Başlat'
      : targetState === SprintState.Done
      ? 'Sprinti Tamamla'
      : 'Durumu Değiştir';

  const description =
    targetState === SprintState.InProgress
      ? 'Bu sprint başlatılacak. Devam etmek istiyor musunuz?'
      : targetState === SprintState.Done
      ? 'Bu sprint tamamlandı olarak işaretlenecek. Devam etmek istiyor musunuz?'
      : 'Sprint durumu değiştirilecek. Devam etmek istiyor musunuz?';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-2">{description}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isChanging}
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          >
            {isChanging ? 'Değiştiriliyor...' : 'Onayla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SprintDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const sprintId = Number(idParam);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addTasksOpen, setAddTasksOpen] = useState(false);
  const [confirmStateOpen, setConfirmStateOpen] = useState(false);
  const [pendingState, setPendingState] = useState<SprintState | null>(null);

  const { data: sprintResponse, isLoading } = useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: () => sprintsApi.getById(sprintId),
    enabled: !!sprintId,
  });

  const changeStateMutation = useMutation({
    mutationFn: (newState: SprintState) => sprintsApi.changeState(sprintId, newState),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      setConfirmStateOpen(false);
      setPendingState(null);
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: (taskId: number) => sprintsApi.removeTask(sprintId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
    },
  });

  const assignTasksMutation = useMutation({
    mutationFn: (taskIds: number[]) =>
      Promise.all(taskIds.map((taskId) => sprintsApi.assignTask(sprintId, taskId))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
      setAddTasksOpen(false);
    },
  });

  const sprint = sprintResponse?.data;
  const tasks: ProjectTask[] = sprint?.tasks ?? [];
  const currentTaskIds = new Set(tasks.map((t) => t.id));

  const handleStateBarClick = (newState: SprintState) => {
    setPendingState(newState);
    setConfirmStateOpen(true);
  };

  const handleConfirmStateChange = () => {
    if (pendingState !== null) {
      changeStateMutation.mutate(pendingState);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-10 w-80 bg-muted rounded animate-pulse" />
        <div className="h-40 bg-muted rounded-xl animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <AlertCircle className="w-10 h-10 opacity-30" />
        <p className="text-sm">Sprint bulunamadı</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/sprints')}>
          Sprintlere Dön
        </Button>
      </div>
    );
  }

  const progressPercent = sprint.progressPercent ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/sprints"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Sprintler
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-semibold text-foreground truncate max-w-[300px]">
          {sprint.name}
        </span>
      </div>

      {/* State bar + action buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <StateBar
          currentState={sprint.state}
          onChangeState={handleStateBarClick}
          isChanging={changeStateMutation.isPending}
        />

        <div className="flex items-center gap-2">
          {sprint.state === SprintState.Draft && (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
              onClick={() => handleStateBarClick(SprintState.InProgress)}
              disabled={changeStateMutation.isPending}
            >
              Sprinti Başlat
            </Button>
          )}
          {sprint.state === SprintState.InProgress && (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
              onClick={() => handleStateBarClick(SprintState.Done)}
              disabled={changeStateMutation.isPending}
            >
              Sprinti Tamamla
            </Button>
          )}
        </div>
      </div>

      {/* Sprint info card */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{sprint.name}</h2>
            {sprint.projectName && (
              <p className="text-sm text-muted-foreground mt-0.5">{sprint.projectName}</p>
            )}
          </div>
        </div>

        {sprint.goal && (
          <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg">
            <Target className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{sprint.goal}</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {sprint.completedTaskCount}/{sprint.taskCount} görev tamamlandı
            </span>
            <span className="font-semibold text-foreground">%{progressPercent}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'hsl(153 60% 33%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Görevler
            <Badge variant="secondary" className="ml-2 text-xs">
              {tasks.length}
            </Badge>
          </h3>
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
            onClick={() => setAddTasksOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Görev Ekle
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">No</TableHead>
              <TableHead>Görev</TableHead>
              <TableHead>Atanan</TableHead>
              <TableHead>Aşama</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12 text-sm">
                  Bu sprint'te henüz görev yok. "Görev Ekle" butonuna tıklayarak backlog'dan görev ekleyebilirsiniz.
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
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {task.taskNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{task.title}</span>
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
                      <Badge variant="outline" className="text-xs">
                        {task.stageName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PriorityStars priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTaskMutation.mutate(task.id);
                      }}
                      disabled={removeTaskMutation.isPending}
                      className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Sprint'ten çıkar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Tasks Dialog */}
      <AddTasksDialog
        open={addTasksOpen}
        onOpenChange={setAddTasksOpen}
        projectId={sprint.projectId}
        sprintId={sprintId}
        currentTaskIds={currentTaskIds}
        onAssign={(taskIds) => assignTasksMutation.mutate(taskIds)}
        isAssigning={assignTasksMutation.isPending}
      />

      {/* Confirm State Change Dialog */}
      <ConfirmStateChangeDialog
        open={confirmStateOpen}
        onOpenChange={setConfirmStateOpen}
        targetState={pendingState}
        onConfirm={handleConfirmStateChange}
        isChanging={changeStateMutation.isPending}
      />
    </div>
  );
}
