import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link2, Trash2, Plus } from 'lucide-react';
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
import { dependencyApi, tasksApi } from '@/services/api';

const DEPENDENCY_TYPE_LABELS: Record<number, string> = {
  0: 'Bitis → Baslangic',
  1: 'Baslangic → Baslangic',
  2: 'Bitis → Bitis',
  3: 'Baslangic → Bitis',
};

const DEPENDENCY_TYPE_COLORS: Record<number, string> = {
  0: 'bg-blue-50 text-blue-700 border-blue-200',
  1: 'bg-purple-50 text-purple-700 border-purple-200',
  2: 'bg-amber-50 text-amber-700 border-amber-200',
  3: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface DependenciesTabProps {
  taskId: number;
  projectId: number;
}

export function DependenciesTab({ taskId, projectId }: DependenciesTabProps) {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('0');

  const { data: depResponse, isLoading } = useQuery({
    queryKey: ['dependencies', taskId],
    queryFn: () => dependencyApi.getByTask(taskId),
    enabled: !!taskId,
  });

  const { data: allTasksResponse } = useQuery({
    queryKey: ['project-tasks-flat', projectId],
    queryFn: async () => {
      const result = await tasksApi.getByProject(projectId);
      const allTasks = (result.data ?? []).flatMap((col) => col.tasks);
      return allTasks;
    },
    enabled: !!projectId && dialogOpen,
  });

  const dependencies = depResponse?.data ?? [];
  const allTasks = allTasksResponse ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => dependencyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dependencies', taskId] });
    },
  });

  const addMutation = useMutation({
    mutationFn: ({ depTaskId, depType }: { depTaskId: number; depType: number }) =>
      dependencyApi.add(taskId, depTaskId, depType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dependencies', taskId] });
      setDialogOpen(false);
      setSelectedTaskId('');
      setSelectedType('0');
    },
  });

  const linkedTaskIds = new Set(dependencies.map((d) => d.dependsOnTaskId));
  const availableTasks = allTasks.filter(
    (t) => t.id !== taskId && !linkedTaskIds.has(t.id),
  );

  const handleAdd = () => {
    if (!selectedTaskId) return;
    addMutation.mutate({
      depTaskId: Number(selectedTaskId),
      depType: Number(selectedType),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-5 space-y-3 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3" />
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
          <span className="text-sm font-semibold text-foreground">Bağımlılıklar</span>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-3.5 h-3.5" />
          Bağımlılık Ekle
        </Button>
      </div>

      {/* Dependency list */}
      {dependencies.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Henüz bağımlılık yok.
        </div>
      ) : (
        <ul className="space-y-2">
          {dependencies.map((dep) => (
            <li
              key={dep.id}
              className="flex items-center gap-3 group px-3 py-2.5 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                    {dep.dependsOnTaskNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {dep.dependsOnTaskTitle}
                  </span>
                </div>
              </div>

              <Badge
                variant="outline"
                className={[
                  'text-xs px-1.5 py-0 h-5 flex-shrink-0 border',
                  DEPENDENCY_TYPE_COLORS[dep.dependencyType] ?? '',
                ].join(' ')}
              >
                {dep.dependencyTypeText ?? DEPENDENCY_TYPE_LABELS[dep.dependencyType] ?? `Tip ${dep.dependencyType}`}
              </Badge>

              <button
                type="button"
                onClick={() => deleteMutation.mutate(dep.id)}
                disabled={deleteMutation.isPending}
                className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Bağımlılığı sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Dependency Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bağımlılık Ekle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Görev</label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Görev seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTasks.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Eklenebilecek görev yok
                    </div>
                  ) : (
                    availableTasks.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {t.taskNumber}
                        </span>
                        {t.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bağımlılık Tipi</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEPENDENCY_TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedTaskId || addMutation.isPending}
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
            >
              {addMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
