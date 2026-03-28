using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PentaHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPentaBMSProjectData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "IsInternal", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 8, 4, 0, "<p>📄 <strong>Teknik Mimari Dökümanı</strong> (PDF)<br/>.NET uygulama katmanları, SQL Server şeması, SAP RFC Gateway yapısı, KVKK/ISO 27001 uyumluluk gereksinimleri.</p>", new DateTime(2026, 4, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null },
                    { 9, 3, 0, "<p><strong>SAP RFC Erişim Durumu</strong></p><p>5 adet Z_BMS_* RFC fonksiyonu SAP Basis ekibi tarafından açıldı. Tüm bağlantı testleri başarılı.</p><ul><li>Z_BMS_GET_FI_ACTUAL ✅</li><li>Z_BMS_GET_SD_SALES ✅</li><li>Z_BMS_GET_CO_COSTCENTER ✅</li><li>Z_BMS_POST_BUDGET ✅</li><li>Z_BMS_GET_FX_RATES ✅</li></ul>", new DateTime(2026, 4, 14, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null },
                    { 12, 1, 2, "<p>Proje durumu: DevamEden olarak güncellendi. Hazırlık fazı başarıyla tamamlandı.</p>", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null },
                    { 13, 4, 0, "<p>Dashboard KPI kartları ve trend grafikleri tamamlandı. OPEX renk kodları ve onay bildirimleri kaldı.</p>", new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, 21, "Task", false, true, null, null },
                    { 14, 3, 0, "<p>SAP SD verilerinde tutarsızlık bulundu. Basis ekibi ile koordinasyon gerekiyor. Veri temizleme için 1 hafta ek süre talep ediyorum.</p>", new DateTime(2026, 5, 25, 0, 0, 0, 0, DateTimeKind.Utc), null, 23, "Task", false, true, null, null },
                    { 15, 3, 0, "<p>Tüm 5 RFC fonksiyonu başarıyla test edildi. Performans metrikleri:<br/>- FI_ACTUAL: avg 1.2s<br/>- SD_SALES: avg 0.8s<br/>- CO_COSTCENTER: avg 0.5s<br/>- POST_BUDGET: avg 2.1s<br/>- FX_RATES: avg 0.3s</p>", new DateTime(2026, 4, 13, 0, 0, 0, 0, DateTimeKind.Utc), null, 17, "Task", false, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AvatarUrl", "CreatedAt", "CreatedBy", "Department", "Email", "FullName", "IsActive", "IsDeleted", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "Role", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 8, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Finans", "yasemin.kaya@pentahub.com", "Yasemin Kaya", true, false, "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02", null, null, "ProjectManager", null, null });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "IsInternal", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 6, 8, 3, "<p><strong>Proje Kick-off Toplantısı</strong></p><p>Penta BMS projesi resmi olarak başlatıldı. 3 fazlı geliştirme planı onaylandı. IBM Cognos TM1 alternatifi olarak geliştirilecek.</p><p>Katılımcılar: Yasemin K. (CIO), Ali Akın (IT), Osman Kaya (SAP), Demo User (Frontend)</p>", new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 7, 8, 0, "<p>📄 <strong>Yönetici Sunumu</strong> (PPTX)<br/>Penta BMS Bütçe Yönetim Sistemi yönetici sunumu. Proje kapsamı, 3 faz planı, teknik mimari, maliyet analizi ve IBM TM1 karşılaştırması.</p><p>🔗 penta-bms-yonetici-sunumu.pptx</p>", new DateTime(2026, 3, 28, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, null, null },
                    { 10, 8, 0, "<p>📄 <strong>Maliyet & ROI Analizi</strong> (XLSX)<br/>Faz bazlı maliyet tahmini: Toplam ₺1.35M–₺2.2M. IBM TM1 karşılaştırması: ₺6M–₺11M tasarruf. Kaynak kodu Penta'ya ait.</p>", new DateTime(2026, 3, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, null, null }
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "IsInternal", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 11, 8, 3, "<p><strong>Haftalık Durum Toplantısı #4</strong></p><p>Hazırlık fazı tamamlandı. Faz 1 geliştirme başladı. Dashboard %80, Bütçe Giriş %58, SAP SD enteg. %36 ilerleme.</p><p>Risk: SAP SD veri kalitesi düşük — veri temizleme gerekiyor.</p>", new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null },
                    { 16, 8, 0, "<p><strong>HAND-OVER: Hazırlık → Faz 1 Geçiş Notu</strong></p><p>Tamamlanan işler:</p><ul><li>.NET proje altyapısı kuruldu (Clean Architecture)</li><li>SQL Server şeması tasarlandı ve oluşturuldu</li><li>5 SAP RFC fonksiyonu test edildi — tümü başarılı</li><li>Kullanıcı yetki matrisi tanımlandı (4 rol)</li><li>UAT ortamı hazırlandı</li></ul><p>Faz 1'e aktarılan riskler:</p><ul><li>SAP SD veri kalitesi — temizleme gerekiyor</li><li>Excel import için standart şablon oluşturulmalı</li></ul><p>Faz 1 öncelikleri: Dashboard, Bütçe Giriş, SAP SD/FI-CO entegrasyonu</p>", new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, true, null, null }
                });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "AuthorId", "CommentType", "Content", "CreatedAt", "CreatedBy", "EntityId", "EntityType", "IsDeleted", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 17, 8, 1, "<p><strong>Konu:</strong> BMS Faz 1 İlerleme Raporu — Finans Departmanı<br/><strong>Kime:</strong> CFO, Finans Ekibi<br/><strong>Tarih:</strong> 20 Mayıs 2026</p><p>Değerli Yöneticiler,</p><p>Penta BMS Faz 1 geliştirme süreci planlandığı şekilde ilerlemektedir. Dashboard modülü %80, Bütçe Giriş modülü %58 tamamlanmıştır. Haziran sonuna kadar SAP SD ve FI-CO entegrasyonlarının tamamlanması hedeflenmektedir.</p>", new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "Project", false, null, null });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "ContactId", "CreatedAt", "CreatedBy", "CustomerEvaluation", "DepartmentName", "Description", "EndDate", "EvaluationFrequency", "IsBillable", "IsDeleted", "Name", "PrivacyLevel", "ProjectEmail", "ProjectManagerId", "SalesOrderId", "StartDate", "Status", "UpdatedAt", "UpdatedBy" },
                values: new object[] { 9, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, "Finans", "IBM Cognos TM1 alternatifi, SAP FI/CO/SD entegrasyonlu bütçe yönetim sistemi. 3 fazlı geliştirme: Satış & OPEX, IFRS Finansal Tablolar, Net Kâr Dağıtım Modeli. Claude AI destekli geliştirme.", new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, "Penta BMS - Bütçe Yönetim Sistemi", 0, null, 8, null, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null });

            migrationBuilder.InsertData(
                table: "Milestones",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "IsDeleted", "Name", "ProjectId", "SortOrder", "TargetDate", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Hazırlık & Altyapı Tamamlanması", 9, 1, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 1 - Satış & OPEX Go-Live", 9, 2, new DateTime(2026, 7, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 2 - IFRS Raporlama Go-Live", 9, 3, new DateTime(2026, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 8, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Faz 3 - Net Kâr Modeli Go-Live", 9, 4, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), null, null },
                    { 9, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, "Yönetim Kurulu Sunumu & Final Onay", 9, 5, new DateTime(2026, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, null }
                });

            migrationBuilder.InsertData(
                table: "ResourceAllocations",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "EndDate", "HoursPerDay", "IsDeleted", "Notes", "ProjectId", "StartDate", "TaskId", "TotalHours", "UpdatedAt", "UpdatedBy", "UserId" },
                values: new object[,]
                {
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), 6m, false, "Proje Yöneticisi & İş Analisti — CIO/COO Yasemin K.", 9, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 780m, null, null, 8 },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), 8m, false, "Kıdemli .NET Geliştirici — Full-stack", 9, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1040m, null, null, 4 },
                    { 8, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), 8m, false, "SAP ABAP/RFC Uzmanı — Entegrasyon geliştirici", 9, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 1040m, null, null, 3 },
                    { 9, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), 4m, false, "Frontend Geliştirici — Raporlama & UI", 9, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 520m, null, null, 7 },
                    { 10, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 7, 15, 0, 0, 0, 0, DateTimeKind.Utc), 3m, false, "QA & Test Uzmanı — UAT koordinasyonu", 9, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, 195m, null, null, 1 }
                });

            migrationBuilder.InsertData(
                table: "Sprints",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "EndDate", "Goal", "IsDeleted", "Name", "ProjectId", "StartDate", "State", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 30, 0, 0, 0, 0, DateTimeKind.Utc), ".NET modül entegrasyonu, SAP RFC bağlantı testi, kullanıcı eğitimi", false, "BMS Hazırlık Sprint", 9, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, null, null },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 7, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Net Satış, Brüt Kâr, SDD — İş Birimi & Marka bazlı, SAP SD entegrasyonu", false, "BMS Faz 1 - Satış & OPEX", 9, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, null, null },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 9, 15, 0, 0, 0, 0, DateTimeKind.Utc), "IFRS mizan, Gelir Tablosu, Bilanço, Nakit Akış, NİS takibi", false, "BMS Faz 2 - IFRS Tablolar", 9, new DateTime(2026, 7, 16, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), "NİS dağıtım modeli, vergi dağıtımı, İB Net Kâr, marka kârlılık matrisi", false, "BMS Faz 3 - Net Kâr Modeli", 9, new DateTime(2026, 9, 16, 0, 0, 0, 0, DateTimeKind.Utc), 0, null, null }
                });

            migrationBuilder.InsertData(
                table: "TaskStages",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "IsClosedStage", "IsDefault", "IsDeleted", "Name", "ProjectId", "ShowInKanban", "SortOrder", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 41, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, true, false, "Yapılacak", 9, true, 1, null, null },
                    { 42, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Analiz", 9, true, 2, null, null },
                    { 43, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Devam Etmekte", 9, true, 3, null, null },
                    { 44, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, false, "Test Yapmak", 9, true, 4, null, null },
                    { 45, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, "Bitti", 9, true, 5, null, null }
                });

            migrationBuilder.InsertData(
                table: "ProjectTasks",
                columns: new[] { "Id", "AssigneeId", "BusinessDaysOnly", "CreatedAt", "CreatedBy", "Description", "DueDate", "IsBillable", "IsDeleted", "MilestoneId", "ParentTaskId", "PlannedHours", "Priority", "ProgressPercent", "ProjectId", "RemainingHours", "SortOrder", "SpentHours", "SprintId", "StageId", "StartDate", "Tags", "TaskNumber", "Title", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 16, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 4, 7, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 5, null, 24m, 4, 100, 9, 0m, 1, 24m, 4, 45, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-001", ".NET Proje Altyapısı Kurulumu", null, null },
                    { 17, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 4, 14, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 5, null, 32m, 4, 100, 9, 0m, 2, 32m, 4, 45, new DateTime(2026, 4, 7, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-002", "SAP RFC Bağlantı Testi (FI/CO/SD)", null, null },
                    { 18, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 5, null, 20m, 3, 100, 9, 0m, 3, 20m, 4, 45, new DateTime(2026, 4, 8, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-003", "SQL Server Veritabanı Şeması Tasarımı", null, null },
                    { 19, 8, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 4, 18, 0, 0, 0, 0, DateTimeKind.Utc), false, false, 5, null, 8m, 2, 100, 9, 0m, 4, 8m, 4, 45, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-004", "Kullanıcı Rol & Yetki Matrisi Tanımlama", null, null },
                    { 20, 1, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 4, 28, 0, 0, 0, 0, DateTimeKind.Utc), false, false, 5, null, 12m, 2, 100, 9, 0m, 5, 12m, 4, 45, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-005", "UAT Ortamı Hazırlığı & Eğitim Planı", null, null },
                    { 21, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 40m, 3, 80, 9, 8m, 1, 32m, 5, 44, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-006", "Dashboard & KPI Kartları Geliştirme", null, null },
                    { 22, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 6, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 48m, 4, 58, 9, 20m, 2, 28m, 5, 43, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-007", "Aylık Bütçe Giriş Modülü (Excel/CSP/Manuel)", null, null },
                    { 23, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 56m, 4, 36, 9, 36m, 3, 20m, 5, 43, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-008", "SAP SD → Satış Verisi Otomatik Entegrasyon", null, null },
                    { 24, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 40m, 3, 25, 9, 30m, 4, 10m, 5, 42, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-009", "SAP FI-CO → Fiili Veri Aktarımı", null, null },
                    { 25, 7, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 32m, 3, 16, 9, 27m, 5, 5m, 5, 42, new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-010", "Bütçe/Gerçekleşme Karşılaştırma Raporları", null, null },
                    { 26, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 7, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 24m, 2, 0, 9, 24m, 6, 0m, 5, 41, new DateTime(2026, 6, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-011", "4 Adımlı Onay İş Akışı (Workflow)", null, null },
                    { 27, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 7, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 20m, 2, 0, 9, 20m, 7, 0m, 5, 41, new DateTime(2026, 6, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-012", "Senaryo Yönetimi (Baz/İyimser/Kötümser)", null, null },
                    { 28, 7, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 7, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 6, null, 16m, 3, 0, 9, 16m, 8, 0m, 5, 41, new DateTime(2026, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-013", "Döviz Kur Yönetimi & TCMB Entegrasyonu", null, null },
                    { 29, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 7, null, 40m, 4, 0, 9, 40m, 1, 0m, 6, 41, new DateTime(2026, 7, 16, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-014", "SAP IFRS Mizan Verisi Aktarımı", null, null },
                    { 30, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 8, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 7, null, 36m, 3, 0, 9, 36m, 2, 0m, 6, 41, new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-015", "IFRS Gelir Tablosu Modülü", null, null },
                    { 31, 7, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 7, null, 32m, 3, 0, 9, 32m, 3, 0m, 6, 41, new DateTime(2026, 8, 10, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-016", "Bilanço & Nakit Akış Raporlaması", null, null },
                    { 32, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 9, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 7, null, 24m, 2, 0, 9, 24m, 4, 0m, 6, 41, new DateTime(2026, 8, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-017", "Net İşletme Sermayesi (NİS) Takip Modülü", null, null },
                    { 33, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 9, 12, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 7, null, 16m, 2, 0, 9, 16m, 5, 0m, 6, 41, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-018", "Net Finansal Borç İzleme Paneli", null, null },
                    { 34, 8, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 10, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 8, null, 32m, 3, 0, 9, 32m, 1, 0m, 7, 41, new DateTime(2026, 9, 16, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-019", "NİS Bazlı Finansman Gideri Dağıtım Anahtarları", null, null },
                    { 35, 3, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 10, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 8, null, 24m, 3, 0, 9, 24m, 2, 0m, 7, 41, new DateTime(2026, 10, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-020", "Vergi Gideri İB & Marka Bazlı Dağıtım", null, null },
                    { 36, 4, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 10, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 8, null, 40m, 4, 0, 9, 40m, 3, 0m, 7, 41, new DateTime(2026, 10, 5, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-021", "İş Birimi Bazlı Net Kâr Hesaplama Motoru", null, null },
                    { 37, 7, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 10, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, false, 8, null, 20m, 2, 0, 9, 20m, 4, 0m, 7, 41, new DateTime(2026, 10, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-022", "Marka Bazlı Kârlılık Matrisi", null, null },
                    { 38, 8, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 10, 31, 0, 0, 0, 0, DateTimeKind.Utc), false, false, 9, null, 16m, 3, 25, 9, 12m, 1, 4m, null, 42, new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-023", "KVKK & ISO 27001 Uyumluluk Denetimi", null, null },
                    { 39, 1, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 6, 30, 0, 0, 0, 0, DateTimeKind.Utc), false, false, 9, null, 24m, 2, 50, 9, 12m, 2, 12m, null, 43, new DateTime(2026, 4, 15, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-024", "IBM TM1 → Penta BMS Veri Migrasyon Planı", null, null },
                    { 40, 8, true, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, new DateTime(2026, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), false, false, 9, null, 8m, 1, 0, 9, 8m, 3, 0m, null, 41, new DateTime(2026, 10, 20, 0, 0, 0, 0, DateTimeKind.Utc), null, "BMS-025", "Yönetim Kurulu Final Sunumu Hazırlığı", null, null }
                });

            migrationBuilder.InsertData(
                table: "TaskChecklists",
                columns: new[] { "Id", "AssigneeId", "CreatedAt", "CreatedBy", "IsCompleted", "IsDeleted", "SortOrder", "TaskId", "Title", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 6, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 1, 17, "Z_BMS_GET_FI_ACTUAL RFC testi", null, null },
                    { 7, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 2, 17, "Z_BMS_GET_SD_SALES RFC testi", null, null },
                    { 8, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 3, 17, "Z_BMS_GET_CO_COSTCENTER RFC testi", null, null },
                    { 9, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 4, 17, "Z_BMS_POST_BUDGET RFC testi", null, null },
                    { 10, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 5, 17, "Z_BMS_GET_FX_RATES RFC testi", null, null },
                    { 11, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 1, 21, "6 KPI kartı tasarımı", null, null },
                    { 12, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 2, 21, "Trend grafikleri (bütçe vs fiili)", null, null },
                    { 13, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 3, 21, "İş birimi dağılımı donut chart", null, null },
                    { 14, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 4, 21, "OPEX ilerleme renk kodları", null, null },
                    { 15, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 5, 21, "Onay bildirimleri özeti", null, null },
                    { 16, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 1, 22, "12 aylık giriş tablosu UI", null, null },
                    { 17, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 2, 22, "Excel import desteği", null, null },
                    { 18, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 3, 22, "CSP (Cost Center Planning) entegrasyonu", null, null },
                    { 19, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 4, 22, "Senaryo & departman seçici", null, null },
                    { 20, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 1, 38, "Veri sınıflandırma raporu", null, null },
                    { 21, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 2, 38, "Audit log mekanizması", null, null },
                    { 22, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 3, 38, "Kullanıcı erişim logları", null, null },
                    { 23, null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, 4, 38, "Veri saklama politikası", null, null }
                });

            migrationBuilder.InsertData(
                table: "TaskDependencies",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "DependencyType", "DependsOnTaskId", "IsDeleted", "TaskId", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 18, false, 22, null, null },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 17, false, 23, null, null },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 17, false, 24, null, null },
                    { 7, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 24, false, 29, null, null },
                    { 8, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 32, false, 34, null, null },
                    { 9, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 0, 35, false, 36, null, null }
                });

            migrationBuilder.InsertData(
                table: "TimeSheets",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Date", "Description", "Hours", "IsBillable", "IsDeleted", "TaskId", "UpdatedAt", "UpdatedBy", "UserId" },
                values: new object[,]
                {
                    { 11, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), ".NET Clean Architecture proje yapısı oluşturma", 8m, true, false, 16, null, null, 4 },
                    { 12, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 2, 0, 0, 0, 0, DateTimeKind.Utc), "NuGet paketleri, DI ve middleware konfigürasyonu", 8m, true, false, 16, null, null, 4 },
                    { 13, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 3, 0, 0, 0, 0, DateTimeKind.Utc), "SAP RFC connector entegrasyonu ve test", 8m, true, false, 16, null, null, 4 },
                    { 14, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 7, 0, 0, 0, 0, DateTimeKind.Utc), "Z_BMS_GET_FI_ACTUAL ve Z_BMS_GET_SD_SALES RFC testi", 8m, true, false, 17, null, null, 3 },
                    { 15, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Z_BMS_GET_CO_COSTCENTER ve Z_BMS_POST_BUDGET RFC testi", 8m, true, false, 17, null, null, 3 },
                    { 16, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Z_BMS_GET_FX_RATES testi ve performans ölçümü", 8m, true, false, 17, null, null, 3 },
                    { 17, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), "RFC hata yönetimi ve retry mekanizması", 8m, true, false, 17, null, null, 3 },
                    { 18, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Bütçe, senaryo, hesap planı tabloları tasarımı", 8m, true, false, 18, null, null, 4 },
                    { 19, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "KPI kartları ve trend grafikleri geliştirme", 8m, true, false, 21, null, null, 4 },
                    { 20, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 5, 8, 0, 0, 0, 0, DateTimeKind.Utc), "İş birimi dağılımı ve donut chart", 8m, true, false, 21, null, null, 4 },
                    { 21, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Aylık bütçe giriş formu backend API", 8m, true, false, 22, null, null, 3 },
                    { 22, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 5, 15, 0, 0, 0, 0, DateTimeKind.Utc), "SAP SD veri mapping ve dönüşüm kuralları", 8m, true, false, 23, null, null, 3 },
                    { 23, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "KVKK veri sınıflandırma raporu hazırlama", 4m, false, false, 38, null, null, 8 },
                    { 24, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Utc), "IBM TM1 mevcut veri yapısı analizi", 6m, false, false, 39, null, null, 1 },
                    { 25, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Veri migrasyon stratejisi ve mapping dökümanı", 6m, false, false, 39, null, null, 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "ResourceAllocations",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ResourceAllocations",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "ResourceAllocations",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "ResourceAllocations",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ResourceAllocations",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "TaskChecklists",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "TaskDependencies",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "TimeSheets",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "ProjectTasks",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Milestones",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Milestones",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Milestones",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Milestones",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Milestones",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Sprints",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "TaskStages",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "TaskStages",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "TaskStages",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "TaskStages",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "TaskStages",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 8);
        }
    }
}
