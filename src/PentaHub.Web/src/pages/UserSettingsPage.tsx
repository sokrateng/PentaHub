import { useState } from 'react';
import { Settings, User as UserIcon, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';

const DEPARTMENTS = ['Yazılım', 'Satış', 'IT', 'İK', 'Pazarlama', 'Finans', 'Operasyon'];

const PRIMARY = 'hsl(153 60% 33%)';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserSettingsPage() {
  const { user } = useAuthStore();

  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName ?? '',
    department: user?.department ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const displayName = user?.fullName ?? 'Kullanıcı';
  const initials = getInitials(displayName);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <Settings className="w-5 h-5" style={{ color: PRIMARY }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>
          <p className="text-sm text-muted-foreground">Hesap bilgilerinizi yönetin</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: PRIMARY }}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">{displayName}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.role && (
              <span
                className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
              >
                {user.role}
              </span>
            )}
          </div>
        </div>

        {/* Current Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserIcon className="w-4 h-4" style={{ color: PRIMARY }} />
            <h2 className="text-sm font-semibold text-foreground">Profil Bilgileri</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Ad Soyad</p>
              <p className="font-medium text-foreground">{user?.fullName ?? '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">E-posta</p>
              <p className="font-medium text-foreground">{user?.email ?? '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Departman</p>
              <p className="font-medium text-foreground">{user?.department ?? '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="font-medium text-foreground">{user?.role ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="space-y-4 pt-2 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Profili Düzenle</h3>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ad Soyad</label>
            <Input
              value={profileForm.fullName}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Ad Soyad..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Departman</label>
            <Select
              value={profileForm.department}
              onValueChange={(v) => setProfileForm((prev) => ({ ...prev, department: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Departman seçin..." />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Avatar URL</label>
            <Input
              value={profileForm.avatarUrl}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          {profileSaved && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              Ayarlar kaydedildi.
            </div>
          )}

          <Button
            onClick={handleSaveProfile}
            style={{ backgroundColor: PRIMARY, color: 'white' }}
          >
            Kaydet
          </Button>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4" style={{ color: PRIMARY }} />
          <h2 className="text-sm font-semibold text-foreground">Şifre Değiştir</h2>
        </div>

        <div
          className="flex items-start gap-2 px-3 py-3 rounded-lg text-sm"
          style={{ backgroundColor: 'hsl(45 100% 95%)', borderLeft: '3px solid hsl(45 100% 50%)' }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <span className="text-amber-800">Bu özellik yakında eklenecek.</span>
        </div>

        <div className="space-y-3 opacity-50 pointer-events-none">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Mevcut Şifre</label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Yeni Şifre</label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Yeni Şifre (Tekrar)</label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <Button disabled style={{ backgroundColor: PRIMARY, color: 'white' }}>
            Şifreyi Güncelle
          </Button>
        </div>
      </div>
    </div>
  );
}
