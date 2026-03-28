import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  LayoutGrid,
  List,
  Filter,
  Plus,
  Star,
  Banknote,
  Calendar,
  User as UserIcon,
  Building2,
  X,
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
import { Input } from '@/components/ui/input';
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
import { projectsApi, usersApi } from '@/services/api';
import { ProjectStatus, PrivacyLevel, EvaluationType } from '@/types';
import type { ProjectListItem, CreateProjectRequest } from '@/types';
import { getInitials, formatDate } from '@/lib/utils';
import { PRIMARY_COLOR } from '@/lib/constants';

interface FilterState {
  status: string;
  managerId: string;
  isBillable: boolean | null;
  excludeTemplates: boolean;
}

type ViewMode = 'kanban' | 'list';

interface Column {
  id: ProjectStatus;
  label: string;
  color: string;
}

const columns: Column[] = [
  { id: ProjectStatus.Beklemede, label: 'Beklemede', color: '#f59e0b' },
  { id: ProjectStatus.DevamEden, label: 'Devam Eden', color: PRIMARY_COLOR },
  { id: ProjectStatus.Tamamlandi, label: 'Tamamlandı', color: '#3b82f6' },
];



interface ProjectCardProps {
  project: ProjectListItem;
  index: number;
  onClick: () => void;
}

