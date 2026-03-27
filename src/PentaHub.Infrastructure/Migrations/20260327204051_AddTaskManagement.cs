using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TaskStages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsDefault = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsClosedStage = table.Column<bool>(type: "INTEGER", nullable: false),
                    ShowInKanban = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskStages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskStages_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectTasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TaskNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    StageId = table.Column<int>(type: "INTEGER", nullable: false),
                    AssigneeId = table.Column<int>(type: "INTEGER", nullable: true),
                    SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    MilestoneId = table.Column<int>(type: "INTEGER", nullable: true),
                    ParentTaskId = table.Column<int>(type: "INTEGER", nullable: true),
                    Priority = table.Column<int>(type: "INTEGER", nullable: false),
                    IsBillable = table.Column<bool>(type: "INTEGER", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DueDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    BusinessDaysOnly = table.Column<bool>(type: "INTEGER", nullable: false),
                    PlannedHours = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    SpentHours = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    RemainingHours = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    ProgressPercent = table.Column<int>(type: "INTEGER", nullable: false),
                    Tags = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_ProjectTasks_ParentTaskId",
                        column: x => x.ParentTaskId,
                        principalTable: "ProjectTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_TaskStages_StageId",
                        column: x => x.StageId,
                        principalTable: "TaskStages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectTasks_Users_AssigneeId",
                        column: x => x.AssigneeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "TaskStages",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "IsClosedStage", "IsDefault", "IsDeleted", "Name", "ProjectId", "ShowInKanban", "SortOrder", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 1, true, 1, null, null },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 1, true, 2, null, null },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 1, true, 3, null, null },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 1, true, 4, null, null },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 1, true, 5, null, null },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 2, true, 1, null, null },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 2, true, 2, null, null },
                    { 8, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 2, true, 3, null, null },
                    { 9, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 2, true, 4, null, null },
                    { 10, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 2, true, 5, null, null },
                    { 11, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 3, true, 1, null, null },
                    { 12, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 3, true, 2, null, null },
                    { 13, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 3, true, 3, null, null },
                    { 14, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 3, true, 4, null, null },
                    { 15, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 3, true, 5, null, null },
                    { 16, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 4, true, 1, null, null },
                    { 17, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 4, true, 2, null, null },
                    { 18, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 4, true, 3, null, null },
                    { 19, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 4, true, 4, null, null },
                    { 20, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 4, true, 5, null, null },
                    { 21, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 5, true, 1, null, null },
                    { 22, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 5, true, 2, null, null },
                    { 23, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 5, true, 3, null, null },
                    { 24, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 5, true, 4, null, null },
                    { 25, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 5, true, 5, null, null },
                    { 26, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 6, true, 1, null, null },
                    { 27, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 6, true, 2, null, null },
                    { 28, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 6, true, 3, null, null },
                    { 29, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 6, true, 4, null, null },
                    { 30, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 6, true, 5, null, null },
                    { 31, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 7, true, 1, null, null },
                    { 32, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 7, true, 2, null, null },
                    { 33, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 7, true, 3, null, null },
                    { 34, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 7, true, 4, null, null },
                    { 35, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 7, true, 5, null, null },
                    { 36, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 8, true, 1, null, null },
                    { 37, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 8, true, 2, null, null },
                    { 38, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 8, true, 3, null, null },
                    { 39, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 8, true, 4, null, null },
                    { 40, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 8, true, 5, null, null }
                });

            migrationBuilder.InsertData(
                table: "ProjectTasks",
                columns: new[] { "Id", "AssigneeId", "BusinessDaysOnly", "CreatedAt", "CreatedBy", "Description", "DueDate", "IsBillable", "IsDeleted", "MilestoneId", "ParentTaskId", "PlannedHours", "Priority", "ProgressPercent", "ProjectId", "RemainingHours", "SortOrder", "SpentHours", "SprintId", "StageId", "StartDate", "Tags", "TaskNumber", "Title", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, 1, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 16m, 3, 0, 1, 16m, 1, 0m, null, 1, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0001", "CRM Modülünün Konfigürasyonu", null, null },
                    { 2, 2, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 8m, 2, 0, 1, 8m, 2, 0m, null, 1, new DateTime(2025, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0002", "Kullanıcı Rol ve Yetkileri Tanımlama", null, null },
                    { 3, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 24m, 4, 0, 1, 24m, 3, 0m, null, 1, new DateTime(2025, 1, 25, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0003", "Veri Migrasyon Planı", null, null },
                    { 4, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 40m, 3, 20, 1, 32m, 1, 8m, null, 2, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0004", "API Entegrasyon Geliştirme", null, null },
                    { 5, 5, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), false, false, null, null, 20m, 2, 20, 1, 16m, 2, 4m, null, 2, new DateTime(2025, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0005", "UI/UX Tasarım Revizyonu", null, null },
                    { 6, 1, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 16m, 4, 38, 1, 10m, 3, 6m, null, 2, new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0006", "Güvenlik Denetimi", null, null },
                    { 7, 2, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 24m, 2, 50, 1, 12m, 1, 12m, null, 3, new DateTime(2025, 2, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0007", "Performans Testleri", null, null },
                    { 8, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 3, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 32m, 3, 50, 1, 16m, 2, 16m, null, 3, new DateTime(2025, 2, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0008", "Raporlama Modülü", null, null },
                    { 9, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), false, false, null, null, 48m, 1, 42, 1, 28m, 3, 20m, null, 3, new DateTime(2025, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0009", "Mobil Arayüz Geliştirme", null, null },
                    { 10, 5, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 16m, 2, 63, 1, 6m, 4, 10m, null, 3, new DateTime(2025, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0010", "Veritabanı Optimizasyonu", null, null },
                    { 11, 1, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 3, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 20m, 3, 80, 1, 4m, 1, 16m, null, 4, new DateTime(2025, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0011", "Entegrasyon Testleri", null, null },
                    { 12, 2, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 3, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, false, null, null, 16m, 3, 75, 1, 4m, 2, 12m, null, 4, new DateTime(2025, 3, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0012", "Kullanıcı Kabul Testleri", null, null },
                    { 13, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, false, null, null, 12m, 4, 67, 1, 4m, 3, 8m, null, 4, new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0013", "Go-Live Planlaması", null, null },
                    { 14, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, false, null, null, 12m, 1, 100, 1, 0m, 1, 12m, null, 5, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0014", "Eğitim Materyalleri Hazırlama", null, null },
                    { 15, 5, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), false, false, null, null, 8m, 0, 100, 1, 0m, 2, 8m, null, 5, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "T0015", "Dokümantasyon", null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_AssigneeId",
                table: "ProjectTasks",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ParentTaskId",
                table: "ProjectTasks",
                column: "ParentTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_ProjectId",
                table: "ProjectTasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_SprintId",
                table: "ProjectTasks",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_StageId",
                table: "ProjectTasks",
                column: "StageId");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_TaskNumber",
                table: "ProjectTasks",
                column: "TaskNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskStages_ProjectId",
                table: "TaskStages",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "TaskStages");
        }
    }
}
