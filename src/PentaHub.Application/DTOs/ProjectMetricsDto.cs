namespace PentaHub.Application.DTOs;

public class ProjectMetricsDto
{
    public int DocumentCount { get; set; }      // Comments of type Note + Email for this project
    public int TaskCount { get; set; }           // Total tasks in project
    public int MeetingCount { get; set; }        // Comments of type Meeting
    public decimal TotalHours { get; set; }      // Sum of timesheet hours for project tasks
    public int ActiveTaskCount { get; set; }     // Tasks NOT in a closed stage (IsClosedStage=false)
    public int RiskCount { get; set; }           // Overdue tasks + Critical priority tasks not in closed stage
    public int ResourceCount { get; set; }       // Unique users in ResourceAllocations for this project
    public int CompletedTaskCount { get; set; }  // Tasks in closed stages
    public decimal BillableHours { get; set; }   // Sum of billable timesheet hours
    public int OverdueTaskCount { get; set; }    // Tasks past due date, not completed
    public int MilestoneCount { get; set; }      // Total milestones
    public int SprintCount { get; set; }         // Total sprints
}
