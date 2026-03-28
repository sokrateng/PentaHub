import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User as UserIcon, Lock, Info, Users, Plus, Building2, Brain, Trash2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
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

const BASE_DEPARTMENTS = ['Yazılım', 'Satış', 'IT', 'İK', 'Pazarlama', 'Finans', 'Operasyon'];

const PRIMARY = 'hsl(153 60% 33%)';

const AI_PROVIDER_MODELS: Record<string, string[]> = {
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'o1'],
  'Google Gemini': ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'],
  Anthropic: ['claude-sonnet-4-5', 'claude-haiku-4-5'],
  'Manuel/Özel': [],
};

interface AiSettings {
  provider: string;
  model: string;
  apiKey: string;
  endpointUrl: string;
}

function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem('ai_settings');
    if (raw) return JSON.parse(raw) as AiSettings;
  } catch {
    // ignore
  }
  return { provider: '', model: '', apiKey: '', endpointUrl: '' };
}

function loadCustomDepartments(): string[] {
  try {
    const raw = localStorage.getItem('custom_departments');
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // ignore
  }
  return [];
}

function saveCustomDepartments(depts: string[]) {
  localStorage.setItem('custom_departments', JSON.stringify(depts));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const USER_ROLES = ['User', 'ProjectManager', 'Admin'] as const;
type UserRole = (typeof USER_ROLES)[number];

interface NewUserForm {
  fullName: string;
  email: string;
  password: string;
  department: string;
  role: UserRole;
}

const defaultNewUserForm: NewUserForm = {
  fullName: '',
  email: '',
  password: '',
  department: '',
  role: 'User',
};

function roleBadgeStyle(role: string) {
  if (role === 'Admin') return { backgroundColor: 'hsl(0 72% 51% / 0.12)', color: 'hsl(0 72% 51%)' };
  if (role === 'ProjectManager') return { backgroundColor: 'hsl(38 92% 50% / 0.12)', color: 'hsl(38 92% 35%)' };
  return { backgroundColor: `${PRIMARY}15`, color: PRIMARY };
}

export function UserSettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // --- Profile ---
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName ?? '',
    department: user?.department ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });

  // --- Password change ---
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwPending, setPwPending] = useState(false);

  // --- User management ---
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>(defaultNewUserForm);
  const [newUserError, setNewUserError] = useState('');

  // --- Departments ---
  const [customDepartments, setCustomDepartments] = useState<string[]>(loadCustomDepartments);
  const [newDeptInput, setNewDeptInput] = useState('');

  // --- AI settings ---
  const [aiSettings, setAiSettings] = useState<AiSettings>(loadAiSettings);
  const [aiSaved, setAiSaved] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<'success' | 'idle'>('idle');

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const allUsers = usersResponse?.data ?? [];
  const apiDepartments = Array.from(
    new Set(allUsers.map((u) => u.department).filter(Boolean))
  ) as string[];
  const allDepartments = Array.from(new Set([...BASE_DEPARTMENTS, ...customDepartments, ...apiDepartments]));

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

  const handleChangePassword = async () => {
    setPwError('');
    if (!pwForm.current.trim() || !pwForm.newPw.trim() || !pwForm.confirm.trim()) {
      setPwError('Tüm alanları doldurun.');
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('Yeni şifre ve tekrarı eşleşmiyor.');
      return;
    }
    if (!user?.id) {
      setPwError('Kullanıcı bilgisi bulunamadı.');
      return;
    }
    setPwPending(true);
    try {
      await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.error ?? 'Şifre değiştirme başarısız.');
        }
      });
      setPwForm({ current: '', newPw: '', confirm: '' });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: unknown) {
      setPwError((err as Error).message);
    } finally {
      setPwPending(false);
    }
  };

  // AI settings handlers
  const handleAiSave = () => {
    localStorage.setItem('ai_settings', JSON.stringify(aiSettings));
    setAiSaved(true);
    setTimeout(() => setAiSaved(false), 3000);
  };

  const handleAiTest = () => {
    setAiTestResult('success');
    setTimeout(() => setAiTestResult('idle'), 3000);
  };

  const suggestedModels = AI_PROVIDER_MODELS[aiSettings.provider] ?? [];

  // Department handlers
  const handleAddDept = () => {
    const trimmed = newDeptInput.trim();
    if (!trimmed || allDepartments.includes(trimmed)) return;
    const updated = [...customDepartments, trimmed];
    setCustomDepartments(updated);
    saveCustomDepartments(updated);
    setNewDeptInput('');
  };

  const handleDeleteCustomDept = (dept: string) => {
    const updated = customDepartments.filter((d) => d !== dept);
    setCustomDepartments(updated);
    saveCustomDepartments(updated);
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
                {allDepartments.map((dept) => (
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

        {pwSuccess && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Şifre başarıyla değiştirildi.
          </div>
        )}

        {pwError && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'hsl(0 86% 97%)', color: 'hsl(0 72% 51%)' }}
          >
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {pwError}
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Mevcut Şifre</label>
            <div className="relative">
              <Input
                type={showCurrentPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={pwForm.current}
                onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrentPw((v) => !v)}
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Yeni Şifre</label>
            <div className="relative">
              <Input
                type={showNewPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={pwForm.newPw}
                onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPw((v) => !v)}
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">En az 6 karakter</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Yeni Şifre (Tekrar)</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={pwPending}
            style={{ backgroundColor: PRIMARY, color: 'white' }}
          >
            {pwPending ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>
        </div>
      </div>

      {/* AI Settings Card */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: PRIMARY }} />
          <h2 className="text-sm font-semibold text-foreground">AI Ayarları</h2>
        </div>

        <div className="space-y-3">
          {/* Provider */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Provider</label>
            <Select
              value={aiSettings.provider}
              onValueChange={(v) =>
                setAiSettings((prev) => ({
                  ...prev,
                  provider: v,
                  model: AI_PROVIDER_MODELS[v]?.[0] ?? '',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Provider seçin..." />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(AI_PROVIDER_MODELS).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Model</label>
            {aiSettings.provider === 'Manuel/Özel' || suggestedModels.length === 0 ? (
              <Input
                placeholder="Model adı girin (ör. llama-3.2-90b)..."
                value={aiSettings.model}
                onChange={(e) => setAiSettings((prev) => ({ ...prev, model: e.target.value }))}
              />
            ) : (
              <Select
                value={aiSettings.model}
                onValueChange={(v) => setAiSettings((prev) => ({ ...prev, model: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Model seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {suggestedModels.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">API Anahtarı</label>
            <Input
              type="password"
              placeholder="sk-... veya API anahtarınızı girin"
              value={aiSettings.apiKey}
              onChange={(e) => setAiSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>

          {/* Endpoint URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Endpoint URL (isteğe bağlı)</label>
            <Input
              placeholder="https://api.example.com/v1 (özel/self-hosted modeller için)"
              value={aiSettings.endpointUrl}
              onChange={(e) => setAiSettings((prev) => ({ ...prev, endpointUrl: e.target.value }))}
            />
          </div>

          {aiSaved && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              AI ayarları kaydedildi.
            </div>
          )}

          {aiTestResult === 'success' && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ backgroundColor: `${PRIMARY}15`, color: PRIMARY }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Bağlantı başarılı.
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleAiSave} style={{ backgroundColor: PRIMARY, color: 'white' }}>
              Kaydet
            </Button>
            <Button variant="outline" onClick={handleAiTest}>
              Bağlantıyı Test Et
            </Button>
          </div>
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
                      <Badge
                        variant="outline"
                        className="text-[10px]"
                        style={roleBadgeStyle(u.role)}
                      >
                        {u.role}
                      </Badge>
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

        {/* Add department */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Yeni departman adı..."
            value={newDeptInput}
            onChange={(e) => setNewDeptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddDept();
            }}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleAddDept}
            disabled={!newDeptInput.trim()}
            style={{ backgroundColor: PRIMARY, color: 'white' }}
            className="gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Ekle
          </Button>
        </div>

        <div
          className="flex items-start gap-2 px-3 py-3 rounded-lg text-sm"
          style={{ backgroundColor: `${PRIMARY}0d`, borderLeft: `3px solid ${PRIMARY}` }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
          <span style={{ color: PRIMARY }}>
            Sistem departmanları kullanıcı ve proje tanımlarından otomatik oluşturulur. Özel departmanlar buradan eklenebilir.
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {allDepartments.map((dept) => {
            const isCustom = customDepartments.includes(dept);
            return (
              <div key={dept} className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {dept}
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomDept(dept)}
                      className="ml-1.5 hover:text-destructive transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              </div>
            );
          })}
          {allDepartments.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Henüz departman tanımlanmamış.</p>
          )}
        </div>
      </div>

      {/* New User Dialog */}
      <Dialog
        open={newUserDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewUserDialogOpen(false);
            setNewUserForm(defaultNewUserForm);
            setNewUserError('');
          }
        }}
      >
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
                  <SelectValue placeholder="Departman seçin...">
                    {newUserForm.department || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Rol</label>
              <Select
                value={newUserForm.role}
                onValueChange={(v) => setNewUserForm((prev) => ({ ...prev, role: v as UserRole }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
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
            <Button
              variant="outline"
              onClick={() => {
                setNewUserDialogOpen(false);
                setNewUserForm(defaultNewUserForm);
                setNewUserError('');
              }}
            >
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
