using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDemoUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "CreatedBy", "Department", "Email", "FullName", "IsActive", "IsDeleted", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "Role", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 7, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Yazılım", "demo@pentahub.com", "Demo User", true, false, "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02", null, null, "User", null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 7);
        }
    }
}
