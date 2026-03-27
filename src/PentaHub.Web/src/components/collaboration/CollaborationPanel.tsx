import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Trash2, Mail, FileText, Calendar, Monitor } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { commentsApi } from '@/services/api';
import { CommentType } from '@/types';
import type { Comment } from '@/types';

type FilterType = 'Tümü' | 'Notlar' | 'E-postalar' | 'Sistem';

const FILTER_TABS: FilterType[] = ['Tümü', 'Notlar', 'E-postalar', 'Sistem'];

const COMMENT_TYPE_OPTIONS = [
  { value: CommentType.Note, label: 'Not' },
  { value: CommentType.Email, label: 'E-posta' },
  { value: CommentType.Meeting, label: 'Toplantı' },
];

const COMMENT_TYPE_BADGE: Record<
  CommentType,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  [CommentType.Note]: { label: 'Not', color: 'bg-gray-100 text-gray-600', icon: FileText },
  [CommentType.Email]: { label: 'E-posta', color: 'bg-blue-50 text-blue-600', icon: Mail },
  [CommentType.SystemLog]: { label: 'Sistem', color: 'bg-amber-50 text-amber-600', icon: Monitor },
  [CommentType.Meeting]: { label: 'Toplantı', color: 'bg-purple-50 text-purple-600', icon: Calendar },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'hsl(153 60% 33%)',
    'hsl(210 80% 45%)',
    'hsl(280 60% 45%)',
    'hsl(30 80% 45%)',
    'hsl(350 60% 45%)',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dakika önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function filterComments(comments: Comment[], filter: FilterType): Comment[] {
  if (filter === 'Tümü') return comments;
  if (filter === 'Notlar') return comments.filter((c) => c.commentType === CommentType.Note);
  if (filter === 'E-postalar') return comments.filter((c) => c.commentType === CommentType.Email);
  if (filter === 'Sistem')
    return comments.filter(
      (c) => c.commentType === CommentType.SystemLog || c.commentType === CommentType.Meeting
    );
  return comments;
}

interface CollaborationPanelProps {
  entityType: 'Project' | 'Task' | 'Contact';
  entityId: number;
}

export function CollaborationPanel({ entityType, entityId }: CollaborationPanelProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('Tümü');
  const [newContent, setNewContent] = useState('');
  const [commentType, setCommentType] = useState<CommentType>(CommentType.Note);

  const { data: commentsResponse } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: () => commentsApi.getByEntity(entityType, entityId),
    enabled: !!entityId,
  });

  const comments: Comment[] = commentsResponse?.data ?? [];
  const filtered = filterComments(comments, filter);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const addMutation = useMutation({
    mutationFn: () =>
      commentsApi.add({
        entityType,
        entityId,
        content: newContent.trim(),
        commentType,
        isInternal: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
      setNewContent('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => commentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', entityType, entityId] });
    },
  });

  const handleSend = () => {
    if (!newContent.trim()) return;
    addMutation.mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  return (
    <div
      className="w-[340px] flex-shrink-0 bg-white border-l border-border flex flex-col -mr-6 -mt-5 -mb-6"
      style={{ marginRight: '-1.5rem', marginTop: '-1.25rem', marginBottom: '-1.5rem' }}
    >
      {/* Panel header */}
      <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Kolaborasyon</span>
        </div>
        <Badge variant="secondary" className="text-xs px-2 py-0.5">
          {comments.length} mesaj
        </Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-border px-2 pt-2 gap-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={[
              'px-3 py-1.5 text-xs font-medium rounded-t transition-colors whitespace-nowrap',
              filter === tab
                ? 'border-b-2 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
            style={filter === tab ? { borderBottomColor: 'hsl(153 60% 33%)', color: 'hsl(153 60% 33%)' } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: 'hsl(153 60% 33% / 0.08)' }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: 'hsl(153 60% 33%)' }} />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Henüz mesaj yok</p>
            <p className="text-xs text-muted-foreground">
              {entityType === 'Project'
                ? 'Proje'
                : entityType === 'Task'
                  ? 'Görev'
                  : 'Kontak'}{' '}
              hakkında mesaj göndermek için aşağıdaki alanı kullanın
            </p>
          </div>
        ) : (
          sorted.map((comment) => {
            const typeConfig = COMMENT_TYPE_BADGE[comment.commentType] ?? COMMENT_TYPE_BADGE[CommentType.Note];
            const TypeIcon = typeConfig.icon;
            return (
              <div
                key={comment.id}
                className="group relative bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: getAvatarColor(comment.authorName) }}
                  >
                    {getInitials(comment.authorName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {comment.authorName}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${typeConfig.color}`}
                      >
                        <TypeIcon className="w-2.5 h-2.5" />
                        {typeConfig.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={() => deleteMutation.mutate(comment.id)}
                    disabled={deleteMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    aria-label="Sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {/* Content */}
                <div
                  className="text-xs text-foreground leading-relaxed pl-9"
                  dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Input area */}
      <div className="px-3 py-3 border-t border-border space-y-2">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesaj yazın... (Ctrl+Enter ile gönder)"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        <div className="flex items-center gap-2">
          <Select
            value={String(commentType)}
            onValueChange={(v) => setCommentType(Number(v) as CommentType)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMENT_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSend}
            disabled={!newContent.trim() || addMutation.isPending}
            className="h-8 px-3 gap-1.5 text-xs flex-shrink-0"
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          >
            <Send className="w-3 h-3" />
            Gönder
          </Button>
        </div>
      </div>
    </div>
  );
}
