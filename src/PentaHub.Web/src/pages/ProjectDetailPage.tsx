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
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Minus,
  ClipboardList,
  Info,
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
import { projectsApi, usersApi, taskStagesApi } from '@/services/api';
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

const privacyLabels: Record<number, string> = {
  [PrivacyLevel.InviteOnly]: 'Sadece Davetliler',
  [PrivacyLevel.AllEmployees]: 'Tüm Çalışanlar',
  [PrivacyLevel.ClientVisible]: 'Müşteriye Görünür',
};

const evaluationLabels: Record<number, string> = {
  [EvaluationType.None]: 'Yok',
  [EvaluationType.Periodic]: 'Periyodik',
  [EvaluationType.OnStageChange]: 'Aşama Değişiminde',
};

const handoverChecklistItems = [
  'Tüm görevler tamamlandı veya devredildi',
  'Dokümantasyon güncellendi',
  'Test sonuçları onaylandı',
  'Müşteri kabul testi yapıldı',
  'Bilgi transferi toplantısı gerçekleştirildi',
  'Erişim yetkileri devredildi',
  'Açık riskler dokümante edildi',
  'Bakım planı oluşturuldu',
];

function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

interface RiskCategory {
  label: string;
  severity: 'Düşük' | 'Orta' | 'Yüksek';
  description: string;
  recommendation: string;
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

  const { data: metricsResponse } = useQuery({
    queryKey: ['project-metrics', projectId],
    queryFn: () => projectsApi.getMetrics(projectId),
    enabled: !!projectId,
  });

