using PentaHub.Domain.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Entities;

public class Comment : BaseEntity
{
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public int AuthorId { get; set; }
    public string Content { get; set; } = string.Empty;
    public CommentType CommentType { get; set; } = CommentType.Note;
    public bool IsInternal { get; set; } = true;

    // Navigation
    public User Author { get; set; } = null!;
}
