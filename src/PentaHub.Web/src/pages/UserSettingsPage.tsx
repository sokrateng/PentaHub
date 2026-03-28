import { useState } from 'react';
import { Settings, User as UserIcon, Lock, Info, Users, Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, authApi } from '@/services/api';
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

interface NewUserForm {
  fullName: string;
  email: string;
  password: string;
  department: string;
}

const defaultNewUserForm: NewUserForm = {
  fullName: '',
  email: '',
  password: '',
  department: '',
};

export function UserSettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName ?? '',
    department: user?.department ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>(defaultNewUserForm);
  const [newUserError, setNewUserError] = useState('');

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const allUsers = usersResponse?.data ?? [];
  const uniqueDepartments = Array.from(
    new Set(allUsers.map((u) => u.department).filter(Boolean))
  ) as string[];

  const createUserMutation = useMutation({
    mutationFn: (form: NewUserForm) =>
      authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        department: form.department || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUserDialogOpen(false);
      setNewUserForm(defaultNewUserForm);
      setNewUserError('');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setNewUserError(msg ?? 'Kullanıcı oluşturulurken hata oluştu.');
    },
  });

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleCreateUser = () => {
    if (!newUserForm.fullName.trim() || !newUserForm.email.trim() || !newUserForm.password.trim()) return;
    setNewUserError('');
    createUserMutation.mutate(newUserForm);
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

      {/* User Management Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: PRIMARY }} />
            <h2 className="text-sm font-semibold text-foreground">Kullanıcı Yönetimi</h2>
          </div>
          <Button
            size="sm"
            className="gap-1.5 h-8 text-xs"
            style={{ backgroundColor: PRIMARY, color: 'white' }}
            onClick={() => setNewUserDialogOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Kullanıcı
          </Button>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ad Soyad</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-posta</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Departman</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rol</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                allUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          {getInitials(u.fullName)}
                        </div>
                        <span className="font-medium text-foreground">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.department ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">{u.role}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Departments Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" style={{ color: PRIMARY }} />
          <h2 className="text-sm font-semibold text-foreground">Departmanlar</h2>
        </div>

        <div
          className="flex items-start gap-2 px-3 py-3 rounded-lg text-sm"
          style={{ backgroundColor: `${PRIMARY}0d`, borderLeft: `3px solid ${PRIMARY}` }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
          <span style={{ color: PRIMARY }}>
            Departmanlar kullanıcı ve proje tanımlarından otomatik oluşturulur.
          </span>
        </div>

        {uniqueDepartments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Henüz departman tanımlanmamış.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {uniqueDepartments.map((dept) => (
              <Badge
                key={dept}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {dept}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* New User Dialog */}
      <Dialog open={newUserDialogOpen} onOpenChange={(open) => { if (!open) { setNewUserDialogOpen(false); setNewUserForm(defaultNewUserForm); setNewUserError(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Ad Soyad <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Ad Soyad..."
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                E-posta <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="kullanici@example.com"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Şifre <span className="text-destructive">*</span>
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Departman</label>
              <Select
                value={newUserForm.department}
                onValueChange={(v) => setNewUserForm((prev) => ({ ...prev, department: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departman seçin veya yazın...">
                    {newUserForm.department || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newUserError && (
              <div
                className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'hsl(0 86% 97%)', color: 'hsl(0 72% 51%)' }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {newUserError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewUserDialogOpen(false); setNewUserForm(defaultNewUserForm); setNewUserError(''); }}>
              İptal
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={
                !newUserForm.fullName.trim() ||
                !newUserForm.email.trim() ||
                !newUserForm.password.trim() ||
                createUserMutation.isPending
              }
              style={{ backgroundColor: PRIMARY, color: 'white' }}
            >
              {createUserMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
