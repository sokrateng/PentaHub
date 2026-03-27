import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  Save,
  MessageSquare,
  Send,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Separator } from '@/components/ui/separator';
import { tasksApi, taskStagesApi, usersApi } from '@/services/api';
import type { TaskStage } from '@/types';

const PRIORITY_LABELS: Record<number, string> = {
  0: 'Yok',
  1: 'Düşük',
  2: 'Orta',
  3: 'Yüksek',
  4: 'Kritik',
};

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

interface StarSelectorProps {
  value: number;
  onChange: (val: number) => void;
}

function StarSelector({ value, onChange }: StarSelectorProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((i) => {
        const active = hovered !== null ? i <= hovered : i <= value;
        return (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(i === value ? 0 : i)}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label={`Öncelik ${i}`}
          >
            <Star
              className="w-5 h-5 transition-colors"
              style={{
                color: active ? '#f59e0b' : '#d1d5db',
                fill: active ? '#f59e0b' : 'none',
              }}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">{PRIORITY_LABELS[value] ?? 'Yok'}</span>
    </div>
  );
}

const DETAIL_TABS = ['Açıklama', 'Zaman Çizelgeleri', 'Kontrol Listesi', 'Bağımlılıklar'];

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: taskResponse, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.getById(taskId),
    enabled: !!taskId,
  });

  const task = taskResponse?.data;

  const { data: stagesResponse } = useQuery({
    queryKey: ['task-stages', task?.projectId],
    queryFn: () => taskStagesApi.getByProject(task!.projectId),
    enabled: !!task?.projectId,
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const stages: TaskStage[] = stagesResponse?.data ?? [];
  const users = usersResponse?.data ?? [];

  const [formData, setFormData] = useState<{
    assigneeId?: string;
    priority?: number;
    isBillable?: boolean;
    startDate?: string;
    dueDate?: string;
    plannedHours?: string;
    description?: string;
  }>({});
  const [activeTab, setActiveTab] = useState('Açıklama');

  useEffect(() => {
    if (task) {
      setFormData({});
    }
  }, [task]);

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => tasksApi.update(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project-tasks', task?.projectId] });
    },
  });

  const stageMutation = useMutation({
    mutationFn: (stageId: number) => tasksApi.moveStage(taskId, stageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['project-tasks', task?.projectId] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Görev bulunamadı.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const currentPriority = formData.priority !== undefined ? formData.priority : task.priority;
  const currentAssigneeId =
    formData.assigneeId !== undefined ? formData.assigneeId : String(task.assigneeId ?? '');
  const currentIsBillable =
    formData.isBillable !== undefined ? formData.isBillable : task.isBillable;
  const currentStartDate =
    formData.startDate !== undefined ? formData.startDate : formatDateForInput(task.startDate);
  const currentDueDate =
    formData.dueDate !== undefined ? formData.dueDate : formatDateForInput(task.dueDate);
  const currentPlannedHours =
    formData.plannedHours !== undefined ? formData.plannedHours : String(task.plannedHours);
  const currentDescription =
    formData.description !== undefined ? formData.description : (task.description ?? '');

  const handleSave = () => {
    updateMutation.mutate({
      title: task.title,
      description: currentDescription || undefined,
      assigneeId: currentAssigneeId ? Number(currentAssigneeId) : undefined,
      priority: currentPriority,
      isBillable: currentIsBillable,
      startDate: currentStartDate || undefined,
      dueDate: currentDueDate || undefined,
      plannedHours: Number(currentPlannedHours) || 0,
    });
  };

  return (
    <div className="flex gap-0 h-full">
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-4 pr-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            to="/projects"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projeler
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          {task.projectId && (
            <>
              <Link
                to={`/projects/${task.projectId}/tasks`}
                className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[160px]"
              >
                {task.projectName ?? `Proje #${task.projectId}`}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </>
          )}
          <span className="font-mono text-xs text-muted-foreground">{task.taskNumber}</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground truncate max-w-[200px]">{task.title}</span>
        </div>

        {/* Stage bar */}
        {stages.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-1 flex items-stretch gap-0 overflow-hidden overflow-x-auto">
            {stages
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((stage, idx) => {
                const isActive = task.stageId === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => !isActive && stageMutation.mutate(stage.id)}
                    disabled={stageMutation.isPending}
                    className={[
                      'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative whitespace-nowrap',
                      isActive
                        ? 'text-white'
                        : 'text-muted-foreground hover:bg-muted/60',
                    ].join(' ')}
                    style={isActive ? { backgroundColor: 'hsl(153 60% 33%)' } : {}}
                  >
                    {idx > 0 && !isActive && (
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 absolute left-1" />
                    )}
                    {stage.name}
                  </button>
                );
              })}
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-xl border border-border px-5 py-4">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="font-mono text-xs mt-0.5 flex-shrink-0">
              {task.taskNumber}
            </Badge>
            <h1 className="text-lg font-bold text-foreground leading-snug">{task.title}</h1>
          </div>
        </div>

        {/* Form fields */}
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Project (read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Proje</label>
              <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground truncate">
                {task.projectName ?? `Proje #${task.projectId}`}
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Atanan Kişi</label>
              <Select
                value={currentAssigneeId}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, assigneeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kişi seçin..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Atanmamış</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Başlangıç Tarihi</label>
              <Input
                type="date"
                value={currentStartDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            {/* Due date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bitiş Tarihi</label>
              <Input
                type="date"
                value={currentDueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            {/* Planned hours */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Planlanan Saat</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={currentPlannedHours}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, plannedHours: e.target.value }))
                }
              />
            </div>

            {/* Spent hours (read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Harcanan Saat</label>
              <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground">
                {task.spentHours} saat
              </div>
            </div>
          </div>

          {/* Remaining hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Kalan Saat</label>
              <div className="h-9 flex items-center px-3 rounded-md border border-border bg-muted/40 text-sm text-muted-foreground">
                {task.remainingHours} saat
              </div>
            </div>

            {/* Progress */}
            {task.progressPercent > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">İlerleme</label>
                <div className="h-9 flex items-center gap-2 px-3 rounded-md border border-border bg-muted/40">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${task.progressPercent}%`,
                        backgroundColor: 'hsl(153 60% 33%)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    %{task.progressPercent}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Priority star selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Öncelik</label>
            <StarSelector
              value={currentPriority}
              onChange={(val) => setFormData((prev) => ({ ...prev, priority: val }))}
            />
          </div>

          {/* isBillable */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentIsBillable}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isBillable: e.target.checked }))
              }
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm font-medium">Faturalanabilir</span>
          </label>

          <Separator />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="gap-2"
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="flex h-auto bg-transparent border-b border-border rounded-none p-0 gap-0 w-full overflow-x-auto">
            {DETAIL_TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={[
                  'rounded-none border-b-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                  'data-[state=active]:border-b-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent',
                ].join(' ')}
                style={
                  activeTab === tab
                    ? { borderBottomColor: 'hsl(153 60% 33%)', color: 'hsl(153 60% 33%)' }
                    : { borderBottomColor: 'transparent' }
                }
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Açıklama tab */}
          <TabsContent value="Açıklama" className="mt-4">
            <div className="bg-white rounded-xl border border-border p-5">
              <textarea
                placeholder="Görev açıklaması..."
                value={currentDescription}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Kaydet
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Placeholder tabs */}
          {DETAIL_TABS.slice(1).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center">
                <Badge variant="outline" className="mb-3 text-xs">
                  Yakında
                </Badge>
                <h3 className="text-base font-semibold text-foreground mb-1">{tab}</h3>
                <p className="text-sm text-muted-foreground">Bu bölüm yakında eklenecek</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Collaboration panel */}
      <div
        className="w-[340px] flex-shrink-0 bg-white border-l border-border flex flex-col -mr-6 -mt-5 -mb-6"
        style={{ marginRight: '-1.5rem', marginTop: '-1.25rem', marginBottom: '-1.5rem' }}
      >
        <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Kolaborasyon</span>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            0 mesaj
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'hsl(153 60% 33% / 0.08)' }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: 'hsl(153 60% 33%)' }} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Henüz mesaj yok</p>
            <p className="text-xs text-muted-foreground">
              Görev hakkında mesaj göndermek için aşağıdaki alanı kullanın
            </p>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input placeholder="Mesaj yazın..." className="flex-1 text-sm h-9" />
            <button
              className="w-9 h-9 rounded-md flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'hsl(153 60% 33%)' }}
              aria-label="Gönder"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
