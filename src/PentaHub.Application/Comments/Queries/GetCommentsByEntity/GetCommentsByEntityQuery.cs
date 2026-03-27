using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Comments.Queries.GetCommentsByEntity;

public record GetCommentsByEntityQuery(string EntityType, int EntityId) : IRequest<List<CommentDto>>;
