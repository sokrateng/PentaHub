import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Görevler',
  '/sprints': 'Sprintler',
  '/backlog': 'Backlog',
  '/resources': 'Kaynaklar',
};

export function PlaceholderPage() {
  const location = useLocation();
  const pageName = routeNames[location.pathname] ?? 'Bu Sayfa';

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: 'hsl(153 60% 33% / 0.1)' }}
      >
        <Construction className="w-8 h-8" style={{ color: 'hsl(153 60% 33%)' }} />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{pageName}</h2>
      <p className="text-muted-foreground text-sm">Bu sayfa yakında eklenecek</p>
    </div>
  );
}
