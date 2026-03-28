import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Bell, Search, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projeler',
  '/tasks': 'Görevler',
  '/sprints': 'Sprintler',
  '/backlog': 'Backlog',
  '/resources': 'Kaynaklar',
  '/contacts': 'Kontaklar',
};

function getBreadcrumb(pathname: string): { parent?: string; current: string } {
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return { parent: 'Projeler', current: 'Proje Detayı' };
  }
  if (pathname.startsWith('/contacts/') && pathname !== '/contacts') {
    return { parent: 'Kontaklar', current: 'Kontak Detayı' };
  }
  return { current: routeTitles[pathname] ?? 'PentaHub' };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const breadcrumb = getBreadcrumb(location.pathname);
  const { user, logout } = useAuthStore();

  const [query, setQuery] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('search') ?? '');
  }, [searchParams]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed) {
        navigate(location.pathname + '?search=' + encodeURIComponent(trimmed));
      } else {
        navigate(location.pathname);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    navigate(location.pathname);
  };

  const displayName = user?.fullName ?? 'Kullanıcı';
  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8 pr-7 h-8 w-48 text-sm bg-muted/50 border-border/60 focus-visible:ring-primary/30"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Aramayı temizle"
            >
              <X className="w-3 h-3" />
            </button>
          )}
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
          <DropdownMenuTrigger>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{ backgroundColor: 'hsl(153 60% 33%)' }}
              aria-label="Kullanıcı menüsü"
              title={displayName}
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium text-sm">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground font-normal truncate">{user.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Ayarlar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
