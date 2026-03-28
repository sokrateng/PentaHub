import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { projectsApi, usersApi, resourcesApi, tasksApi } from '@/services/api';
import type { CreateResourceAllocationRequest } from '@/types';
import { PRIMARY_COLOR as PRIMARY } from '@/lib/constants';

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface AddResourceDialogProps {
  open: boolean;
  onClose: () => void;
  preselectedProjectId?: number;
}

function AddResourceDialog({ open, onClose, preselectedProjectId }: AddResourceDialogProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    userId: string;
    projectId: string;
    taskId: string;
    startDate: string;
    endDate: string;
    hoursPerDay: string;
    notes: string;
  }>({
    userId: '',
    projectId: preselectedProjectId ? String(preselectedProjectId) : '',
    taskId: '',
    startDate: '',
    endDate: '',
    hoursPerDay: '8',
    notes: '',
  });

  // Sync preselected project when dialog opens
  useEffect(() => {
    if (open && preselectedProjectId) {
      setForm((p) => ({ ...p, projectId: String(preselectedProjectId), taskId: '' }));
    }
  }, [open, preselectedProjectId]);

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    enabled: open,
  });

  const { data: projectsResponse } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true, pageSize: 200 }),
    enabled: open,
  });

  const { data: tasksResponse } = useQuery({
    queryKey: ['project-tasks-flat', form.projectId],
    queryFn: () => tasksApi.getByProject(Number(form.projectId)),
    enabled: !!form.projectId,
  });

  const users = usersResponse?.data ?? [];
  const projects = projectsResponse?.data ?? [];
  const taskColumns = tasksResponse?.data ?? [];
  const tasks = taskColumns.flatMap((col) => col.tasks);

  const totalHours =
    form.startDate && form.endDate && form.hoursPerDay
      ? (() => {
          const start = new Date(form.startDate);
          const end = new Date(form.endDate);
          const diffDays = Math.max(
            0,
            Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
          );
          return diffDays * Number(form.hoursPerDay);
        })()
      : 0;

  const createMutation = useMutation({
    mutationFn: (payload: CreateResourceAllocationRequest) => resourcesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      onClose();
      setForm({
        userId: '',
        projectId: preselectedProjectId ? String(preselectedProjectId) : '',
        taskId: '',
        startDate: '',
        endDate: '',
        hoursPerDay: '8',
        notes: '',
      });
    },
  });

  const handleSubmit = () => {
    if (!form.userId || !form.projectId || !form.startDate || !form.endDate) return;
    createMutation.mutate({
      userId: Number(form.userId),
      projectId: Number(form.projectId),
      taskId: form.taskId ? Number(form.taskId) : undefined,
      startDate: form.startDate,
      endDate: form.endDate,
      hoursPerDay: Number(form.hoursPerDay) || 8,
      notes: form.notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Kaynak Ekle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Kullanıcı *</label>
            <Select value={form.userId} onValueChange={(v) => setForm((p) => ({ ...p, userId: v ?? '' }))}>
              <SelectTrigger>
                <SelectValue placeholder="Kullanıcı seçin...">
                  {form.userId
                    ? users.find((u) => String(u.id) === form.userId)?.fullName ?? 'Kullanıcı seçin...'
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

          {/* Project */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Proje *</label>
            <Select
              value={form.projectId}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, projectId: v ?? '', taskId: '' }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Proje seçin...">
                  {form.projectId
                    ? projects.find((p) => String(p.id) === form.projectId)?.name ?? 'Proje seçin...'
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task (optional) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Görev (isteğe bağlı)</label>
            <Select
              value={form.taskId === '' ? 'none' : form.taskId}
              onValueChange={(v) => setForm((p) => ({ ...p, taskId: v === 'none' ? '' : (v ?? '') }))}
              disabled={!form.projectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Görev seçin...">
                  {form.taskId
                    ? tasks.find((t) => String(t.id) === form.taskId)?.title ?? 'Görev seçin...'
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Görev yok</SelectItem>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Başlangıç Tarihi *</label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bitiş Tarihi *</label>
              <Input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Hours per day */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Günlük Saat</label>
            <Input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={form.hoursPerDay}
              onChange={(e) => setForm((p) => ({ ...p, hoursPerDay: e.target.value }))}
            />
          </div>

          {/* Total hours summary */}
          {totalHours > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                Toplam <strong>{totalHours} saat</strong> tahsis edilecek
              </span>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notlar</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="İsteğe bağlı not..."
              className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={createMutation.isPending}>
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !form.userId ||
              !form.projectId ||
              !form.startDate ||
              !form.endDate ||
              createMutation.isPending
            }
            style={{ backgroundColor: PRIMARY, color: 'white' }}
          >
            {createMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ResourcesPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const urlProjectId = searchParams.get('projectId') ?? '';
  const [selectedProjectId, setSelectedProjectId] = useState<string>(urlProjectId);
  const [addOpen, setAddOpen] = useState(false);

  // Sync URL param when it changes
  useEffect(() => {
    if (urlProjectId) {
      setSelectedProjectId(urlProjectId);
    }
  }, [urlProjectId]);

  const { data: projectsResponse } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true, pageSize: 200 }),
  });

  const { data: resourcesResponse, isLoading } = useQuery({
    queryKey: ['resources', selectedProjectId],
    queryFn: () => resourcesApi.getByProject(Number(selectedProjectId)),
    enabled: !!selectedProjectId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => resourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const projects = projectsResponse?.data ?? [];
  const resources = resourcesResponse?.data ?? [];

  const totalResources = resources.length;
  const totalHours = resources.reduce((sum, r) => sum + r.totalHours, 0);
  const uniqueUsers = new Set(resources.map((r) => r.userId)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <Users className="w-5 h-5" style={{ color: PRIMARY }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kaynak Tahsisi</h1>
            <p className="text-sm text-muted-foreground">Proje kaynaklarını yönetin</p>
          </div>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          style={{ backgroundColor: PRIMARY, color: 'white' }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Kaynak Ekle
        </Button>
      </div>

      {/* Project selector */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground flex-shrink-0">Proje Seçin:</label>
          <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v ?? '')}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Proje seçin...">
                {selectedProjectId
                  ? projects.find((p) => String(p.id) === selectedProjectId)?.name ?? 'Proje seçin...'
                  : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProjectId && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${PRIMARY}15` }}
              >
                <Users className="w-5 h-5" style={{ color: PRIMARY }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{uniqueUsers}</p>
                <p className="text-xs text-muted-foreground">Toplam Kaynak</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'hsl(217 91% 60% / 0.1)' }}
              >
                <Clock className="w-5 h-5" style={{ color: 'hsl(217 91% 60%)' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalHours}</p>
                <p className="text-xs text-muted-foreground">Toplam Saat</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'hsl(142 72% 29% / 0.1)' }}
              >
                <Clock className="w-5 h-5" style={{ color: 'hsl(142 72% 29%)' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalResources}</p>
                <p className="text-xs text-muted-foreground">Atama Sayısı</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-8 space-y-3 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${PRIMARY}15` }}
                >
                  <AlertCircle className="w-5 h-5" style={{ color: PRIMARY }} />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Kaynak bulunamadı</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Bu projeye henüz kaynak atanmamış
                </p>
                <Button
                  size="sm"
                  onClick={() => setAddOpen(true)}
                  style={{ backgroundColor: PRIMARY, color: 'white' }}
                  className="gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  İlk Kaynağı Ekle
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Kaynak
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Başlangıç
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Bitiş
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Saat/Gün
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Toplam Saat
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Görev
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                      Notlar
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={[
                        'group border-b border-border last:border-0 hover:bg-muted/20 transition-colors',
                        idx % 2 === 0 ? '' : 'bg-muted/10',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                            style={{ backgroundColor: PRIMARY }}
                          >
                            {r.userFullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">{r.userFullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(r.startDate)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(r.endDate)}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className="text-xs font-mono">
                          {r.hoursPerDay}s
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-foreground">{r.totalHours}</span>
                        <span className="text-xs text-muted-foreground ml-1">saat</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.taskTitle ? (
                          <Badge variant="secondary" className="text-xs max-w-[140px] truncate block">
                            {r.taskTitle}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[160px]">
                        <span className="truncate block text-xs">{r.notes || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(r.id)}
                          disabled={deleteMutation.isPending}
                          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Kaynağı sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {!selectedProjectId && (
        <div className="bg-white rounded-xl border border-border p-16 flex flex-col items-center justify-center text-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <Users className="w-6 h-6" style={{ color: PRIMARY }} />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Proje Seçin</h3>
          <p className="text-sm text-muted-foreground">
            Kaynak tahsislerini görüntülemek için yukarıdan bir proje seçin
          </p>
        </div>
      )}

      {/* User management info */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm"
        style={{ borderColor: 'hsl(153 60% 33% / 0.3)', backgroundColor: 'hsl(153 60% 33% / 0.05)' }}
      >
        <Users className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(153 60% 33%)' }} />
        <span className="text-muted-foreground">
          Kullanıcıları yönetmek için{' '}
          <a href="/settings" className="font-medium underline" style={{ color: 'hsl(153 60% 33%)' }}>
            Ayarlar sayfasını
          </a>{' '}
          kullanın.
        </span>
      </div>

      <AddResourceDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        preselectedProjectId={selectedProjectId ? Number(selectedProjectId) : undefined}
      />
    </div>
  );
}
