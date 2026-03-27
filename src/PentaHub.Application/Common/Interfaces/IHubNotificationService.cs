using PentaHub.Application.DTOs;

namespace PentaHub.Application.Common.Interfaces;

public interface IHubNotificationService
{
    Task SendCommentAddedAsync(string entityType, int entityId, CommentDto comment, CancellationToken cancellationToken = default);
}
