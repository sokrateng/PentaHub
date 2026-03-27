using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Faz3C_4_ContactAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Users",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CompanyName = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    ContactPersonName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Mobile = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    Website = table.Column<string>(type: "TEXT", maxLength: 300, nullable: true),
                    Address = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    City = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Tags = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "Id", "Address", "City", "CompanyName", "ContactPersonName", "Country", "CreatedAt", "CreatedBy", "Email", "IsDeleted", "Mobile", "Phone", "Tags", "UpdatedAt", "UpdatedBy", "Website" },
                values: new object[,]
                {
                    { 1, null, "İstanbul", "Acme Corp", "John Smith", "Türkiye", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "john.smith@acme.com", false, null, "+90 212 555 0101", "müşteri,teknoloji", null, null, null },
                    { 2, null, "Ankara", "TechVision Ltd", "Emily Johnson", "Türkiye", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "emily.johnson@techvision.com", false, null, "+90 312 555 0202", "yazılım,partner", null, null, null },
                    { 3, null, "İzmir", "GlobalTrade Inc", "Michael Brown", "Türkiye", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "m.brown@globaltrade.com", false, null, "+90 232 555 0303", "ticaret,ihracat", null, null, null },
                    { 4, null, "İstanbul", "DataSoft Bilişim", "Ayşe Kaya", "Türkiye", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "ayse.kaya@datasoft.com.tr", false, "+90 532 555 0404", "+90 216 555 0404", "yazılım,veri", null, null, "https://www.datasoft.com.tr" },
                    { 5, null, "Bursa", "MegaRetail A.Ş.", "Mehmet Demir", "Türkiye", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "mehmet.demir@megaretail.com.tr", false, "+90 542 555 0505", "+90 224 555 0505", "perakende,e-ticaret", null, null, "https://www.megaretail.com.tr" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "RefreshToken", "RefreshTokenExpiryTime" },
                values: new object[] { null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_CompanyName",
                table: "Contacts",
                column: "CompanyName");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ContactId",
                table: "Projects",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ContactId",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "Users");
        }
    }
}
