using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedUserPasswords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "PasswordHash",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "PasswordHash",
                value: null);
        }
    }
}
