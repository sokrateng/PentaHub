using Microsoft.AspNetCore.SignalR;

namespace PentaHub.API.Hubs;

public class CollaborationHub : Hub
{
    public async System.Threading.Tasks.Task JoinEntity(string entityType, int entityId)
    {
        var groupName = $"{entityType}_{entityId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async System.Threading.Tasks.Task LeaveEntity(string entityType, int entityId)
    {
        var groupName = $"{entityType}_{entityId}";
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}
