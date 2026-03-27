using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    AvatarUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Role = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false, defaultValue: "User"),
                    Department = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    ProjectManagerId = table.Column<int>(type: "INTEGER", nullable: false),
                    ContactId = table.Column<int>(type: "INTEGER", nullable: true),
                    DepartmentName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    PrivacyLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    IsBillable = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    IsTemplate = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ProjectEmail = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    CustomerEvaluation = table.Column<int>(type: "INTEGER", nullable: false),
                    EvaluationFrequency = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    SalesOrderId = table.Column<int>(type: "INTEGER", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Users_ProjectManagerId",
                        column: x => x.ProjectManagerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "CreatedBy", "Department", "Email", "FullName", "IsActive", "IsDeleted", "PasswordHash", "Role", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Yazılım", "buse.karapinar@pentahub.com", "Buse Karapınar", true, false, null, "ProjectManager", null, null },
                    { 2, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Satış", "can.atem@pentahub.com", "Can Atem", true, false, null, "ProjectManager", null, null },
                    { 3, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Yazılım", "osman.kaya@pentahub.com", "Osman Kaya", true, false, null, "User", null, null },
                    { 4, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "IT", "ali.akin@pentahub.com", "Ali Akın", true, false, null, "Admin", null, null },
                    { 5, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Pazarlama", "gizem.ciger@pentahub.com", "Gizem Çiğer", true, false, null, "ProjectManager", null, null }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "ContactId", "CreatedAt", "CreatedBy", "CustomerEvaluation", "DepartmentName", "Description", "EndDate", "EvaluationFrequency", "IsBillable", "IsDeleted", "Name", "PrivacyLevel", "ProjectEmail", "ProjectManagerId", "SalesOrderId", "StartDate", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Yazılım", "Acme firmasının dijital dönüşüm süreçlerinin yönetimi", new DateTime(2025, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "Acme Dijital Dönüşüm Projesi", 2, null, 1, null, new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null },
                    { 2, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Satış", "Müşteri ilişkileri yönetimi sistemi kurulumu", new DateTime(2025, 5, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "CRM İmplementasyon", 1, null, 2, null, new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null },
                    { 3, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Yazılım", "iOS ve Android platformları için mobil uygulama", new DateTime(2025, 9, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "Mobil Uygulama Geliştirme", 0, null, 1, null, new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null },
                    { 4, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "IT", "Mevcut ERP sistemi ile e-ticaret platformu entegrasyonu", new DateTime(2025, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "E-Ticaret Platform Entegrasyonu", 1, null, 5, null, new DateTime(2025, 1, 10, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "ContactId", "CreatedAt", "CreatedBy", "CustomerEvaluation", "DepartmentName", "Description", "EndDate", "EvaluationFrequency", "IsDeleted", "Name", "PrivacyLevel", "ProjectEmail", "ProjectManagerId", "SalesOrderId", "StartDate", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 5, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "İK", "Şirket içi eğitim ve sertifikasyon platformu", new DateTime(2025, 1, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "İç Eğitim Portalı", 1, null, 5, null, new DateTime(2024, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, null, null },
                    { 6, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "IT", "Legacy veri ambarının bulut tabanlı çözüme taşınması", new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Veri Ambarı Modernizasyonu", 0, null, 4, null, new DateTime(2025, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "ContactId", "CreatedAt", "CreatedBy", "CustomerEvaluation", "DepartmentName", "Description", "EndDate", "EvaluationFrequency", "IsBillable", "IsDeleted", "Name", "PrivacyLevel", "ProjectEmail", "ProjectManagerId", "SalesOrderId", "StartDate", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 7, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Yazılım", "Müşteri self-servis portalının yeniden tasarlanması", new DateTime(2025, 7, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "Müşteri Portalı Yenileme", 2, null, 2, null, new DateTime(2025, 3, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "ContactId", "CreatedAt", "CreatedBy", "CustomerEvaluation", "DepartmentName", "Description", "EndDate", "EvaluationFrequency", "IsDeleted", "Name", "PrivacyLevel", "ProjectEmail", "ProjectManagerId", "SalesOrderId", "StartDate", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 8, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Pazarlama", "Marketing automation araçlarının entegrasyonu ve kampanya yönetimi", new DateTime(2025, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Pazarlama Otomasyon Projesi", 1, null, 5, null, new DateTime(2025, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ContactId",
                table: "Projects",
                column: "ContactId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectManagerId",
                table: "Projects",
                column: "ProjectManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Status",
                table: "Projects",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
