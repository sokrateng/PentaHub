import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronRight,
  FileText,
  ListTodo,
  CalendarDays,
  Clock,
  Activity,
  AlertTriangle,
  Users,
  Save,
  MessageSquare,
  Send,
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
import { projectsApi, usersApi } from '@/services/api';
import { ProjectStatus, PrivacyLevel, EvaluationType } from '@/types';
import type { CreateProjectRequest } from '@/types';
import { MilestonesTab } from '@/components/projects/MilestonesTab';

interface MetricItem {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}

const metrics: MetricItem[] = [
  { label: 'Belgeler', value: 0, icon: FileText },
  { label: 'Görevler', value: 0, icon: ListTodo },
  { label: 'Toplantı', value: 0, icon: CalendarDays },
  { label: 'Zaman Çizelgesi', value: 0, icon: Clock },
  { label: 'Aktif', value: 0, icon: Activity },
  { label: 'Riskler', value: 0, icon: AlertTriangle },
  { label: 'Kaynak Tahsisi', value: 0, icon: Users },
];

const tabItems = [
  'Ayarlar',
  'Kilometre Taşları',
  'Açıklama',
  'E-postalar',
  'Görev Aşamaları',
  'Hand-over',
  'AI Analysis',
];

const statusStages = [
  { value: ProjectStatus.Beklemede, label: 'Beklemede' },
  { value: ProjectStatus.DevamEden, label: 'Devam Eden' },
  { value: ProjectStatus.Tamamlandi, label: 'Tamamlandı' },
];

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projectId = Number(id);

  const { data: projectResponse, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const project = projectResponse?.data;
  const users = usersResponse?.data ?? [];

  const [formData, setFormData] = useState<Partial<CreateProjectRequest>>({});
  const [activeTab, setActiveTab] = useState('Ayarlar');

  const updateMutation = useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectsApi.update(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: ProjectStatus) => projectsApi.updateStatus(projectId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-16 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">Proje bulunamadı.</p>
        <Link to="/projects">
          <Button variant="outline" size="sm">Projelere Dön</Button>
        </Link>
      </div>
    );
  }

  const currentField = <T extends keyof CreateProjectRequest>(field: T): CreateProjectRequest[T] => {
    if (field in formData && formData[field] !== undefined) {
      return formData[field] as CreateProjectRequest[T];
    }
    return (project as unknown as Record<string, unknown>)[field as string] as CreateProjectRequest[T];
  };

  const handleSave = () => {
    const payload: CreateProjectRequest = {
      name: (currentField('name') as string) || project.name,
      description: currentField('description') as string | undefined,
      status: (currentField('status') as ProjectStatus) ?? project.status,
      projectManagerId: (currentField('projectManagerId') as number) || project.projectManagerId,
      departmentName: currentField('departmentName') as string | undefined,
      privacyLevel: (currentField('privacyLevel') as PrivacyLevel) ?? project.privacyLevel,
      isBillable: (currentField('isBillable') as boolean) ?? project.isBillable,
      isTemplate: (currentField('isTemplate') as boolean) ?? project.isTemplate,
      startDate: currentField('startDate') as string | undefined,
      endDate: currentField('endDate') as string | undefined,
      projectEmail: currentField('projectEmail') as string | undefined,
      customerEvaluation:
        (currentField('customerEvaluation') as EvaluationType) ?? project.customerEvaluation,
      evaluationFrequency: currentField('evaluationFrequency') as string | undefined,
    };
    updateMutation.mutate(payload);
  };

  return (
    <div className="flex gap-0 h-full">
      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-5 pr-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projeler
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground truncate max-w-[300px]">{project.name}</span>
        </div>

        {/* Status bar */}
        <div className="bg-white rounded-xl border border-border p-1 flex items-stretch gap-0 overflow-hidden">
          {statusStages.map((stage, idx) => {
            const isActive = project.status === stage.value;
            const isPast = project.status > stage.value;
            return (
              <button
                key={stage.value}
                onClick={() => !isActive && statusMutation.mutate(stage.value)}
                disabled={statusMutation.isPending}
                className={[
                  'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative',
                  isActive
                    ? 'text-white'
                    : isPast
                      ? 'text-muted-foreground hover:bg-muted/60'
                      : 'text-muted-foreground hover:bg-muted/60',
                ].join(' ')}
                style={isActive ? { backgroundColor: 'hsl(153 60% 33%)' } : {}}
              >
                {idx > 0 && !isActive && (
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 absolute left-1" />
                )}
                {stage.label}
              </button>
            );
          })}
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-7 gap-2">
          {metrics.map(({ label, value, icon: Icon }) => {
            const isTasksMetric = label === 'Görevler';
            return (
              <div
                key={label}
                onClick={isTasksMetric ? () => navigate(`/projects/${projectId}/tasks`) : undefined}
                className={[
                  'bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1.5 text-center cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all',
                  isTasksMetric ? 'hover:border-primary hover:bg-primary/5' : '',
                ].join(' ')}
              >
                <Icon
                  className="w-4 h-4"
                  style={isTasksMetric ? { color: 'hsl(153 60% 33%)' } : { color: 'var(--muted-foreground)' }}
                />
                <span className="text-lg font-bold text-foreground leading-none">{value}</span>
                <span
                  className="text-[10px] leading-tight"
                  style={isTasksMetric ? { color: 'hsl(153 60% 33%)', fontWeight: 600 } : { color: 'var(--muted-foreground)' }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="flex h-auto bg-transparent border-b border-border rounded-none p-0 gap-0 w-full overflow-x-auto">
            {tabItems.map((tab) => (
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

          {/* Ayarlar tab */}
          <TabsContent value="Ayarlar" className="mt-5">
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {/* Project name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Proje Adı</label>
                  <Input
                    value={(formData.name ?? project.name) as string}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Manager */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Proje Yöneticisi</label>
                  <Select
                    value={String(formData.projectManagerId ?? project.projectManagerId)}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, projectManagerId: Number(v) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Departman</label>
                  <Input
                    value={(formData.departmentName ?? project.departmentName ?? '') as string}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, departmentName: e.target.value }))
                    }
                    placeholder="Departman adı..."
                  />
                </div>

                {/* Project email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Proje E-postası</label>
                  <Input
                    type="email"
                    value={(formData.projectEmail ?? project.projectEmail ?? '') as string}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, projectEmail: e.target.value }))
                    }
                    placeholder="proje@example.com"
                  />
                </div>

                {/* Start date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Başlangıç Tarihi</label>
                  <Input
                    type="date"
                    value={
                      (formData.startDate ?? formatDateForInput(project.startDate)) as string
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>

                {/* End date */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Bitiş Tarihi</label>
                  <Input
                    type="date"
                    value={(formData.endDate ?? formatDateForInput(project.endDate)) as string}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                {/* Privacy */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Gizlilik</label>
                  <Select
                    value={String(formData.privacyLevel ?? project.privacyLevel)}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, privacyLevel: Number(v) as PrivacyLevel }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(PrivacyLevel.InviteOnly)}>Sadece Davetliler</SelectItem>
                      <SelectItem value={String(PrivacyLevel.AllEmployees)}>Tüm Çalışanlar</SelectItem>
                      <SelectItem value={String(PrivacyLevel.ClientVisible)}>Müşteri Görünür</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer evaluation */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Müşteri Değerlendirmesi</label>
                  <Select
                    value={String(formData.customerEvaluation ?? project.customerEvaluation)}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        customerEvaluation: Number(v) as EvaluationType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(EvaluationType.None)}>Yok</SelectItem>
                      <SelectItem value={String(EvaluationType.Periodic)}>Periyodik</SelectItem>
                      <SelectItem value={String(EvaluationType.OnStageChange)}>Aşama Değişiminde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Açıklama</label>
                <textarea
                  value={(formData.description ?? project.description ?? '') as string}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Proje açıklaması..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.isBillable ?? project.isBillable) as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isBillable: e.target.checked }))
                    }
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-medium">Faturalanabilir</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.isTemplate ?? project.isTemplate) as boolean}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isTemplate: e.target.checked }))
                    }
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm font-medium">Şablon</span>
                </label>
              </div>

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
          </TabsContent>

          {/* Kilometre Taşları tab */}
          <TabsContent value="Kilometre Taşları" className="mt-5">
            <MilestonesTab projectId={projectId} />
          </TabsContent>

          {/* Placeholder tabs */}
          {tabItems.slice(1).filter((tab) => tab !== 'Kilometre Taşları').map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-5">
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
        {/* Panel header */}
        <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Kolaborasyon</span>
          </div>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            0 mesaj
          </Badge>
        </div>

        {/* Messages area */}
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
              Proje hakkında mesaj göndermek için aşağıdaki alanı kullanın
            </p>
          </div>
        </div>

        {/* Message input */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Mesaj yazın..."
              className="flex-1 text-sm h-9"
            />
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
