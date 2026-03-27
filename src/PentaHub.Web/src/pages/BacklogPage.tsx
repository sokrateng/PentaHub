import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  AlertCircle,
  Layers,
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
import { projectsApi, backlogApi, sprintsApi } from '@/services/api';
import { SprintState } from '@/types';
import type { ProjectTask } from '@/types';

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

function BacklogSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

interface AssignToSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number | null;
  selectedTasks: ProjectTask[];
  onAssign: (sprintId: number) => void;
  isAssigning: boolean;
}

function AssignToSprintDialog({
  open,
  onOpenChange,
  projectId,
  selectedTasks,
  onAssign,
  isAssigning,
}: AssignToSprintDialogProps) {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');

  const { data: sprintsResponse } = useQuery({
    queryKey: ['sprints', projectId, undefined],
    queryFn: () =>
      sprintsApi.getAll({
        projectId: projectId ?? undefined,
      }),
    enabled: open && !!projectId,
  });

  const activeSprints = (sprintsResponse?.data ?? []).filter(
    (s) => s.state !== SprintState.Done
  );

  const handleAssign = () => {
    if (!selectedSprintId) return;
    onAssign(Number(selectedSprintId));
    setSelectedSprintId('');
  };

  const handleClose = () => {
    setSelectedSprintId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Sprint'e Ata</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedTasks.length}</span> görev seçildi.
            Hangi sprint'e atamak istiyorsunuz?
          </p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Sprint</label>
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId}>
              <SelectTrigger>
                <SelectValue placeholder="Sprint seçin..." />
              </SelectTrigger>
              <SelectContent>
                {activeSprints.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    Aktif sprint bulunamadı
                  </div>
                ) : (
                  activeSprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={String(sprint.id)}>
                      <div className="flex items-center gap-2">
                        <span>{sprint.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                          style={
                            sprint.state === SprintState.InProgress
                              ? { backgroundColor: 'hsl(153 60% 33% / 0.15)', color: 'hsl(153 60% 33%)' }
                              : {}
                          }
                        >
                          {sprint.stateText ?? (sprint.state === SprintState.Draft ? 'Taslak' : 'Devam Eden')}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedTasks.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Seçili Görevler:</p>
              <div className="space-y-0.5 max-h-[120px] overflow-y-auto">
                {selectedTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 py-1">
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                      {t.taskNumber}
                    </span>
                    <span className="text-xs text-foreground truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            İptal
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedSprintId || isAssigning}
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          >
            {isAssigning ? 'Atanıyor...' : 'Ata'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BacklogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const { data: projectsResponse } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true }),
  });

  const projects = projectsResponse?.data ?? [];

  const { data: backlogResponse, isLoading } = useQuery({
    queryKey: ['backlog', selectedProjectId ? Number(selectedProjectId) : null],
    queryFn: () => backlogApi.getByProject(Number(selectedProjectId)),
    enabled: !!selectedProjectId,
  });

  const assignTasksMutation = useMutation({
    mutationFn: async ({ sprintId, taskIds }: { sprintId: number; taskIds: number[] }) => {
      await Promise.all(taskIds.map((taskId) => sprintsApi.assignTask(sprintId, taskId)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog'] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      setSelectedTaskIds(new Set());
      setAssignDialogOpen(false);
    },
  });

  const tasks = backlogResponse?.data ?? [];

  const toggleTask = (taskId: number) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedTaskIds.size === tasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map((t) => t.id)));
    }
  };

  const selectedTasks = tasks.filter((t) => selectedTaskIds.has(t.id));

  const handleAssign = (sprintId: number) => {
    assignTasksMutation.mutate({
      sprintId,
      taskIds: Array.from(selectedTaskIds),
    });
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-foreground">Backlog</h1>
        <div className="flex items-center gap-2">
          {/* Project selector */}
          <Select value={selectedProjectId} onValueChange={(v) => { setSelectedProjectId(v); setSelectedTaskIds(new Set()); }}>
            <SelectTrigger className="h-8 w-[220px] text-xs">
              <SelectValue placeholder="Proje seçin..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTaskIds.size > 0 && (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
              onClick={() => setAssignDialogOpen(true)}
            >
              <Layers className="w-3.5 h-3.5" />
              Sprint'e Ata ({selectedTaskIds.size})
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!selectedProjectId ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Layers className="w-10 h-10 opacity-30" />
          <p className="text-sm">Backlog'u görmek için bir proje seçin</p>
        </div>
      ) : isLoading ? (
        <BacklogSkeleton />
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <AlertCircle className="w-10 h-10 opacity-30" />
          <p className="text-sm">Bu projede backlog görevi bulunamadı</p>
          <p className="text-xs">Sprint'e atanmamış görevler burada görünür</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[48px]">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.size === tasks.length && tasks.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border"
                    style={{ accentColor: 'hsl(153 60% 33%)' }}
                  />
                </TableHead>
                <TableHead className="w-[120px]">No</TableHead>
                <TableHead>Görev</TableHead>
                <TableHead>Proje</TableHead>
                <TableHead>Atanan</TableHead>
                <TableHead>Öncelik</TableHead>
                <TableHead>Aşama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className={[
                    'cursor-pointer hover:bg-muted/40 transition-colors',
                    selectedTaskIds.has(task.id) ? 'bg-primary/5' : '',
                  ].join(' ')}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.has(task.id)}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded border-border"
                      style={{ accentColor: 'hsl(153 60% 33%)' }}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {task.taskNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{task.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{task.projectName ?? '—'}</span>
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
                    <PriorityStars priority={task.priority} />
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
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer summary */}
          {selectedTaskIds.size > 0 && (
            <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{selectedTaskIds.size}</span> görev seçildi
              </span>
              <Button
                size="sm"
                className="h-7 gap-1.5 text-xs"
                style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
                onClick={() => setAssignDialogOpen(true)}
              >
                <Layers className="w-3.5 h-3.5" />
                Sprint'e Ata
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Assign to Sprint Dialog */}
      <AssignToSprintDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        projectId={selectedProjectId ? Number(selectedProjectId) : null}
        selectedTasks={selectedTasks}
        onAssign={handleAssign}
        isAssigning={assignTasksMutation.isPending}
      />
    </div>
  );
}