  const { data: stagesResponse } = useQuery({
    queryKey: ['project-task-stages', projectId],
    queryFn: () => taskStagesApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const project = projectResponse?.data;
  const users = usersResponse?.data ?? [];
  const metrics = metricsResponse?.data;
  const taskStages = stagesResponse?.data ?? [];

  const [formData, setFormData] = useState<Partial<CreateProjectRequest>>({});
  const [activeTab, setActiveTab] = useState('Ayarlar');
  const [descriptionValue, setDescriptionValue] = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState<string | null>(null);
  const [handoverChecked, setHandoverChecked] = useState<boolean[]>(
    new Array(handoverChecklistItems.length).fill(false)
  );
  const [handoverNotes, setHandoverNotes] = useState('');

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

  // --- AI Analysis helpers ---
  const taskCount = metrics?.taskCount ?? 0;
  const overdueCount = metrics?.overdueTaskCount ?? 0;
  const completedCount = metrics?.completedTaskCount ?? 0;
  const activeCount = metrics?.activeTaskCount ?? 0;
  const resourceCount = metrics?.resourceCount ?? 0;

  const completionRate = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
  const overdueRate = taskCount > 0 ? Math.round((overdueCount / taskCount) * 100) : 0;

  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const now = new Date();

  let timeUsedPercent = 0;
  if (startDate && endDate) {
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    timeUsedPercent = total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 0;
  }

  const timeRisk: RiskCategory = {
    label: 'Zaman Riski',
    severity:
      timeUsedPercent > completionRate + 30
        ? 'Yüksek'
        : timeUsedPercent > completionRate + 15
        ? 'Orta'
        : 'Düşük',
    description:
      endDate
        ? `Zamanın %${timeUsedPercent}'i kullanıldı, ilerleme %${completionRate}.`
        : 'Bitiş tarihi tanımlanmamış.',
    recommendation:
      timeUsedPercent > completionRate + 30
        ? 'Proje ciddi ölçüde geride. Görevlerin önceliklendirilmesi gerekiyor.'
        : timeUsedPercent > completionRate + 15
        ? 'Proje biraz geride. Kaynaklar gözden geçirilmeli.'
        : 'Proje zamanında ilerliyor.',
  };

  const resourceRisk: RiskCategory = {
    label: 'Kaynak Riski',
    severity: resourceCount === 0 ? 'Yüksek' : resourceCount < 2 ? 'Orta' : 'Düşük',
    description:
      resourceCount === 0
        ? 'Projeye hiç kaynak atanmamış.'
        : `${resourceCount} kaynak atanmış.`,
    recommendation:
      resourceCount === 0
        ? 'Projeye en az bir kaynak atanmalı.'
        : resourceCount < 2
        ? 'Kaynak sayısı artırılabilir.'
        : 'Kaynak durumu iyi.',
  };

  const scopeRisk: RiskCategory = {
    label: 'Kapsam Riski',
    severity: activeCount > 20 ? 'Yüksek' : activeCount > 10 ? 'Orta' : 'Düşük',
    description:
      activeCount === 0
        ? 'Aktif görev bulunmuyor.'
        : `${activeCount} aktif görev mevcut.`,
    recommendation:
      activeCount > 20
        ? 'Çok fazla açık görev var. Kapsam daraltılmalı veya ekip genişletilmeli.'
        : activeCount > 10
        ? 'Açık görev sayısı fazla. Önceliklendirme yapılmalı.'
        : 'Görev yükü yönetilebilir düzeyde.',
  };

  const qualityRisk: RiskCategory = {
    label: 'Kalite Riski',
    severity: overdueRate > 30 ? 'Yüksek' : overdueRate > 10 ? 'Orta' : 'Düşük',
    description:
      overdueCount === 0
        ? 'Gecikmiş görev yok.'
        : `${overdueCount} görev gecikmiş (${overdueRate}%).`,
    recommendation:
      overdueRate > 30
        ? 'Yüksek gecikme oranı kaliteyi olumsuz etkileyebilir. Acil önlem gerekiyor.'
        : overdueRate > 10
        ? 'Gecikmiş görevler takip edilmeli.'
        : 'Gecikme oranı kabul edilebilir.',
  };

  const riskCategories = [timeRisk, resourceRisk, scopeRisk, qualityRisk];

  const highRiskCount = riskCategories.filter((r) => r.severity === 'Yüksek').length;
  const mediumRiskCount = riskCategories.filter((r) => r.severity === 'Orta').length;
  const riskScore = Math.min(10, highRiskCount * 3 + mediumRiskCount * 1.5 + (overdueRate / 20));
  const riskScoreDisplay = Math.round(riskScore * 10) / 10;

  const aiRecommendations: string[] = [];
  if (overdueCount > 0) {
    aiRecommendations.push(`${overdueCount} görev gecikmiş durumda. Önceliklendirme yapılmalı.`);
  }
  if (resourceCount === 0) {
    aiRecommendations.push('Projeye kaynak atanmamış. En az bir kaynak belirlenmeli.');
  }
  if (timeUsedPercent > 75 && completionRate < 50) {
    aiRecommendations.push(
      `Proje zamanın %${timeUsedPercent}'ini kullanmış ama ilerleme %${completionRate}'nin altında.`
    );
  }
  if (activeCount > 15) {
    aiRecommendations.push('Çok sayıda açık görev var. Kapsam yönetimi gözden geçirilmeli.');
  }
  if (aiRecommendations.length === 0) {
    aiRecommendations.push('Proje genel olarak iyi durumda. Mevcut tempoya devam edilebilir.');
  }

  // --- Handover helpers ---
  const checkedCount = handoverChecked.filter(Boolean).length;
  const handoverProgress = Math.round((checkedCount / handoverChecklistItems.length) * 100);

  const toggleHandover = (index: number) => {
    setHandoverChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // --- Display label helpers ---
  const managerName = (() => {
    const mid = formData.projectManagerId ?? project.projectManagerId;
    return users.find((u) => u.id === mid)?.fullName ?? project.projectManagerName ?? '—';
  })();

  const privacyLabel = privacyLabels[formData.privacyLevel ?? project.privacyLevel] ?? '—';
  const evaluationLabel = evaluationLabels[formData.customerEvaluation ?? project.customerEvaluation] ?? '—';

  const severityColor = (severity: 'Düşük' | 'Orta' | 'Yüksek') => {
    if (severity === 'Yüksek') return { bg: 'hsl(0 86% 97%)', border: 'hsl(0 72% 70%)', text: 'hsl(0 72% 51%)' };
    if (severity === 'Orta') return { bg: 'hsl(38 92% 97%)', border: 'hsl(38 92% 60%)', text: 'hsl(38 92% 35%)' };
    return { bg: 'hsl(153 60% 97%)', border: 'hsl(153 60% 60%)', text: 'hsl(153 60% 33%)' };
  };

  const severityIcon = (severity: 'Düşük' | 'Orta' | 'Yüksek') => {
    if (severity === 'Yüksek') return <TrendingUp className="w-4 h-4" />;
    if (severity === 'Orta') return <Minus className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
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
          {/* Belgeler */}
          <div className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center">
            <FileText className="w-4 h-4" style={{ color: 'hsl(213 94% 48%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.documentCount ?? 0}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(213 94% 48%)' }}>Belgeler</span>
            <span className="text-[9px] text-muted-foreground leading-tight">Not ve e-posta</span>
          </div>

          {/* Görevler */}
          <div
            className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center cursor-pointer hover:border-[hsl(153_60%_33%)] hover:bg-[hsl(153_60%_33%)]/5 hover:shadow-sm transition-all"
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            title="Görevlere git"
          >
            <ListTodo className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.taskCount ?? 0}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(153 60% 33%)' }}>Görevler</span>
            <span className="text-[9px] text-muted-foreground leading-tight">{metrics?.activeTaskCount ?? 0} aktif</span>
          </div>

          {/* Toplantı */}
          <div className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center">
            <CalendarDays className="w-4 h-4" style={{ color: 'hsl(270 60% 55%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.meetingCount ?? 0}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(270 60% 55%)' }}>Toplantı</span>
            <span className="text-[9px] text-muted-foreground leading-tight">Planlanan toplantı</span>
          </div>

          {/* Zaman Çizelgesi */}
          <div
            className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center cursor-pointer hover:border-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_50%)]/5 hover:shadow-sm transition-all"
            onClick={() => navigate(`/timesheets`)}
            title="Zaman çizelgesine git"
          >
            <Clock className="w-4 h-4" style={{ color: 'hsl(38 92% 50%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.totalHours ?? 0}s</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(38 92% 50%)' }}>Zaman Çizelgesi</span>
            <span className="text-[9px] text-muted-foreground leading-tight">{metrics?.billableHours ?? 0}s faturalabilir</span>
          </div>

          {/* Aktif */}
          <div
            className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center cursor-pointer hover:border-[hsl(152_76%_40%)] hover:bg-[hsl(152_76%_40%)]/5 hover:shadow-sm transition-all"
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            title="Aktif görevlere git"
          >
            <Activity className="w-4 h-4" style={{ color: 'hsl(152 76% 40%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.activeTaskCount ?? 0}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(152 76% 40%)' }}>Aktif</span>
            <span className="text-[9px] text-muted-foreground leading-tight">{metrics?.completedTaskCount ?? 0} tamamlandı</span>
          </div>

          {/* Riskler */}
          {(() => {
            const riskCount = metrics?.riskCount ?? 0;
            const hasRisk = riskCount > 0;
            return (
              <div
                className="rounded-lg border p-3 flex flex-col items-center gap-1 text-center transition-all relative group"
                style={{
                  backgroundColor: hasRisk ? 'hsl(0 86% 97%)' : 'white',
                  borderColor: hasRisk ? 'hsl(0 72% 70%)' : 'hsl(var(--border))',
                }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: hasRisk ? 'hsl(0 72% 51%)' : 'var(--muted-foreground)' }} />
                <span className="text-lg font-bold text-foreground leading-none">{riskCount}</span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ color: hasRisk ? 'hsl(0 72% 51%)' : 'var(--muted-foreground)' }}
                >
                  Riskler
                </span>
                <span className="text-[9px] text-muted-foreground leading-tight">{metrics?.overdueTaskCount ?? 0} gecikmiş</span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-foreground text-background text-[10px] rounded-md px-2 py-1.5 text-center opacity-0 group-hover:opacity-100 pointer-events-none z-10 leading-snug shadow-lg">
                  <Info className="w-3 h-3 inline-block mr-1 mb-0.5" />
                  Gecikmiş ve kritik öncelikli görevler otomatik olarak risk olarak sayılır.
                </div>
              </div>
            );
          })()}

          {/* Kaynak Tahsisi */}
          <div
            className="bg-white rounded-lg border border-border p-3 flex flex-col items-center gap-1 text-center cursor-pointer hover:border-[hsl(174_72%_40%)] hover:bg-[hsl(174_72%_40%)]/5 hover:shadow-sm transition-all"
            onClick={() => navigate(`/resources`)}
            title="Kaynaklara git"
          >
            <Users className="w-4 h-4" style={{ color: 'hsl(174 72% 40%)' }} />
            <span className="text-lg font-bold text-foreground leading-none">{metrics?.resourceCount ?? 0}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'hsl(174 72% 40%)' }}>Kaynak Tahsisi</span>
            <span className="text-[9px] text-muted-foreground leading-tight">Atanan kaynak</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="flex flex-wrap h-auto bg-transparent border-b border-border rounded-none p-0 gap-0 w-full">
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
                    <SelectTrigger className="w-full">
                      <span className="flex flex-1 text-left text-sm truncate">{managerName}</span>
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
                    <SelectTrigger className="w-full">
                      <span className="flex flex-1 text-left text-sm truncate">{privacyLabel}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(PrivacyLevel.InviteOnly)}>Sadece Davetliler</SelectItem>
                      <SelectItem value={String(PrivacyLevel.AllEmployees)}>Tüm Çalışanlar</SelectItem>
                      <SelectItem value={String(PrivacyLevel.ClientVisible)}>Müşteriye Görünür</SelectItem>
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
                    <SelectTrigger className="w-full">
                      <span className="flex flex-1 text-left text-sm truncate">{evaluationLabel}</span>
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
            <div className="space-y-4">
              {/* Proje Özeti */}
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
                  <h3 className="text-sm font-semibold text-foreground">Proje Özeti</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Proje Adı</span>
                    <p className="font-medium">{project.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Yönetici</span>
                    <p className="font-medium">{project.projectManagerName ?? '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Başlangıç</span>
                    <p className="font-medium">{formatDate(project.startDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Bitiş</span>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Durum</span>
                    <p className="font-medium">{project.statusText}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Toplam Görev</span>
                    <p className="font-medium">{taskCount} görev ({completedCount} tamamlandı)</p>
                  </div>
                </div>
                {project.description && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Açıklama</span>
                    <p className="text-sm text-foreground/80 leading-relaxed">{project.description}</p>
                  </div>
                )}
              </div>

              {/* Teslim Durumu */}
              <div className="bg-white rounded-xl border border-border p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Teslim Durumu</h3>
                  <span className="text-sm font-bold" style={{ color: 'hsl(153 60% 33%)' }}>
                    %{handoverProgress}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${handoverProgress}%`,
                      backgroundColor: 'hsl(153 60% 33%)',
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {checkedCount} / {handoverChecklistItems.length} madde tamamlandı
                </p>
              </div>

              {/* Teslim Kontrol Listesi */}
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Teslim Kontrol Listesi</h3>
                <div className="space-y-2">
                  {handoverChecklistItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => toggleHandover(index)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 text-left transition-colors"
                      style={handoverChecked[index] ? { backgroundColor: 'hsl(153 60% 97%)', borderColor: 'hsl(153 60% 60%)' } : {}}
                    >
                      {handoverChecked[index] ? (
                        <CheckSquare className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(153 60% 33%)' }} />
                      ) : (
                        <Square className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className="text-sm"
                        style={handoverChecked[index] ? { color: 'hsl(153 60% 33%)', textDecoration: 'line-through' } : {}}
                      >
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Teslim Notları */}
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Teslim Notları</h3>
                <textarea
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Teslim sürecine ilişkin notlar, özel durumlar, hatırlatmalar..."
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => alert('Rapor oluşturuldu')}
                    className="gap-2"
                    style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
                  >
                    <FileWarning className="w-4 h-4" />
                    Teslim Raporu Oluştur
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis tab */}
          <TabsContent value="AI Analysis" className="mt-5">
            <div className="space-y-4">
              {/* Risk Skoru */}
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
                      <h3 className="text-sm font-semibold text-foreground">Genel Risk Skoru</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Görev gecikmeleri, kaynak durumu ve ilerleme oranına göre hesaplanır.
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                      style={{
                        borderColor:
                          riskScoreDisplay >= 7
                            ? 'hsl(0 72% 51%)'
                            : riskScoreDisplay >= 4
                            ? 'hsl(38 92% 50%)'
                            : 'hsl(153 60% 33%)',
                        color:
                          riskScoreDisplay >= 7
                            ? 'hsl(0 72% 51%)'
                            : riskScoreDisplay >= 4
                            ? 'hsl(38 92% 50%)'
                            : 'hsl(153 60% 33%)',
                      }}
                    >
                      {riskScoreDisplay}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">/ 10</span>
                  </div>
                </div>
              </div>

              {/* Risk Kategorileri */}
              <div className="grid grid-cols-2 gap-3">
                {riskCategories.map((category) => {
                  const colors = severityColor(category.severity);
                  return (
                    <div
                      key={category.label}
                      className="rounded-xl border p-4 space-y-2"
                      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{category.label}</span>
                        <span
                          className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ color: colors.text, backgroundColor: 'white' }}
                        >
                          {severityIcon(category.severity)}
                          {category.severity}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70 leading-snug">{category.description}</p>
                      <p className="text-xs font-medium leading-snug" style={{ color: colors.text }}>
                        {category.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Öneriler */}
              <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
                  <h3 className="text-sm font-semibold text-foreground">AI Önerileri</h3>
                </div>
                <div className="space-y-2">
                  {aiRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold mt-0.5"
                        style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                      >
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>

                {/* Metrics summary */}
                <Separator />
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-0.5">
                    <p className="text-lg font-bold text-foreground">{completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Tamamlanma Oranı</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg font-bold text-foreground">{overdueCount}</p>
                    <p className="text-xs text-muted-foreground">Gecikmiş Görev</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg font-bold text-foreground">{timeUsedPercent}%</p>
                    <p className="text-xs text-muted-foreground">Süre Kullanımı</p>
                  </div>
                </div>
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
