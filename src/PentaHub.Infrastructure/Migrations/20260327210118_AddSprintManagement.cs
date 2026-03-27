using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSprintManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sprints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ProjectId = table.Column<int>(type: "INTEGER", nullable: false),
                    State = table.Column<int>(type: "INTEGER", nullable: false),
                    Goal = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sprints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sprints_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "SprintId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "SprintId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "SprintId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 4,
                column: "SprintId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 5,
                column: "SprintId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "SprintId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "SprintId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 8,
                column: "SprintId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 9,
                column: "SprintId",
                value: 2);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 10,
                column: "SprintId",
                value: 2);

            migrationBuilder.InsertData(
                table: "Sprints",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "EndDate", "Goal", "IsDeleted", "Name", "ProjectId", "StartDate", "State", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), "Temel altyapı kurulumu", false, "Mart Sprint I", 1, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), 2, null, null },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "CRM modül entegrasyonu", false, "Mart Sprint II", 1, new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2025, 2, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Test ve go-live hazırlığı", false, "Nisan Sprint I", 1, new DateTime(2025, 2, 16, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sprints_ProjectId",
                table: "Sprints",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Sprints_State",
                table: "Sprints",
                column: "State");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectTasks_Sprints_SprintId",
                table: "ProjectTasks",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectTasks_Sprints_SprintId",
                table: "ProjectTasks");

            migrationBuilder.DropTable(
                name: "Sprints");

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 1,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 2,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 3,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 4,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 5,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 6,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 7,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 8,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 9,
                column: "SprintId",
                value: null);

            migrationBuilder.UpdateData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 10,
                column: "SprintId",
                value: null);
        }
    }
}
