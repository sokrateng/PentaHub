import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Zap,
  Inbox,
  Users,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projeler', icon: FolderKanban },
  { to: '/tasks', label: 'Görevler', icon: ListTodo },
  { to: '/sprints', label: 'Sprintler', icon: Zap },
  { to: '/backlog', label: 'Backlog', icon: Inbox },
  { to: '/resources', label: 'Kaynaklar', icon: Users },
];

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[260px] flex flex-col z-50"
      style={{ backgroundColor: 'hsl(220 25% 14%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'hsl(220 20% 22%)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: 'hsl(153 60% 33%)' }}
        >
          P
        </div>
        <span className="font-semibold text-base tracking-tight" style={{ color: 'hsl(210 40% 95%)' }}>
          PentaHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 group relative',
                isActive
                  ? 'text-white'
                  : 'text-[hsl(210_40%_70%)] hover:text-[hsl(210_40%_90%)]',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: 'hsl(220 20% 22%)' }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ backgroundColor: 'hsl(153 60% 48%)' }}
                  />
                )}
                <Icon
                  className={[
                    'w-4 h-4 flex-shrink-0',
                    isActive ? 'text-[hsl(153_60%_48%)]' : 'text-[hsl(210_40%_55%)] group-hover:text-[hsl(210_40%_75%)]',
                  ].join(' ')}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'hsl(220 20% 22%)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer hover:bg-[hsl(220_20%_20%)] transition-colors">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: 'hsl(153 60% 33%)' }}
          >
            U
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'hsl(210 40% 90%)' }}>
              Kullanıcı
            </p>
            <p className="text-xs truncate" style={{ color: 'hsl(210 40% 55%)' }}>
              kullanici@penta.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
