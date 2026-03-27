import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) return;
    try {
      await register(fullName.trim(), email.trim(), password, department.trim() || undefined);
      navigate('/', { replace: true });
    } catch {
      // error is set in store
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'hsl(220 25% 11%)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'hsl(153 60% 33%)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-8 blur-3xl"
          style={{ backgroundColor: 'hsl(210 80% 45%)' }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl border p-8 shadow-2xl"
        style={{
          backgroundColor: 'hsl(220 25% 16%)',
          borderColor: 'hsl(220 20% 24%)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg"
            style={{ backgroundColor: 'hsl(153 60% 33%)' }}
          >
            P
          </div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: 'hsl(210 40% 95%)' }}
          >
            PentaHub
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(210 40% 55%)' }}>
            Yeni hesap oluşturun
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="rounded-lg px-3.5 py-2.5 text-sm border"
              style={{
                backgroundColor: 'hsl(350 60% 20%)',
                borderColor: 'hsl(350 60% 30%)',
                color: 'hsl(350 80% 70%)',
              }}
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-medium"
              style={{ color: 'hsl(210 40% 70%)' }}
            >
              Ad Soyad
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ahmet Yılmaz"
              autoComplete="name"
              required
              className="h-10 text-sm"
              style={{
                backgroundColor: 'hsl(220 25% 20%)',
                borderColor: 'hsl(220 20% 30%)',
                color: 'hsl(210 40% 90%)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium"
              style={{ color: 'hsl(210 40% 70%)' }}
            >
              E-posta
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@sirket.com"
              autoComplete="email"
              required
              className="h-10 text-sm"
              style={{
                backgroundColor: 'hsl(220 25% 20%)',
                borderColor: 'hsl(220 20% 30%)',
                color: 'hsl(210 40% 90%)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="department"
              className="text-xs font-medium"
              style={{ color: 'hsl(210 40% 70%)' }}
            >
              Departman{' '}
              <span style={{ color: 'hsl(210 40% 45%)' }}>(isteğe bağlı)</span>
            </Label>
            <Input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Yazılım Geliştirme"
              className="h-10 text-sm"
              style={{
                backgroundColor: 'hsl(220 25% 20%)',
                borderColor: 'hsl(220 20% 30%)',
                color: 'hsl(210 40% 90%)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium"
              style={{ color: 'hsl(210 40% 70%)' }}
            >
              Şifre
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="h-10 text-sm pr-10"
                style={{
                  backgroundColor: 'hsl(220 25% 20%)',
                  borderColor: 'hsl(220 20% 30%)',
                  color: 'hsl(210 40% 90%)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus-visible:outline-none"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" style={{ color: 'hsl(210 40% 55%)' }} />
                ) : (
                  <Eye className="w-4 h-4" style={{ color: 'hsl(210 40% 55%)' }} />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !fullName.trim() || !email.trim() || !password.trim()}
            className="w-full h-10 gap-2 text-sm font-medium mt-2"
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kaydediliyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Kayıt Ol
              </span>
            )}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-xs mt-6" style={{ color: 'hsl(210 40% 55%)' }}>
          Zaten hesabınız var mı?{' '}
          <Link
            to="/login"
            className="font-medium transition-colors hover:underline"
            style={{ color: 'hsl(153 60% 48%)' }}
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
