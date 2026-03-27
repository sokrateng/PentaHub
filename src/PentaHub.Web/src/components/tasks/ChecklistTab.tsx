import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckSquare, Square, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { checklistApi } from '@/services/api';

interface ChecklistTabProps {
  taskId: number;
}

export function ChecklistTab({ taskId }: ChecklistTabProps) {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['checklists', taskId],
    queryFn: () => checklistApi.getByTask(taskId),
    enabled: !!taskId,
  });

  const items = response?.data ?? [];
  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const addMutation = useMutation({
    mutationFn: (title: string) => checklistApi.add(taskId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', taskId] });
      setNewTitle('');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => checklistApi.toggle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => checklistApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', taskId] });
    },
  });

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewTitle('');
      inputRef.current?.blur();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-5 space-y-3 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-2 bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-muted rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-5 space-y-4">
      {/* Header + Progress */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4" style={{ color: 'hsl(153 60% 33%)' }} />
          <span className="text-sm font-semibold text-foreground">Kontrol Listesi</span>
        </div>
        {totalCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{totalCount}
          </Badge>
        )}
      </div>

      {totalCount > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>İlerleme</span>
            <span>%{progressPercent}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'hsl(153 60% 33%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Henüz madde yok. Aşağıdan ekleyin.
        </div>
      ) : (
        <ul className="space-y-2">
          {[...items]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 group px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleMutation.mutate(item.id)}
                  disabled={toggleMutation.isPending}
                  className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  aria-label={item.isCompleted ? 'Tamamlandı olarak işaretle' : 'Tamamlandı değil olarak işaretle'}
                >
                  {item.isCompleted ? (
                    <CheckSquare
                      className="w-5 h-5"
                      style={{ color: 'hsl(153 60% 33%)' }}
                    />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <span
                  className={[
                    'flex-1 text-sm leading-snug transition-colors',
                    item.isCompleted
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground',
                  ].join(' ')}
                >
                  {item.title}
                </span>

                {item.assigneeName && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 flex-shrink-0">
                    {item.assigneeName}
                  </Badge>
                )}

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Maddeyi sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
        </ul>
      )}

      {/* Add new item */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          placeholder="Madde ekle... (Enter ile kaydet)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={addMutation.isPending}
          className="flex-1 h-8 text-sm"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!newTitle.trim() || addMutation.isPending}
          className="h-8 px-3 text-xs"
          style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
        >
          {addMutation.isPending ? 'Ekleniyor...' : 'Ekle'}
        </Button>
      </div>
    </div>
  );
}
