import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  FolderKanban,
  PlayCircle,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { projectsApi, sprintsApi } from '@/services/api';
import { ProjectStatus, SprintState } from '@/types';

const GREEN = 'hsl(153 60% 33%)';
const AMBER = 'hsl(38 92% 50%)';
const BLUE = 'hsl(217 91% 60%)';
const RED = 'hsl(0 84% 60%)';
const PURPLE = 'hsl(262 83% 58%)';

const STATUS_COLORS: Record<number, string> = {
  [ProjectStatus.Beklemede]: AMBER,
  [ProjectStatus.DevamEden]: GREEN,
  [ProjectStatus.Tamamlandi]: BLUE,
};

const SPRINT_COLORS: Record<number, string> = {
  [SprintState.Draft]: 'hsl(214 31% 75%)',
  [SprintState.InProgress]: GREEN,
  [SprintState.Done]: BLUE,
};

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        {isLoading ? (
          <div className="h-8 w-12 bg-muted rounded animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground leading-none mb-1">{value}</p>
        )}
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="h-[200px] bg-muted rounded-lg animate-pulse" />
  );
}

export function DashboardPage() {
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['project-stats'],
    queryFn: () => projectsApi.getStats(),
  });

  const { data: projectsResponse, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', { excludeTemplates: true }],
    queryFn: () => projectsApi.getAll({ excludeTemplates: true, pageSize: 100 }),
  });

  const { data: sprintsResponse, isLoading: sprintsLoading } = useQuery({
    queryKey: ['sprints', {}],
    queryFn: () => sprintsApi.getAll(),
  });

  const stats = statsResponse?.data;
  const projects = projectsResponse?.data ?? [];
  const sprints = sprintsResponse?.data ?? [];

  // Project status pie data
  const statusPieData = [
    { name: 'Beklemede', value: projects.filter((p) => p.status === ProjectStatus.Beklemede).length },
    { name: 'Devam Eden', value: projects.filter((p) => p.status === ProjectStatus.DevamEden).length },
    { name: 'Tamamlandı', value: projects.filter((p) => p.status === ProjectStatus.Tamamlandi).length },
  ].filter((d) => d.value > 0);

  const statusPieColors = [AMBER, GREEN, BLUE];

  // Department bar data
  const deptMap = new Map<string, number>();
  projects.forEach((p) => {
    const dept = p.departmentName || 'Diğer';
    deptMap.set(dept, (deptMap.get(dept) ?? 0) + 1);
  });
  const deptBarData = Array.from(deptMap.entries())
    .map(([dept, count]) => ({ name: dept, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Manager bar data
  const managerMap = new Map<string, number>();
  projects.forEach((p) => {
    const mgr = p.projectManagerName || 'Atanmamış';
    managerMap.set(mgr, (managerMap.get(mgr) ?? 0) + 1);
  });
  const managerBarData = Array.from(managerMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Sprint state pie data
  const sprintStateMap = new Map<number, number>();
  sprints.forEach((s) => {
    sprintStateMap.set(s.state, (sprintStateMap.get(s.state) ?? 0) + 1);
  });
  const sprintPieData = [
    { name: 'Taslak', value: sprintStateMap.get(SprintState.Draft) ?? 0, color: SPRINT_COLORS[SprintState.Draft] },
    { name: 'Devam Eden', value: sprintStateMap.get(SprintState.InProgress) ?? 0, color: SPRINT_COLORS[SprintState.InProgress] },
    { name: 'Tamamlandı', value: sprintStateMap.get(SprintState.Done) ?? 0, color: SPRINT_COLORS[SprintState.Done] },
  ].filter((d) => d.value > 0);

  // Recent projects (last 5, show most recently added first based on id)
  const recentProjects = [...projects]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const isLoading = statsLoading || projectsLoading;

  const statusLabel: Record<number, string> = {
    [ProjectStatus.Beklemede]: 'Beklemede',
    [ProjectStatus.DevamEden]: 'Devam Eden',
    [ProjectStatus.Tamamlandi]: 'Tamamlandı',
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Proje portföyünüze genel bakış</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Toplam Proje"
          value={stats?.total ?? 0}
          icon={FolderKanban}
          color={BLUE}
          isLoading={statsLoading}
        />
        <KpiCard
          label="Aktif Proje"
          value={stats?.active ?? 0}
          icon={PlayCircle}
          color={GREEN}
          isLoading={statsLoading}
        />
        <KpiCard
          label="Bekleyen"
          value={stats?.waiting ?? 0}
          icon={Clock}
          color={AMBER}
          isLoading={statsLoading}
        />
        <KpiCard
          label="Gecikmiş"
          value={stats?.overdue ?? 0}
          icon={AlertCircle}
          color={RED}
          isLoading={statsLoading}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Proje Durumu */}
        <ChartCard title="Proje Durumu Dağılımı">
          {isLoading ? (
            <SkeletonChart />
          ) : statusPieData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Henüz proje yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={entry.name} fill={statusPieColors[index % statusPieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => [`${value} proje`, '']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214.3 31.8% 91.4%)' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Departman Dağılımı */}
        <ChartCard title="Departman Bazında Proje Sayısı">
          {isLoading ? (
            <SkeletonChart />
          ) : deptBarData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Departman verisi yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptBarData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={40}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: unknown) => [`${value} proje`, 'Proje']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214.3 31.8% 91.4%)' }}
                />
                <Bar dataKey="count" fill={GREEN} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Yönetici Kırılımı */}
        <ChartCard title="Proje Yöneticisi Bazında Dağılım">
          {isLoading ? (
            <SkeletonChart />
          ) : managerBarData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Veri yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={managerBarData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={40}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: unknown) => [`${value} proje`, 'Proje']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214.3 31.8% 91.4%)' }}
                />
                <Bar dataKey="count" fill={PURPLE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Sprint Durumları */}
        <ChartCard title="Sprint Durum Dağılımı">
          {sprintsLoading ? (
            <SkeletonChart />
          ) : sprintPieData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
              Henüz sprint yok
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sprintPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sprintPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => [`${value} sprint`, '']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214.3 31.8% 91.4%)' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Son Projeler</h3>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
            style={{ color: GREEN }}
          >
            Tümünü Gör
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 animate-pulse">
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded ml-auto" />
              </div>
            ))
          ) : recentProjects.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Henüz proje yok
            </div>
          ) : (
            recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors group"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[project.status] ?? BLUE }}
                />
                <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors flex-1">
                  {project.name}
                </span>
                {project.departmentName && (
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {project.departmentName}
                  </span>
                )}
                {project.projectManagerName && (
                  <span className="text-xs text-muted-foreground hidden md:block">
                    {project.projectManagerName}
                  </span>
                )}
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{
                    backgroundColor: `${STATUS_COLORS[project.status] ?? BLUE}18`,
                    color: STATUS_COLORS[project.status] ?? BLUE,
                  }}
                >
                  {statusLabel[project.status] ?? project.statusText}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
