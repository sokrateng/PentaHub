using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EntityType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    EntityId = table.Column<int>(type: "INTEGER", nullable: false),
                    AuthorId = table.Column<int>(type: "INTEGER", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CommentType = table.Column<int>(type: "INTEGER", nullable: false),
                    IsInternal = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdatedBy = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "IsInternal", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 1, 1, 0, "<p>Proje başlangıç toplantısı gerçekleştirildi. Tüm ekip üyeleri görevlerini teslim aldı.</p>", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "Project", false, true, null, null });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 2, 2, 0, "<p>Müşteri ile sprint planlaması görüşmesi yapıldı. Öncelikli özellikler belirlendi.</p>", new DateTime(2025, 1, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "Project", false, null, null });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "IsInternal", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 3, 1, 2, "<p>Proje durumu: DevamEden olarak güncellendi.</p>", new DateTime(2025, 1, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "Project", false, true, null, null },
                    { 4, 3, 3, "<p>Haftalık durum toplantısı yapıldı. API entegrasyon geliştirme %20 tamamlandı.</p>", new DateTime(2025, 1, 25, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "Project", false, true, null, null },
                    { 5, 4, 2, "<p>Veri migrasyon planı onaylandı. Geliştirme ekibi bilgilendirildi.</p>", new DateTime(2025, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "Project", false, true, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AuthorId",
                table: "Comments",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_Entity",
                table: "Comments",
                columns: new[] { "EntityType", "EntityId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");
        }
    }
}
