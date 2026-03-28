import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { timeSheetsApi } from '@/services/api';
import type { CreateTimeSheetRequest } from '@/types';

const PRIMARY = 'hsl(153 60% 33%)';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

interface TimeSheetsTabProps {
  taskId: number;
  plannedHours: number;
  spentHours: number;
  remainingHours: number;
  currentUserId?: number;
}

export function TimeSheetsTab({
  taskId,
  plannedHours,
  spentHours,
  remainingHours,
  currentUserId = 1,
}: TimeSheetsTabProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    date: string;
    hours: string;
    description: string;
    isBillable: boolean;
  }>({
    date: todayIso(),
    hours: '1',
    description: '',
    isBillable: false,
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ['timesheets', taskId],
    queryFn: () => timeSheetsApi.getByTask(taskId),
    enabled: !!taskId,
  });

  const sheets = [...(response?.data ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const totalLoggedHours = sheets.reduce((sum, s) => sum + s.hours, 0);

  const addMutation = useMutation({
    mutationFn: (payload: CreateTimeSheetRequest) => timeSheetsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      setForm({ date: todayIso(), hours: '1', description: '', isBillable: false });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => timeSheetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });

  const handleAdd = () => {
    const hours = Number(form.hours);
    if (!form.date || !hours || hours <= 0) return;
    addMutation.mutate({
      userId: currentUserId,
      taskId,
      date: form.date,
      hours,
      description: form.description || undefined,
      isBillable: form.isBillable,
    });
  };

  const progressPercent = plannedHours > 0 ? Math.min(100, Math.round((spentHours / plannedHours) * 100)) : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-5 space-y-3 animate-pulse">
        <div className="h-16 bg-muted rounded" />
        {[1, 2].map((i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hours summary */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" style={{ color: PRIMARY }} />
          <span className="text-sm font-semibold text-foreground">Saat Özeti</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">{plannedHours}</p>
            <p className="text-xs text-muted-foreground">Planlanan</p>
          </div>
          <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${PRIMARY}10` }}>
            <p className="text-lg font-bold" style={{ color: PRIMARY }}>
              {spentHours}
            </p>
            <p className="text-xs text-muted-foreground">Harcanan</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">{remainingHours}</p>
            <p className="text-xs text-muted-foreground">Kalan</p>
          </div>
        </div>

        {plannedHours > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>İlerleme</span>
              <span>%{progressPercent}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%`, backgroundColor: PRIMARY }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add time sheet form */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4" style={{ color: PRIMARY }} />
          <span className="text-sm font-semibold text-foreground">Süre Ekle</span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Tarih</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Saat</label>
              <Input
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={form.hours}
                onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Açıklama</label>
            <Input
              placeholder="Ne yaptınız?"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isBillable}
                onChange={(e) => setForm((p) => ({ ...p, isBillable: e.target.checked }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium">Faturalanabilir</span>
            </label>

            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!form.date || !Number(form.hours) || addMutation.isPending}
              style={{ backgroundColor: PRIMARY, color: 'white' }}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Plus className="w-3 h-3" />
              {addMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sheets list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Geçmiş Girişler</span>
            {sheets.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {sheets.length}
              </Badge>
            )}
          </div>
          {totalLoggedHours > 0 && (
            <span className="text-xs text-muted-foreground">
              Toplam:{' '}
              <strong className="text-foreground">{totalLoggedHours} saat</strong>
            </span>
          )}
        </div>

        {sheets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Henüz süre kaydedilmemiş</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {sheets.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-muted/20 transition-colors">
                <div className="flex-shrink-0 text-center min-w-[52px]">
                  <p className="text-sm font-bold text-foreground">{s.hours}s</p>
                  <p className="text-xs text-muted-foreground">{formatDate(s.date)}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {s.userName}
                  </p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                  )}
                </div>

                {s.isBillable && (
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    Fatura
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(s.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Girişi sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
