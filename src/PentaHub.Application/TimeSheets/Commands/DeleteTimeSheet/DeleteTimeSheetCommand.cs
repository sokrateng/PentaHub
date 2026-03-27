using MediatR;

namespace PentaHub.Application.TimeSheets.Commands.DeleteTimeSheet;

public record DeleteTimeSheetCommand(int Id) : IRequest;
