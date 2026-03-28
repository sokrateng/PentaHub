import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  FileText,
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
import { projectsApi, sprintsApi } from '@/services/api';
import { SprintState } from '@/types';
import type { Sprint, CreateSprintRequest } from '@/types';
import { formatDate } from '@/lib/utils';
import { PRIMARY_COLOR } from '@/lib/constants';

type FilterTab = 'all' | 'draft' | 'inprogress' | 'done';

function sprintStateBadge(state: SprintState) {
  switch (state) {
    case SprintState.Draft:
      return (
        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
          Taslak
        </Badge>
      );
    case SprintState.InProgress:
      return (
        <Badge
          className="text-xs"
          style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
        >
          Devam Eden
        </Badge>
      );
    case SprintState.Done:
      return (
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
          Tamamlandı
        </Badge>
      );
  }
}

interface SprintCardProps {
  sprint: Sprint;
  onClick: () => void;
}

function SprintCard({ sprint, onClick }: SprintCardProps) {
  const progressPercent = sprint.progressPercent ?? 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:shadow-md hover:border-border/80 transition-all duration-150 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 flex-1">
          {sprint.name}
        </h3>
        {sprintStateBadge(sprint.state)}
      </div>

      {/* Project name */}
      {sprint.projectName && (
        <div className="text-xs text-muted-foreground truncate font-medium">
          {sprint.projectName}
        </div>
      )}

      {/* Goal */}
      {sprint.goal && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Target className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{sprint.goal}</span>
        </div>
      )}

      {/* Date range */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3 flex-shrink-0" />
        <span>
          {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {sprint.completedTaskCount}/{sprint.taskCount} görev tamamlandı
          </span>
          <span className="font-medium text-foreground">%{progressPercent}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: PRIMARY_COLOR,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SprintsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-44 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

interface NewSprintForm {
  name: string;
  projectId: string;
  goal: string;
  startDate: string;
  endDate: string;
}

function getDefaultDates(): { defaultStart: string; defaultEnd: string } {
  const today = new Date();
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);
  const defaultStart = today.toISOString().split('T')[0];
  const defaultEnd = twoWeeksLater.toISOString().split('T')[0];
  return { defaultStart, defaultEnd };
}

function makeDefaultForm(): NewSprintForm {
  const { defaultStart, defaultEnd } = getDefaultDates();
  return {
    name: '',
    projectId: '',
    goal: '',
    startDate: defaultStart,
    endDate: defaultEnd,
  };
}


const FILTER_TABS: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'Tümü', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'draft', label: 'Taslak', icon: <Clock className="w-3.5 h-3.5" /> },
  { key: 'inprogress', label: 'Devam Eden', icon: <Target className="w-3.5 h-3.5" /> },
  { key: 'done', label: 'Tamamlandı', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
];

function filterTabToState(tab: FilterTab): SprintState | undefined {
  if (tab === 'draft') return SprintState.Draft;
  if (tab === 'inprogress') return SprintState.InProgress;
  if (tab === 'done') return SprintState.Done;
  return undefined;
}

export function SprintsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewSprintForm>(makeDefaultForm);

  const { data: projectsResponse } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true }),
  });

  const stateFilter = filterTabToState(filterTab);
  const projectIdFilter =
    selectedProjectId !== 'all' ? Number(selectedProjectId) : undefined;

  const { data: sprintsResponse, isLoading } = useQuery({
    queryKey: ['sprints', projectIdFilter, stateFilter],
    queryFn: () =>
      sprintsApi.getAll({
        projectId: projectIdFilter,
        state: stateFilter,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateSprintRequest) => sprintsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      setDialogOpen(false);
      setForm(makeDefaultForm());
    },
  });

  const projects = projectsResponse?.data ?? [];
  const allSprints = sprintsResponse?.data ?? [];
  const normalize = (s: string) => s.toLocaleLowerCase('tr-TR');
  const sprints = searchQuery
    ? allSprints.filter((s) => normalize(s.name).includes(normalize(searchQuery)))
    : allSprints;

  const handleCreate = () => {
    if (!form.name.trim() || !form.projectId || !form.startDate || !form.endDate) return;
    const payload: CreateSprintRequest = {
      name: form.name.trim(),
      projectId: Number(form.projectId),
      goal: form.goal || undefined,
      startDate: form.startDate,
      endDate: form.endDate,
    };
    createMutation.mutate(payload);
  };

  const handleDialogOpen = () => {
    const { defaultStart, defaultEnd } = getDefaultDates();
    setForm({
      ...makeDefaultForm(),
      startDate: defaultStart,
      endDate: defaultEnd,
      projectId: selectedProjectId !== 'all' ? selectedProjectId : '',
    });
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-foreground">Sprintler</h1>
        <div className="flex items-center gap-2">
          {/* Project filter */}
          <Select value={selectedProjectId} onValueChange={(v) => setSelectedProjectId(v ?? 'all')}>
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <SelectValue placeholder="Tüm Projeler">
                {selectedProjectId === 'all'
                  ? 'Tüm Projeler'
                  : projects.find((p) => String(p.id) === selectedProjectId)?.name ?? 'Tüm Projeler'}
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

          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            onClick={handleDialogOpen}
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Sprint
          </Button>
        </div>
      </div>

      {/* State filter tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={[
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              filterTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
            style={
              filterTab === tab.key
                ? { borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }
                : {}
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sprint cards grid */}
      {isLoading ? (
        <SprintsGridSkeleton />
      ) : sprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Target className="w-10 h-10 opacity-30" />
          <p className="text-sm">Sprint bulunamadı</p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDialogOpen}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Sprint Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              onClick={() => navigate(`/sprints/${sprint.id}`)}
            />
          ))}
        </div>
      )}

      {/* New Sprint Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Sprint Oluştur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Sprint Adı <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Sprint adı giriniz..."
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Project */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Proje <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.projectId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, projectId: value ?? '' }))}
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

            {/* Goal */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sprint Hedefi</label>
              <textarea
                placeholder="Bu sprint'te ne başarmayı hedefliyorsunuz?"
                value={form.goal}
                onChange={(e) => setForm((prev) => ({ ...prev, goal: e.target.value }))}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Başlangıç <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Bitiş <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !form.name.trim() ||
                !form.projectId ||
                !form.startDate ||
                !form.endDate ||
                createMutation.isPending
              }
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