function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <Draggable draggableId={String(project.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={[
            'bg-white rounded-lg border border-border p-3.5 cursor-pointer',
            'hover:shadow-md hover:border-border/80 transition-all duration-150',
            snapshot.isDragging ? 'shadow-lg rotate-1 opacity-90' : '',
          ].join(' ')}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 flex-1">
              {project.name}
            </h4>
            {project.isTemplate && (
              <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" />
            )}
          </div>

          {/* Department */}
          {project.departmentName && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{project.departmentName}</span>
            </div>
          )}

          {/* Manager */}
          {project.projectManagerName && (
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                {getInitials(project.projectManagerName)}
              </div>
              <span className="text-xs text-muted-foreground truncate">{project.projectManagerName}</span>
            </div>
          )}

          {/* Dates */}
          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-1.5 mb-2.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>
                {formatDate(project.startDate)} – {formatDate(project.endDate)}
              </span>
            </div>
          )}

          {/* Footer badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {project.isBillable && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-0.5 font-medium">
                <Banknote className="w-2.5 h-2.5" />
                Faturalanabilir
              </Badge>
            )}
            {project.taskCount > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-medium">
                {project.taskCount} görev
              </Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

function KanbanSkeleton() {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {columns.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-72">
          <div className="h-8 bg-muted rounded mb-3 animate-pulse" />
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface NewProjectForm {
  name: string;
  description: string;
  projectManagerId: string;
  departmentName: string;
  status: string;
  startDate: string;
  endDate: string;
  isBillable: boolean;
  isTemplate: boolean;
}

const defaultForm: NewProjectForm = {
  name: '',
  description: '',
  projectManagerId: '',
  departmentName: '',
  status: String(ProjectStatus.Beklemede),
  startDate: '',
  endDate: '',
  isBillable: false,
  isTemplate: false,
};

function statusBadgeVariant(status: ProjectStatus): 'default' | 'secondary' | 'outline' {
  if (status === ProjectStatus.DevamEden) return 'default';
  if (status === ProjectStatus.Tamamlandi) return 'secondary';
  return 'outline';
}

function statusLabel(status: ProjectStatus): string {
  if (status === ProjectStatus.DevamEden) return 'Devam Eden';
  if (status === ProjectStatus.Tamamlandi) return 'Tamamlandı';
  return 'Beklemede';
}

const defaultFilter: FilterState = {
  status: 'all',
  managerId: 'all',
  isBillable: null,
  excludeTemplates: false,
};

type PageMode = 'projects' | 'templates';

export function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [pageMode, setPageMode] = useState<PageMode>('projects');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<NewProjectForm>(defaultForm);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState<FilterState>(defaultFilter);
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(defaultFilter);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const hasActiveFilter =
    appliedFilter.status !== 'all' ||
    appliedFilter.managerId !== 'all' ||
    appliedFilter.isBillable !== null ||
    appliedFilter.excludeTemplates;

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ['projects', appliedFilter],
    queryFn: () =>
      projectsApi.getAll({
        excludeTemplates: appliedFilter.excludeTemplates,
        status: appliedFilter.status !== 'all' ? Number(appliedFilter.status) : undefined,
        managerId: appliedFilter.managerId !== 'all' ? Number(appliedFilter.managerId) : undefined,
      }),
  });

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateProjectRequest) => projectsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDialogOpen(false);
      setForm(defaultForm);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      projectsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const allProjects = projectsResponse?.data ?? [];
  const users = usersResponse?.data ?? [];

  const templateProjects = allProjects.filter((p) => p.isTemplate);
  const regularProjects = allProjects.filter((p) => {
    if (p.isTemplate && pageMode === 'projects') return false;
    if (appliedFilter.isBillable !== null && p.isBillable !== appliedFilter.isBillable) return false;
    return true;
  });

  const projects = pageMode === 'templates' ? templateProjects : regularProjects;

  const projectsByStatus = (status: ProjectStatus): ProjectListItem[] =>
    projects.filter((p) => p.status === status);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = Number(result.destination.droppableId) as ProjectStatus;
    const projectId = Number(result.draggableId);
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.status === newStatus) return;
    updateStatusMutation.mutate({ id: projectId, status: newStatus });
  };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const payload: CreateProjectRequest = {
      name: form.name.trim(),
      description: form.description || undefined,
      status: Number(form.status) as ProjectStatus,
      projectManagerId: form.projectManagerId ? Number(form.projectManagerId) : 1,
      departmentName: form.departmentName || undefined,
      privacyLevel: PrivacyLevel.AllEmployees,
      isBillable: form.isBillable,
      isTemplate: form.isTemplate,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      customerEvaluation: EvaluationType.None,
    };
    createMutation.mutate(payload);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setForm(defaultForm);
      return;
    }
    const template = templateProjects.find((p) => String(p.id) === templateId);
    if (template) {
      setForm((prev) => ({
        ...prev,
        name: `Kopya - ${template.name}`,
        departmentName: template.departmentName ?? '',
        projectManagerId: template.projectManagerId ? String(template.projectManagerId) : '',
        isBillable: template.isBillable,
        isTemplate: false,
      }));
    }
  };

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">
            {pageMode === 'templates' ? 'Şablonlar' : 'Projeler'}
          </h1>
          <div className="flex items-center border border-border rounded-md overflow-hidden h-7">
            <button
              onClick={() => setPageMode('projects')}
              className={[
                'px-2.5 h-full flex items-center gap-1 text-xs font-medium transition-colors',
                pageMode === 'projects'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              Projeler
            </button>
            <button
              onClick={() => setPageMode('templates')}
              className={[
                'px-2.5 h-full flex items-center gap-1 text-xs font-medium transition-colors border-l border-border',
                pageMode === 'templates'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              <Star className="w-3 h-3" />
              Şablonlar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-border rounded-md overflow-hidden h-8">
            <button
              onClick={() => setViewMode('kanban')}
              className={[
                'px-2.5 h-full flex items-center gap-1.5 text-xs font-medium transition-colors',
                viewMode === 'kanban'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
              aria-label="Kanban görünümü"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={[
                'px-2.5 h-full flex items-center gap-1.5 text-xs font-medium transition-colors border-l border-border',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
              aria-label="Liste görünümü"
            >
              <List className="w-3.5 h-3.5" />
              Liste
            </button>
          </div>

          {/* Filter popover */}
          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              size="sm"
              className={[
                'h-8 gap-1.5 text-xs',
                hasActiveFilter ? 'border-primary text-primary' : '',
              ].join(' ')}
              onClick={() => {
                setPendingFilter(appliedFilter);
                setFilterOpen((prev) => !prev);
              }}
            >
              <Filter className="w-3.5 h-3.5" />
              Filtrele
              {hasActiveFilter && (
                <span
                  className="w-1.5 h-1.5 rounded-full ml-0.5"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                />
              )}
            </Button>

            {filterOpen && (
              <div className="absolute right-0 top-9 z-50 bg-white border border-border rounded-xl shadow-lg p-4 w-64 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">Filtrele</span>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Kapat"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Durum</label>
                  <Select
                    value={pendingFilter.status}
                    onValueChange={(v) => setPendingFilter((prev) => ({ ...prev, status: v ?? 'all' }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>
                        {pendingFilter.status === 'all'
                          ? 'Tümü'
                          : pendingFilter.status === String(ProjectStatus.Beklemede)
                          ? 'Beklemede'
                          : pendingFilter.status === String(ProjectStatus.DevamEden)
                          ? 'Devam Eden'
                          : pendingFilter.status === String(ProjectStatus.Tamamlandi)
                          ? 'Tamamlandı'
                          : 'Tümü'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value={String(ProjectStatus.Beklemede)}>Beklemede</SelectItem>
                      <SelectItem value={String(ProjectStatus.DevamEden)}>Devam Eden</SelectItem>
                      <SelectItem value={String(ProjectStatus.Tamamlandi)}>Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Manager */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Proje Yöneticisi</label>
                  <Select
                    value={pendingFilter.managerId}
                    onValueChange={(v) => setPendingFilter((prev) => ({ ...prev, managerId: v ?? 'all' }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>
                        {pendingFilter.managerId === 'all'
                          ? 'Tümü'
                          : users.find((u) => String(u.id) === pendingFilter.managerId)?.fullName ?? 'Tümü'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Billable */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Faturalanabilir</label>
                  <Select
                    value={pendingFilter.isBillable === null ? 'all' : pendingFilter.isBillable ? 'yes' : 'no'}
                    onValueChange={(v) =>
                      setPendingFilter((prev) => ({
                        ...prev,
                        isBillable: v === 'all' ? null : v === 'yes',
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>
                        {pendingFilter.isBillable === null
                          ? 'Tümü'
                          : pendingFilter.isBillable
                          ? 'Faturalanabilir'
                          : 'Faturalanmaz'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tümü</SelectItem>
                      <SelectItem value="yes">Faturalanabilir</SelectItem>
                      <SelectItem value="no">Faturalanmaz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Exclude templates */}
                <label className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={pendingFilter.excludeTemplates}
                    onChange={(e) =>
                      setPendingFilter((prev) => ({ ...prev, excludeTemplates: e.target.checked }))
                    }
                    className="w-3.5 h-3.5 rounded accent-primary"
                  />
                  <span className="text-xs text-foreground">Şablonları hariç tut</span>
                </label>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={() => {
                      setPendingFilter(defaultFilter);
                      setAppliedFilter(defaultFilter);
                      setFilterOpen(false);
                    }}
                  >
                    Temizle
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs flex-1"
                    style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
                    onClick={() => {
                      setAppliedFilter(pendingFilter);
                      setFilterOpen(false);
                    }}
                  >
                    Uygula
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs"
            style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Proje
          </Button>
        </div>
      </div>

      {/* Template info banner */}
      {pageMode === 'templates' && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm border"
          style={{
            backgroundColor: 'hsl(43 96% 56% / 0.08)',
            borderColor: 'hsl(43 96% 56% / 0.3)',
            color: 'hsl(43 96% 25%)',
          }}
        >
          <Star className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <span>
            Şablon olarak işaretlenen projeler, yeni projeler oluştururken referans olarak kullanılabilir.
            Yeni proje oluştururken "Şablondan Oluştur" seçeneği ile şablon bilgilerini forma aktarabilirsiniz.
          </span>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <KanbanSkeleton />
      ) : viewMode === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 overflow-x-auto pb-4 flex-1">
            {columns.map((col) => {
              const colProjects = projectsByStatus(col.id);
              return (
                <div key={col.id} className="flex-shrink-0 w-72">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="text-sm font-semibold text-foreground flex-1">{col.label}</span>
                    <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {colProjects.length}
                    </span>
                  </div>

                  {/* Column body with top border */}
                  <div
                    className="rounded-xl pt-0.5 min-h-[200px]"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div
                      className="rounded-t-xl h-0.5 mb-2"
                      style={{ backgroundColor: col.color }}
                    />
                    <Droppable droppableId={String(col.id)}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={[
                            'space-y-2.5 min-h-[100px] rounded-lg p-1 transition-colors',
                            snapshot.isDraggingOver ? 'bg-muted/60' : '',
                          ].join(' ')}
                        >
                          {colProjects.map((project, index) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              index={index}
                              onClick={() => navigate(`/projects/${project.id}`)}
                            />
                          ))}
                          {provided.placeholder}
                          {colProjects.length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-xs text-muted-foreground text-center py-8 opacity-60">
                              Proje yok
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Proje Adı</TableHead>
                <TableHead>Yönetici</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Departman</TableHead>
                <TableHead>Başlangıç</TableHead>
                <TableHead>Bitiş</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12 text-sm">
                    Henüz proje bulunmuyor
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{project.name}</span>
                        {project.isTemplate && (
                          <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.projectManagerName ? (
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                          >
                            {getInitials(project.projectManagerName)}
                          </div>
                          <span className="text-sm">{project.projectManagerName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant(project.status)}
                        className="text-xs"
                        style={
                          project.status === ProjectStatus.DevamEden
                            ? { backgroundColor: PRIMARY_COLOR, color: 'white' }
                            : {}
                        }
                      >
                        {statusLabel(project.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {project.departmentName ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(project.startDate)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(project.endDate)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setSelectedTemplateId(''); setForm(defaultForm); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Proje Oluştur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Template selector */}
            {templateProjects.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Şablondan Oluştur</label>
                <Select value={selectedTemplateId} onValueChange={(v) => handleSelectTemplate(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Şablon seçin (opsiyonel)...">
                      {selectedTemplateId
                        ? templateProjects.find((p) => String(p.id) === selectedTemplateId)?.name
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Şablon kullanma</SelectItem>
                    {templateProjects.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
                          {t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplateId && (
                  <p className="text-xs text-muted-foreground">
                    Şablon bilgileri forma aktarıldı. İstediğiniz alanları düzenleyebilirsiniz.
                  </p>
                )}
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Proje Adı <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Proje adı giriniz..."
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Açıklama</label>
              <textarea
                placeholder="Proje açıklaması..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Manager */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Proje Yöneticisi</label>
              <Select
                value={form.projectManagerId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, projectManagerId: value ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yönetici seçin...">
                    {form.projectManagerId
                      ? users.find((u) => String(u.id) === form.projectManagerId)?.fullName
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

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Departman</label>
              <Select
                value={form.departmentName}
                onValueChange={(value) => setForm((prev) => ({ ...prev, departmentName: value ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departman seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {['Yazılım', 'Satış', 'IT', 'İK', 'Pazarlama', 'Finans', 'Operasyon'].map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Durum</label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value ?? '' }))}
              >
                <SelectTrigger>
                  <SelectValue>
                    {form.status === String(ProjectStatus.Beklemede)
                      ? 'Beklemede'
                      : form.status === String(ProjectStatus.DevamEden)
                      ? 'Devam Eden'
                      : form.status === String(ProjectStatus.Tamamlandi)
                      ? 'Tamamlandı'
                      : 'Beklemede'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(ProjectStatus.Beklemede)}>Beklemede</SelectItem>
                  <SelectItem value={String(ProjectStatus.DevamEden)}>Devam Eden</SelectItem>
                  <SelectItem value={String(ProjectStatus.Tamamlandi)}>Tamamlandı</SelectItem>
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
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBillable}
                  onChange={(e) => setForm((prev) => ({ ...prev, isBillable: e.target.checked }))}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm font-medium">Faturalanabilir</span>
              </label>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isTemplate}
                    onChange={(e) => setForm((prev) => ({ ...prev, isTemplate: e.target.checked }))}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-medium">Şablon</span>
                </label>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  Şablon projeler, yeni projeler oluştururken referans olarak kullanılır.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.name.trim() || createMutation.isPending}
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
