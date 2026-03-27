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
  Mail,
  FileWarning,
  Sparkles,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { projectsApi, usersApi, tasksApi, resourcesApi, taskStagesApi } from '@/services/api';
import { ProjectStatus, PrivacyLevel, EvaluationType } from '@/types';
import type { CreateProjectRequest } from '@/types';
import { MilestonesTab } from '@/components/projects/MilestonesTab';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';

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

  const { data: tasksResponse } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: () => tasksApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const { data: resourcesResponse } = useQuery({
    queryKey: ['project-resources', projectId],
    queryFn: () => resourcesApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const { data: stagesResponse } = useQuery({
    queryKey: ['project-task-stages', projectId],
    queryFn: () => taskStagesApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const project = projectResponse?.data;
  const users = usersResponse?.data ?? [];

  const taskColumns = tasksResponse?.data ?? [];
  const totalTaskCount = taskColumns.reduce((sum, col) => sum + col.tasks.length, 0);

  const resources = resourcesResponse?.data ?? [];
  const uniqueResourceCount = new Set(resources.map((r) => r.userId)).size;

  const taskStages = stagesResponse?.data ?? [];

  const [formData, setFormData] = useState<Partial<CreateProjectRequest>>({});
  const [activeTab, setActiveTab] = useState('Ayarlar');
  const [descriptionValue, setDescriptionValue] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState<string | null>(null);

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
        {(() => {
          const liveMetrics = [
            { label: 'Belgeler', value: 0, icon: FileText, placeholder: true },
            { label: 'Görevler', value: totalTaskCount, icon: ListTodo, placeholder: false },
            { label: 'Toplantı', value: 0, icon: CalendarDays, placeholder: true },
            { label: 'Zaman Çizelgesi', value: 0, icon: Clock, placeholder: true },
            { label: 'Aktif', value: 0, icon: Activity, placeholder: true },
            { label: 'Riskler', value: 0, icon: AlertTriangle, placeholder: true },
            { label: 'Kaynak Tahsisi', value: uniqueResourceCount, icon: Users, placeholder: false },
          ];
          return (
            <div className="grid grid-cols-7 gap-2">
              {liveMetrics.map(({ label, value, icon: Icon, placeholder }) => {
                const isTasksMetric = label === 'Görevler';
                const isClickable = isTasksMetric;
                return (
                  <div
                    key={label}
                    onClick={isClickable ? () => navigate(`/projects/${projectId}/tasks`) : undefined}
                    className={[
                      'bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1.5 text-center transition-all',
                      isClickable ? 'cursor-pointer hover:border-primary hover:bg-primary/5 hover:shadow-sm' : '',
                      placeholder ? 'opacity-50' : '',
                    ].join(' ')}
                    title={placeholder ? 'Yakında aktif olacak' : undefined}
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
          );
        })()}

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

          {/* Açıklama tab */}
          <TabsContent value="Açıklama" className="mt-5">
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Proje Açıklaması</h3>
              {(descriptionValue === null && !project.description) ? (
                <div className="text-sm text-muted-foreground italic bg-muted/40 rounded-lg p-4">
                  Henüz açıklama eklenmemiş. Aşağıya açıklama ekleyebilirsiniz.
                </div>
              ) : null}
              <textarea
                value={descriptionValue !== null ? descriptionValue : (project.description ?? '')}
                onChange={(e) => setDescriptionValue(e.target.value)}
                placeholder="Proje açıklaması buraya yazın..."
                className="w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    const desc = descriptionValue !== null ? descriptionValue : (project.description ?? '');
                    const payload: CreateProjectRequest = {
                      name: project.name,
                      description: desc || undefined,
                      status: project.status,
                      projectManagerId: project.projectManagerId,
                      departmentName: project.departmentName,
                      privacyLevel: project.privacyLevel,
                      isBillable: project.isBillable,
                      isTemplate: project.isTemplate,
                      startDate: project.startDate,
                      endDate: project.endDate,
                      projectEmail: project.projectEmail,
                      customerEvaluation: project.customerEvaluation,
                      evaluationFrequency: project.evaluationFrequency,
                    };
                    updateMutation.mutate(payload);
                  }}
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

          {/* E-postalar tab */}
          <TabsContent value="E-postalar" className="mt-5">
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
                <h3 className="text-sm font-semibold text-foreground">Proje E-posta Adresi</h3>
              </div>
              {project.projectEmail ? (
                <div className="bg-muted/40 rounded-lg px-4 py-3 text-sm text-foreground">
                  Proje e-posta adresi:{' '}
                  <span className="font-mono font-semibold">{project.projectEmail}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic bg-muted/40 rounded-lg p-4">
                  E-posta adresi tanımlanmamış.
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  {project.projectEmail ? 'E-posta Adresini Değiştir' : 'E-posta Adresi Ekle'}
                </label>
                <Input
                  type="email"
                  placeholder="proje@example.com"
                  value={emailValue !== null ? emailValue : (project.projectEmail ?? '')}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    const email = emailValue !== null ? emailValue : (project.projectEmail ?? '');
                    const payload: CreateProjectRequest = {
                      name: project.name,
                      description: project.description,
                      status: project.status,
                      projectManagerId: project.projectManagerId,
                      departmentName: project.departmentName,
                      privacyLevel: project.privacyLevel,
                      isBillable: project.isBillable,
                      isTemplate: project.isTemplate,
                      startDate: project.startDate,
                      endDate: project.endDate,
                      projectEmail: email || undefined,
                      customerEvaluation: project.customerEvaluation,
                      evaluationFrequency: project.evaluationFrequency,
                    };
                    updateMutation.mutate(payload);
                    setEmailValue(null);
                  }}
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

          {/* Görev Aşamaları tab */}
          <TabsContent value="Görev Aşamaları" className="mt-5">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aşama Adı</TableHead>
                    <TableHead className="text-center">Sıra</TableHead>
                    <TableHead className="text-center">Varsayılan</TableHead>
                    <TableHead className="text-center">Kapalı Aşama</TableHead>
                    <TableHead className="text-center">Kanban'da Göster</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskStages.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-10 text-sm"
                      >
                        Bu proje için görev aşaması tanımlanmamış.
                      </TableCell>
                    </TableRow>
                  ) : (
                    taskStages.map((stage) => (
                      <TableRow key={stage.id}>
                        <TableCell className="font-medium text-sm">{stage.name}</TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {stage.sortOrder}
                        </TableCell>
                        <TableCell className="text-center">
                          {stage.isDefault ? (
                            <Badge
                              className="text-[10px]"
                              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
                            >
                              Varsayılan
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {stage.isClosedStage ? (
                            <Badge variant="secondary" className="text-[10px]">
                              Kapalı
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {stage.showInKanban ? (
                            <Badge variant="outline" className="text-[10px]">
                              Evet
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">Hayır</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Hand-over tab */}
          <TabsContent value="Hand-over" className="mt-5">
            <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'hsl(220 20% 96%)' }}
              >
                <FileWarning className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-foreground">Hand-over Raporu Yok</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Hand-over raporu bu projede henüz oluşturulmamış. Bu özellik, proje teslim
                  sürecinde otomatik rapor oluşturmak için kullanılacaktır.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis tab */}
          <TabsContent value="AI Analysis" className="mt-5">
            <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'hsl(153 60% 96%)' }}
              >
                <Sparkles className="w-6 h-6" style={{ color: 'hsl(153 60% 33%)' }} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-foreground">AI Analizi Mevcut Değil</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  AI destekli risk analizi bu projede henüz çalıştırılmamış. Bu özellik, proje
                  risklerini yapay zeka ile analiz etmek için kullanılacaktır.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Collaboration panel */}
      <CollaborationPanel entityType="Project" entityId={projectId} />
    </div>
  );
}
