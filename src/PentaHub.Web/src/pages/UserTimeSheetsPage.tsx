import { useState, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Clock, AlertCircle, DollarSign, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { timeSheetsApi, usersApi } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import type { TimeSheet } from '@/types';
import { formatDate } from '@/lib/utils';
import { PRIMARY_COLOR as PRIMARY } from '@/lib/constants';

function getMonthRange(offset = 0): { startDate: string; endDate: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + offset;
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    startDate: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    endDate: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`,
  };
}

function getWeekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { startDate: fmt(monday), endDate: fmt(sunday) };
}

type GroupBy = 'date' | 'task';

interface GroupedEntry {
  key: string;
  label: string;
  entries: TimeSheet[];
  totalHours: number;
}

function groupEntries(timesheets: TimeSheet[], groupBy: GroupBy): GroupedEntry[] {
  const map = new Map<string, TimeSheet[]>();

  for (const ts of timesheets) {
    const key = groupBy === 'date' ? ts.date : String(ts.taskId);
    const arr = map.get(key) ?? [];
    arr.push(ts);
    map.set(key, arr);
  }

  const result: GroupedEntry[] = [];
  map.forEach((entries, key) => {
    const label =
      groupBy === 'date'
        ? formatDate(key, 'numeric')
        : entries[0]?.taskTitle ?? key;
    result.push({
      key,
      label,
      entries,
      totalHours: entries.reduce((s, e) => s + e.hours, 0),
    });
  });

  // Sort groups
  result.sort((a, b) => {
    if (groupBy === 'date') return b.key.localeCompare(a.key);
    return a.label.localeCompare(b.label);
  });

  return result;
}

export function UserTimeSheetsPage() {
  const loggedInUser = useAuthStore((s) => s.user);

  const [selectedUserId, setSelectedUserId] = useState<string>(
    loggedInUser ? String(loggedInUser.id) : '',
  );
  const [startDate, setStartDate] = useState<string>(getMonthRange(0).startDate);
  const [endDate, setEndDate] = useState<string>(getMonthRange(0).endDate);
  const [groupBy, setGroupBy] = useState<GroupBy>('date');

  const { data: usersResponse } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });

  const isAllUsers = selectedUserId === 'all';

  const { data: timeSheetsResponse, isLoading: isSingleLoading } = useQuery({
    queryKey: ['user-timesheets', selectedUserId, startDate, endDate],
    queryFn: () => timeSheetsApi.getByUser(Number(selectedUserId), startDate, endDate),
    enabled: !!selectedUserId && !isAllUsers,
  });

  const users = usersResponse?.data ?? [];

  const allUserQueries = useQueries({
    queries: isAllUsers
      ? users.map((u) => ({
          queryKey: ['user-timesheets', String(u.id), startDate, endDate],
          queryFn: () => timeSheetsApi.getByUser(u.id, startDate, endDate),
        }))
      : [],
  });

  const isAllLoading = isAllUsers && allUserQueries.some((q) => q.isLoading);
  const isLoading = isAllUsers ? isAllLoading : isSingleLoading;

  const timesheets: TimeSheet[] = useMemo(() => {
    if (isAllUsers) {
      return allUserQueries.flatMap((q) => q.data?.data ?? []);
    }
    return timeSheetsResponse?.data ?? [];
  }, [isAllUsers, allUserQueries, timeSheetsResponse]);

  const totalHours = useMemo(
    () => timesheets.reduce((s, t) => s + t.hours, 0),
    [timesheets],
  );
  const billableHours = useMemo(
    () => timesheets.filter((t) => t.isBillable).reduce((s, t) => s + t.hours, 0),
    [timesheets],
  );

  const grouped = useMemo(() => groupEntries(timesheets, groupBy), [timesheets, groupBy]);

  function applyQuickFilter(preset: 'week' | 'month' | 'lastMonth') {
    if (preset === 'week') {
      const range = getWeekRange();
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    } else if (preset === 'month') {
      const range = getMonthRange(0);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    } else {
      const range = getMonthRange(-1);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <Clock className="w-5 h-5" style={{ color: PRIMARY }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Zaman Çizelgesi</h1>
          <p className="text-sm text-muted-foreground">Kullanıcı bazlı saat kayıtlarını görüntüleyin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* User selector */}
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-sm font-medium">Kullanıcı</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Kullanıcı seçin...">
                  {selectedUserId === 'all'
                    ? 'Tüm Kullanıcılar'
                    : selectedUserId
                    ? users.find((u) => String(u.id) === selectedUserId)?.fullName ?? 'Kullanıcı seçin...'
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Başlangıç</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Bitiş</label>
            <Input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>

          {/* Group by toggle */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Grupla</label>
            <div className="flex rounded-md border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setGroupBy('date')}
                className="px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
                style={
                  groupBy === 'date'
                    ? { backgroundColor: PRIMARY, color: 'white' }
                    : { backgroundColor: 'transparent', color: 'hsl(215 16% 47%)' }
                }
              >
                Tarihe Göre
              </button>
              <button
                type="button"
                onClick={() => setGroupBy('task')}
                className="px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none border-l border-border"
                style={
                  groupBy === 'task'
                    ? { backgroundColor: PRIMARY, color: 'white' }
                    : { backgroundColor: 'transparent', color: 'hsl(215 16% 47%)' }
                }
              >
                Göreve Göre
              </button>
            </div>
          </div>
        </div>

        {/* Quick filter buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Hızlı filtre:</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => applyQuickFilter('week')}
          >
            Bu hafta
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => applyQuickFilter('month')}
          >
            Bu ay
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => applyQuickFilter('lastMonth')}
          >
            Geçen ay
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {(selectedUserId) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <Clock className="w-5 h-5" style={{ color: PRIMARY }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalHours.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Toplam Saat</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'hsl(43 96% 56% / 0.12)' }}
            >
              <DollarSign className="w-5 h-5" style={{ color: 'hsl(43 96% 40%)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{billableHours.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Faturalabilir Saat</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {selectedUserId && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          ) : timesheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${PRIMARY}15` }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: PRIMARY }} />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">Kayıt bulunamadı</p>
              <p className="text-xs text-muted-foreground">
                Seçilen tarih aralığında zaman kaydı yok
              </p>
            </div>
          ) : (
            <div>
              {grouped.map((group) => (
                <div key={group.key}>
                  {/* Group header */}
                  <div
                    className="flex items-center justify-between px-4 py-2.5 border-b border-border"
                    style={{ backgroundColor: `${PRIMARY}08` }}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
                      <span className="text-sm font-semibold" style={{ color: PRIMARY }}>
                        {group.label}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {group.totalHours.toFixed(1)} saat
                    </span>
                  </div>

                  {/* Entries table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        {isAllUsers && (
                          <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                            Kullanıcı
                          </th>
                        )}
                        {groupBy === 'task' && (
                          <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                            Tarih
                          </th>
                        )}
                        {groupBy === 'date' && (
                          <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                            Görev
                          </th>
                        )}
                        <th className="text-right px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          Saat
                        </th>
                        <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          Açıklama
                        </th>
                        <th className="text-center px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          Fatura
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.map((ts, idx) => (
                        <tr
                          key={ts.id}
                          className={[
                            'border-b border-border last:border-0 hover:bg-muted/20 transition-colors',
                            idx % 2 === 0 ? '' : 'bg-muted/10',
                          ].join(' ')}
                        >
                          {isAllUsers && (
                            <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                              {ts.userName}
                            </td>
                          )}
                          {groupBy === 'task' && (
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {formatDate(ts.date, 'numeric')}
                            </td>
                          )}
                          {groupBy === 'date' && (
                            <td className="px-4 py-3">
                              <span className="font-medium text-foreground">{ts.taskTitle}</span>
                            </td>
                          )}
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-foreground tabular-nums">
                              {ts.hours.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">s</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[280px]">
                            <span className="truncate block text-xs">
                              {ts.description ?? '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {ts.isBillable ? (
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                  color: 'hsl(43 96% 40%)',
                                  borderColor: 'hsl(43 96% 40% / 0.4)',
                                  backgroundColor: 'hsl(43 96% 56% / 0.1)',
                                }}
                              >
                                Faturalabilir
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                İç
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prompt when no user selected */}
      {!selectedUserId && selectedUserId !== 'all' && (
        <div className="bg-white rounded-xl border border-border p-16 flex flex-col items-center justify-center text-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <Clock className="w-6 h-6" style={{ color: PRIMARY }} />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">Kullanıcı Seçin</h3>
          <p className="text-sm text-muted-foreground">
            Zaman kayıtlarını görüntülemek için yukarıdan bir kullanıcı seçin
          </p>
        </div>
      )}
    </div>
  );
}
