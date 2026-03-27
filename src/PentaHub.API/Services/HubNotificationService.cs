using Microsoft.AspNetCore.SignalR;
using PentaHub.API.Hubs;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.API.Services;

public class HubNotificationService : IHubNotificationService
{
    private readonly IHubContext<CollaborationHub> _hubContext;

    public HubNotificationService(IHubContext<CollaborationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendCommentAddedAsync(string entityType, int entityId, CommentDto comment, CancellationToken cancellationToken = default)
    {
        var groupName = $"{entityType}_{entityId}";
        await _hubContext.Clients.Group(groupName).SendAsync("CommentAdded", comment, cancellationToken);
    }
}
