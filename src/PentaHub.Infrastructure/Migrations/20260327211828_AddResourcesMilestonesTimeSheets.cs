using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddResourcesMilestonesTimeSheets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Milestones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    TargetDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Milestones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Milestones_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResourceAllocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    TaskId = table.Column<int>(type: "INTEGER", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    HoursPerDay = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    TotalHours = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceAllocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResourceAllocations_ProjectTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ResourceAllocations_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResourceAllocations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TimeSheets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    TaskId = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Hours = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    IsBillable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSheets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeSheets_ProjectTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TimeSheets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Milestones",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "IsDeleted", "Name", "ProjectId", "SortOrder", "TargetDate", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 1 - Altyapı", 1, 1, new DateTime(2025, 2, 28, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 2 - Geliştirme", 1, 2, new DateTime(2025, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 3 - Test", 1, 3, new DateTime(2025, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 4 - Go-Live", 1, 4, new DateTime(2025, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, null }
                });

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "MilestoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "MilestoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "MilestoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 4,
                column: "MilestoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 5,
                column: "MilestoneId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "MilestoneId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "MilestoneId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 8,
                column: "MilestoneId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 9,
                column: "MilestoneId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 10,
                column: "MilestoneId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 11,
                column: "MilestoneId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 12,
                column: "MilestoneId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 13,
                column: "MilestoneId",
                value: 4);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 14,
                column: "MilestoneId",
                value: 4);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 15,
                column: "MilestoneId",
                value: 4);

            migrationBuilder.InsertData(
                table: "ResourceAllocations",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "EndDate", "HoursPerDay", "IsDeleted", "Notes", "ProjectId", "StartDate", "TaskId", "TotalHours", "UpdatedAt", "UpdatedBy", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 3, 31, 0, 0, 0, 0, DateTimeKind.Utc), 6m, false, "Proje Yöneticisi tam zamanlı tahsis", 1, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, 264m, null, null, 1 },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), 8m, false, "Backend geliştirici tam zamanlı", 1, new DateTime(2025, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, 480m, null, null, 2 },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), 4m, false, "Kıdemli geliştirici yarı zamanlı", 1, new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 320m, null, null, 3 },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), 5m, false, "IT uzmanı proje süresince", 1, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, 550m, null, null, 4 },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), 7m, false, "Pazarlama & test uzmanı", 1, new DateTime(2025, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 560m, null, null, 5 }
                });

            migrationBuilder.InsertData(
                table: "TimeSheets",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Date", "Description", "Hours", "IsBillable", "IsDeleted", "TaskId", "UpdatedAt", "UpdatedBy", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), "API tasarım toplantısı ve dokümantasyon", 4m, true, false, 4, null, null, 1 },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 1, 21, 0, 0, 0, 0, DateTimeKind.Utc), "API endpoint geliştirme", 4m, true, false, 4, null, null, 1 },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Yük testi senaryoları hazırlama", 6m, true, false, 7, null, null, 2 },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Yük testi çalıştırma ve analiz", 6m, true, false, 7, null, null, 2 },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Raporlama modülü mimari tasarım", 8m, true, false, 8, null, null, 3 },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 11, 0, 0, 0, 0, DateTimeKind.Utc), "Raporlama bileşenleri geliştirme", 8m, true, false, 8, null, null, 3 },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 1, 22, 0, 0, 0, 0, DateTimeKind.Utc), "UI mockup hazırlama", 4m, false, false, 5, null, null, 5 },
                    { 8, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Mobil ekranlar geliştirme", 8m, false, false, 9, null, null, 4 },
                    { 9, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 22, 0, 0, 0, 0, DateTimeKind.Utc), "Sorgu optimizasyonu", 5m, true, false, 10, null, null, 5 },
                    { 10, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Güvenlik açığı tarama ve raporlama", 6m, true, false, 6, null, null, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTasks_MilestoneId",
                table: "ProjectTasks",
                column: "MilestoneId");

            migrationBuilder.CreateIndex(
                name: "IX_Milestones_ProjectId",
                table: "Milestones",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Milestones_ProjectId_SortOrder",
                table: "Milestones",
                columns: new[] { "ProjectId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ResourceAllocations_ProjectId",
                table: "ResourceAllocations",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_ResourceAllocations_TaskId",
                table: "ResourceAllocations",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_ResourceAllocations_UserId",
                table: "ResourceAllocations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSheets_Date",
                table: "TimeSheets",
                column: "Date");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSheets_TaskId",
                table: "TimeSheets",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSheets_UserId",
                table: "TimeSheets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_Milestones_MilestoneId",
                table: "ProjectTasks",
                column: "MilestoneId",
                principalTable: "Milestones",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_Milestones_MilestoneId",
                table: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "Milestones");

            migrationBuilder.DropTable(
                name: "ResourceAllocations");

            migrationBuilder.DropTable(
                name: "TimeSheets");

            migrationBuilder.DropIndex(
                name: "IX_ProjectTasks_MilestoneId",
                table: "ProjectTasks");

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 4,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 5,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 8,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 9,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 10,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 11,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 12,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 13,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 14,
                column: "MilestoneId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 15,
                column: "MilestoneId",
                value: null);
        }
    }
}
