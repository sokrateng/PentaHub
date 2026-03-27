using PentaHub.Domain.Enums;

namespace PentaHub.Application.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public int AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? AuthorAvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public CommentType CommentType { get; set; }
    public string CommentTypeText => CommentType switch
    {
        CommentType.Note => "Not",
        CommentType.Email => "E-posta",
        CommentType.SystemLog => "Sistem Logu",
        CommentType.Meeting => "Toplantı",
        _ => CommentType.ToString()
    };
    public bool IsInternal { get; set; }
    public DateTime CreatedAt { get; set; }
}
