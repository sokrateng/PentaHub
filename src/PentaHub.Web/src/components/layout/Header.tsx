import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projeler',
  '/tasks': 'Görevler',
  '/sprints': 'Sprintler',
  '/backlog': 'Backlog',
  '/resources': 'Kaynaklar',
};

function getBreadcrumb(pathname: string): { parent?: string; current: string } {
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return { parent: 'Projeler', current: 'Proje Detayı' };
  }
  return { current: routeTitles[pathname] ?? 'PentaHub' };
}

export function Header() {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-4 sticky top-0 z-40">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {breadcrumb.parent ? (
          <>
            <span className="text-sm text-muted-foreground">{breadcrumb.parent}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">{breadcrumb.current}</span>
          </>
        ) : (
          <span className="text-sm font-semibold text-foreground">{breadcrumb.current}</span>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Ara..."
            className="pl-8 h-8 w-48 text-sm bg-muted/50 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Notification bell */}
        <button
          className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Bildirimler"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: 'hsl(153 60% 33%)' }}
              aria-label="Kullanıcı menüsü"
            >
              U
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Ayarlar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Çıkış Yap</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
