import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { milestonesApi } from '@/services/api';
import type { Milestone } from '@/types';

const PRIMARY = 'hsl(153 60% 33%)';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface MilestoneRowProps {
  milestone: Milestone;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

function MilestoneRow({ milestone, onDelete, isDeleting }: MilestoneRowProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(milestone.name);
  const [editDate, setEditDate] = useState(
    milestone.targetDate ? milestone.targetDate.split('T')[0] : '',
  );

  const updateMutation = useMutation({
    mutationFn: () =>
      milestonesApi.update(milestone.id, {
        name: editName.trim() || milestone.name,
        targetDate: editDate || undefined,
        sortOrder: milestone.sortOrder,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', milestone.projectId] });
      setEditing(false);
    },
  });

  const handleSave = () => {
    if (!editName.trim()) return;
    updateMutation.mutate();
  };

  const handleCancel = () => {
    setEditName(milestone.name);
    setEditDate(milestone.targetDate ? milestone.targetDate.split('T')[0] : '');
    setEditing(false);
  };

  return (
    <tr className="group border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        {editing ? (
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Flag className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PRIMARY }} />
            <span className="font-medium text-foreground">{milestone.name}</span>
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <Input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="h-7 text-sm max-w-[140px]"
          />
        ) : (
          <span className="text-sm text-muted-foreground">{formatDate(milestone.targetDate)}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant="secondary" className="text-xs">
          {milestone.taskCount} görev
        </Badge>
      </td>
      <td className="px-4 py-3">
        {/* Progress bar — placeholder, calculated from taskCount in future */}
        <div className="w-full bg-muted rounded-full h-2 max-w-[120px]">
          <div
            className="h-2 rounded-full"
            style={{ width: '0%', backgroundColor: PRIMARY }}
          />
        </div>
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Kaydet"
            >
              <Check className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-muted-foreground"
              aria-label="İptal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Düzenle"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(milestone.id)}
              disabled={isDeleting}
              className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Sil"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

interface MilestonesTabProps {
  projectId: number;
}

export function MilestonesTab({ projectId }: MilestonesTabProps) {
  const queryClient = useQueryClient();
  const [addName, setAddName] = useState('');
  const [addDate, setAddDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: () => milestonesApi.getByProject(projectId),
    enabled: !!projectId,
  });

  const milestones = [...(response?.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  const addMutation = useMutation({
    mutationFn: () =>
      milestonesApi.create({
        name: addName.trim(),
        projectId,
        targetDate: addDate || undefined,
        sortOrder: milestones.length + 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      setAddName('');
      setAddDate('');
      setShowAddForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => milestonesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
  });

  const handleAdd = () => {
    if (!addName.trim()) return;
    addMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-5 space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4" style={{ color: PRIMARY }} />
          <span className="text-sm font-semibold text-foreground">Kilometre Taşları</span>
          {milestones.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {milestones.length}
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddForm((v) => !v)}
          className="gap-1.5 h-7 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Kilometre Taşı Ekle
        </Button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center gap-3">
          <Input
            placeholder="Kilometre taşı adı..."
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') {
                setShowAddForm(false);
                setAddName('');
                setAddDate('');
              }
            }}
            autoFocus
            className="flex-1 h-8 text-sm"
          />
          <Input
            type="date"
            value={addDate}
            onChange={(e) => setAddDate(e.target.value)}
            className="w-[160px] h-8 text-sm"
          />
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!addName.trim() || addMutation.isPending}
            style={{ backgroundColor: PRIMARY, color: 'white' }}
            className="h-8 px-3 text-xs flex-shrink-0"
          >
            {addMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              setAddName('');
              setAddDate('');
            }}
            className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Table */}
      {milestones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${PRIMARY}15` }}
          >
            <Flag className="w-4 h-4" style={{ color: PRIMARY }} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Henüz kilometre taşı yok</p>
          <p className="text-xs text-muted-foreground">
            Yukarıdaki butona tıklayarak ilk kilometre taşını ekleyin
          </p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                Faz Adı
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                Hedef Tarih
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                Görev Sayısı
              </th>
              <th className="text-left px-4 py-2.5 font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                İlerleme
              </th>
              <th className="px-4 py-2.5 w-20" />
            </tr>
          </thead>
          <tbody>
            {milestones.map((m) => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
