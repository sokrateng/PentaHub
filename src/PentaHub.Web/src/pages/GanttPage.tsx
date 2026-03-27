import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, AlertCircle, BarChart3, ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ganttApi, projectsApi } from '@/services/api';
import type { GanttTask } from '@/types';

type ZoomLevel = 'day' | 'week' | 'month';

const ZOOM_CONFIGS: Record<ZoomLevel, { colWidth: number; label: string }> = {
  day: { colWidth: 40, label: 'Gün' },
  week: { colWidth: 120, label: 'Hafta' },
  month: { colWidth: 200, label: 'Ay' },
};

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayDiff(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateHeader(date: Date, zoom: ZoomLevel): string {
  if (zoom === 'day') {
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
  }
  if (zoom === 'week') {
    const end = addDays(date, 6);
    return `${date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} – ${end.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}`;
  }
  return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
}

function getZoomStep(zoom: ZoomLevel): number {
  if (zoom === 'day') return 1;
  if (zoom === 'week') return 7;
  return 30;
}

interface GanttBarProps {
  task: GanttTask;
  timelineStart: Date;
  colWidth: number;
  zoom: ZoomLevel;
  rowHeight: number;
  onClick: () => void;
}

function GanttBar({ task, timelineStart, colWidth, zoom, rowHeight, onClick }: GanttBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const step = getZoomStep(zoom);
  const pixelsPerDay = colWidth / step;

  if (!task.startDate && !task.dueDate) return null;

  const start = task.startDate ? new Date(task.startDate) : new Date(task.dueDate!);
  const end = task.dueDate ? new Date(task.dueDate) : new Date(task.startDate!);

  const left = Math.max(0, dayDiff(timelineStart, start) * pixelsPerDay);
  const width = Math.max(12, (dayDiff(start, end) + 1) * pixelsPerDay);
  const topPad = Math.floor((rowHeight - 24) / 2);

  return (
    <div
      className="absolute cursor-pointer"
      style={{ left, width, top: topPad }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Bar background */}
      <div
        className="rounded-md h-6 relative overflow-hidden border border-black/10 shadow-sm"
        style={{ backgroundColor: 'hsl(153 60% 33% / 0.15)' }}
      >
        {/* Progress fill */}
        {task.progressPercent > 0 && (
          <div
            className="absolute inset-y-0 left-0 rounded-l-md"
            style={{
              width: `${task.progressPercent}%`,
              backgroundColor: 'hsl(153 60% 33%)',
            }}
          />
        )}
        {/* Label inside bar */}
        <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold truncate z-10"
          style={{ color: task.progressPercent > 50 ? 'white' : 'hsl(153 60% 20%)' }}
        >
          {task.taskNumber}
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-1.5 bg-popover border border-border rounded-lg shadow-lg p-2.5 min-w-[180px] max-w-[260px] pointer-events-none">
          <p className="text-xs font-semibold text-foreground mb-1 leading-snug">{task.title}</p>
          {task.assigneeName && (
            <p className="text-xs text-muted-foreground mb-0.5">
              <span className="font-medium">Atanan:</span> {task.assigneeName}
            </p>
          )}
          {task.stageName && (
            <p className="text-xs text-muted-foreground mb-0.5">
              <span className="font-medium">Aşama:</span> {task.stageName}
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-0.5">
            <span className="font-medium">İlerleme:</span> %{task.progressPercent}
          </p>
          {task.startDate && (
            <p className="text-xs text-muted-foreground mb-0.5">
              <span className="font-medium">Başlangıç:</span>{' '}
              {new Date(task.startDate).toLocaleDateString('tr-TR')}
            </p>
          )}
          {task.dueDate && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Bitiş:</span>{' '}
              {new Date(task.dueDate).toLocaleDateString('tr-TR')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GanttSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-8 bg-muted rounded w-full" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-10 bg-muted rounded w-full" />
      ))}
    </div>
  );
}

const ROW_HEIGHT = 44;
const TASK_LIST_WIDTH = 320;
const PADDING_DAYS = 7;

export function GanttPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = Number(projectIdParam);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState<ZoomLevel>('week');

  const { data: projectResponse } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  });

  const { data: ganttResponse, isLoading } = useQuery({
    queryKey: ['gantt', projectId],
    queryFn: () => ganttApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const project = projectResponse?.data;
  const tasks: GanttTask[] = ganttResponse?.data ?? [];

  const tasksWithDates = tasks.filter((t) => t.startDate || t.dueDate);
  const tasksWithoutDates = tasks.filter((t) => !t.startDate && !t.dueDate);

  // Calculate timeline range
  let timelineStart = new Date();
  let timelineEnd = addDays(new Date(), 30);

  if (tasksWithDates.length > 0) {
    const allDates = tasksWithDates.flatMap((t) => {
      const dates: Date[] = [];
      if (t.startDate) dates.push(new Date(t.startDate));
      if (t.dueDate) dates.push(new Date(t.dueDate));
      return dates;
    });
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    timelineStart = addDays(minDate, -PADDING_DAYS);
    timelineEnd = addDays(maxDate, PADDING_DAYS);
  }

  const step = getZoomStep(zoom);
  const colWidth = ZOOM_CONFIGS[zoom].colWidth;
  const pixelsPerDay = colWidth / step;

  // Generate header columns
  const headerCols: Date[] = [];
  let cur = new Date(timelineStart);
  while (cur <= timelineEnd) {
    headerCols.push(new Date(cur));
    cur = addDays(cur, step);
  }

  const totalTimelineDays = dayDiff(timelineStart, timelineEnd);
  const timelineWidth = Math.max(400, totalTimelineDays * pixelsPerDay);

  const today = new Date();
  const todayLeft = dayDiff(timelineStart, today) * pixelsPerDay;
  const showTodayLine = todayLeft >= 0 && todayLeft <= timelineWidth;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Breadcrumb + controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projeler
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          {project ? (
            <Link
              to={`/projects/${projectId}`}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[200px]"
            >
              {project.name}
            </Link>
          ) : (
            <span className="text-muted-foreground">...</span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">Gantt</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
          >
            Kanban'a Geç
          </Button>

          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {(['day', 'week', 'month'] as ZoomLevel[]).map((z) => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={[
                  'px-2.5 py-1 text-xs font-medium transition-colors',
                  zoom === z
                    ? 'text-white'
                    : 'text-muted-foreground hover:bg-muted',
                ].join(' ')}
                style={zoom === z ? { backgroundColor: 'hsl(153 60% 33%)' } : {}}
              >
                {ZOOM_CONFIGS[z].label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const levels: ZoomLevel[] = ['day', 'week', 'month'];
              const idx = levels.indexOf(zoom);
              if (idx > 0) setZoom(levels[idx - 1]);
            }}
            disabled={zoom === 'day'}
            title="Yakınlaştır"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const levels: ZoomLevel[] = ['day', 'week', 'month'];
              const idx = levels.indexOf(zoom);
              if (idx < levels.length - 1) setZoom(levels[idx + 1]);
            }}
            disabled={zoom === 'month'}
            title="Uzaklaştır"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <GanttSkeleton />
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
          <h3 className="text-base font-semibold text-foreground mb-1">Gantt verisi yok</h3>
          <p className="text-sm text-muted-foreground">Bu projeye ait görev bulunamadı.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden flex-1 flex flex-col min-h-0">
          {/* Fixed header row */}
          <div className="flex border-b border-border flex-shrink-0">
            {/* Task list header */}
            <div
              className="flex-shrink-0 border-r border-border flex items-center px-3 py-2.5 bg-muted/30"
              style={{ width: TASK_LIST_WIDTH }}
            >
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Görev
              </span>
            </div>

            {/* Timeline header */}
            <div className="flex-1 overflow-hidden">
              <div
                ref={scrollRef}
                className="overflow-x-auto"
                style={{ width: '100%' }}
              >
                <div style={{ width: timelineWidth, position: 'relative' }}>
                  <div className="flex">
                    {headerCols.map((colDate, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 border-r border-border/50 px-1 py-2.5 text-center"
                        style={{ width: colWidth, minWidth: colWidth }}
                      >
                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                          {formatDateHeader(colDate, zoom)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            {/* Task list column */}
            <div
              className="flex-shrink-0 border-r border-border overflow-y-auto"
              style={{ width: TASK_LIST_WIDTH }}
            >
              {tasksWithDates.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 px-3 border-b border-border/40 hover:bg-muted/20 cursor-pointer transition-colors"
                  style={{ height: ROW_HEIGHT }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                    {task.taskNumber}
                  </span>
                  <span className="text-sm text-foreground truncate font-medium">
                    {task.title}
                  </span>
                  {task.dependencies.length > 0 && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 flex-shrink-0">
                      {task.dependencies.length}
                    </Badge>
                  )}
                </div>
              ))}

              {/* Tasks without dates */}
              {tasksWithoutDates.length > 0 && (
                <>
                  <div
                    className="px-3 flex items-center gap-2 border-b border-border bg-muted/30"
                    style={{ height: 32 }}
                  >
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Tarihi belirsiz görevler</span>
                  </div>
                  {tasksWithoutDates.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 px-3 border-b border-border/40 hover:bg-muted/20 cursor-pointer transition-colors opacity-50"
                      style={{ height: ROW_HEIGHT }}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
                        {task.taskNumber}
                      </span>
                      <span className="text-sm text-foreground truncate">{task.title}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Timeline body */}
            <div className="flex-1 overflow-auto min-w-0">
              <div style={{ width: timelineWidth, position: 'relative' }}>
                {/* Column gridlines */}
                <div
                  className="absolute inset-0 flex pointer-events-none"
                  style={{ height: (tasksWithDates.length + (tasksWithoutDates.length > 0 ? tasksWithoutDates.length + 1 : 0)) * ROW_HEIGHT }}
                >
                  {headerCols.map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 border-r border-border/20"
                      style={{ width: colWidth, minWidth: colWidth }}
                    />
                  ))}
                </div>

                {/* Today line */}
                {showTodayLine && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 z-10 pointer-events-none"
                    style={{
                      left: todayLeft,
                      backgroundColor: 'hsl(153 60% 33%)',
                      opacity: 0.7,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full -ml-[3px] -mt-1 flex-shrink-0"
                      style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                    />
                  </div>
                )}

                {/* Task bars */}
                {tasksWithDates.map((task) => (
                  <div
                    key={task.id}
                    className="relative border-b border-border/40"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <GanttBar
                      task={task}
                      timelineStart={timelineStart}
                      colWidth={colWidth}
                      zoom={zoom}
                      rowHeight={ROW_HEIGHT}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    />
                  </div>
                ))}

                {/* Rows for tasks without dates */}
                {tasksWithoutDates.length > 0 && (
                  <>
                    <div style={{ height: 32, borderBottom: '1px solid hsl(var(--border) / 0.4)' }} />
                    {tasksWithoutDates.map((task) => (
                      <div
                        key={task.id}
                        className="border-b border-border/40 opacity-30"
                        style={{ height: ROW_HEIGHT }}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/20 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: 'hsl(153 60% 33%)' }}
              />
              <span className="text-xs text-muted-foreground">Tamamlanan kısım</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm border border-black/10"
                style={{ backgroundColor: 'hsl(153 60% 33% / 0.15)' }}
              />
              <span className="text-xs text-muted-foreground">Kalan kısım</span>
            </div>
            {showTodayLine && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-0.5 h-3 rounded"
                  style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                />
                <span className="text-xs text-muted-foreground">Bugün</span>
              </div>
            )}
            <div className="flex items-center gap-1 ml-auto">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {tasksWithDates.length} görev görüntüleniyor
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
