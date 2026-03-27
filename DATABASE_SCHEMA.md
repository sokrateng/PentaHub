# PentaHub — Veritabanı Şeması

## Genel Kurallar

- EF Core Code-First yaklaşımı
- SQLite başlangıç, MS SQL'e geçiş için provider-agnostic tasarım
- GUID yerine `int` ID (SQLite auto-increment uyumlu)
- Tüm tarihler UTC (`DateTime` tipinde)
- Soft delete: `IsDeleted` (bool, default false)
- Audit: `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`
- String alanlarında `MaxLength` zorunlu

## Base Entity

Tüm entity'ler bu abstract class'tan türeyecek:

```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
}
```

---

## FAZ 1A: Proje Yönetimi Çekirdeği

### Users (Kullanıcılar)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK, auto-increment | |
| FullName | string(200), required | Tam isim |
| Email | string(200), required, unique | E-posta |
| PasswordHash | string(500) | BCrypt hash |
| AvatarUrl | string(500), nullable | Profil resmi |
| Role | string(50), default "User" | Admin, ProjectManager, User |
| Department | string(100), nullable | Departman |
| IsActive | bool, default true | |
| + BaseEntity fields | | |

### Projects (Projeler)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| Name | string(300), required | Proje adı |
| Description | text, nullable | Açıklama (HTML/Markdown) |
| Status | enum ProjectStatus | Beklemede, DevamEden, Tamamlandi |
| ProjectManagerId | int, FK → Users | Proje yöneticisi |
| ContactId | int?, FK → Contacts | Müşteri (nullable = iç proje) |
| DepartmentName | string(100), nullable | Departman |
| PrivacyLevel | enum PrivacyLevel | InviteOnly, AllEmployees, ClientVisible |
| IsBillable | bool, default false | Fatura edilebilir mi? |
| IsTemplate | bool, default false | Şablon proje mi? |
| StartDate | DateTime?, nullable | Planlanan başlangıç |
| EndDate | DateTime?, nullable | Planlanan bitiş |
| ProjectEmail | string(200), nullable | Proje e-posta adresi |
| CustomerEvaluation | enum EvalType | None, Periodic, OnStageChange |
| EvaluationFrequency | string(50), nullable | Haftalık, Aylık vb. |
| SalesOrderId | int?, nullable | Satış siparişi bağlantısı (ileride) |
| + BaseEntity fields | | |

**Indexler:** `IX_Projects_Status`, `IX_Projects_ProjectManagerId`, `IX_Projects_ContactId`

### ProjectStatus Enum

```csharp
public enum ProjectStatus
{
    Beklemede = 0,
    DevamEden = 1,
    Tamamlandi = 2
}
```

---

## FAZ 1B: Görev Yönetimi

### TaskStages (Görev Aşamaları)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| ProjectId | int, FK → Projects | Hangi projeye ait |
| Name | string(100), required | Aşama adı (Yapılacak, Analiz, vb.) |
| SortOrder | int | Sıralama |
| IsDefault | bool | Yeni görevler için varsayılan mı? |
| IsClosedStage | bool | Bu aşama "Bitti" anlamına mı geliyor? |
| ShowInKanban | bool, default true | Kanban'da gösterilsin mi? |
| + BaseEntity fields | | |

### ProjectTasks (Görevler)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| TaskNumber | string(20), required, unique | T0001, T0002 formatında |
| Title | string(500), required | Görev başlığı |
| Description | text, nullable | Açıklama (zengin metin) |
| ProjectId | int, FK → Projects | |
| StageId | int, FK → TaskStages | Mevcut aşama |
| AssigneeId | int?, FK → Users | Atanan kişi |
| SprintId | int?, FK → Sprints | Bağlı sprint (nullable = backlog) |
| MilestoneId | int?, FK → Milestones | Kilometre taşı (Faz) |
| ParentTaskId | int?, FK → ProjectTasks | Üst görev (alt görev yapısı) |
| Priority | enum Priority (0-4) | 0=Yok, 1=Düşük .. 4=Acil (yıldız sayısı) |
| IsBillable | bool, default false | Fatura edilebilir mi? |
| StartDate | DateTime?, nullable | Başlangıç tarihi |
| DueDate | DateTime?, nullable | Vade tarihi |
| BusinessDaysOnly | bool, default true | Sadece iş günleri |
| PlannedHours | decimal(10,2), default 0 | Planlanan saat |
| SpentHours | decimal(10,2), default 0 | Harcanan saat (time sheet toplamı) |
| RemainingHours | decimal(10,2), default 0 | Kalan saat |
| ProgressPercent | int, default 0 | İlerleme yüzdesi (0-100) |
| Tags | string(500), nullable | Virgülle ayrılmış etiketler |
| + BaseEntity fields | | |

**Indexler:** `IX_Tasks_ProjectId`, `IX_Tasks_StageId`, `IX_Tasks_AssigneeId`, `IX_Tasks_SprintId`, `IX_Tasks_ParentTaskId`

### Priority Enum

```csharp
public enum Priority
{
    None = 0,       // ☆☆☆☆☆
    Low = 1,        // ★☆☆☆☆
    Medium = 2,     // ★★☆☆☆
    High = 3,       // ★★★☆☆
    Critical = 4    // ★★★★☆
}
```

---

## FAZ 1C: Sprint Yönetimi

### Sprints

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| Name | string(200), required | Sprint adı (Mart-I, Nisan-II) |
| ProjectId | int, FK → Projects | |
| State | enum SprintState | Draft, InProgress, Done |
| Goal | string(500), nullable | Sprint hedefi |
| StartDate | DateTime | |
| EndDate | DateTime | |
| + BaseEntity fields | | |

### SprintState Enum

```csharp
public enum SprintState
{
    Draft = 0,
    InProgress = 1,
    Done = 2
}
```

---

## FAZ 2A: Bağımlılıklar ve Kontrol Listesi

### TaskDependencies (Görev Bağımlılıkları)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| TaskId | int, FK → ProjectTasks | Bağımlı görev |
| DependsOnTaskId | int, FK → ProjectTasks | Bağımlı olduğu görev |
| DependencyType | enum DependencyType | FinishToStart, StartToStart, vb. |

### TaskChecklists (Kontrol Listesi)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| TaskId | int, FK → ProjectTasks | |
| Title | string(500), required | Madde açıklaması |
| AssigneeId | int?, FK → Users | Atanan kişi |
| IsCompleted | bool, default false | Tamamlandı mı? |
| SortOrder | int | Sıralama |
| + BaseEntity fields | | |

---

## FAZ 2B: Kaynak Yönetimi

### ResourceAllocations (Kaynak Tahsisi)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| UserId | int, FK → Users | Kaynak (kişi) |
| ProjectId | int, FK → Projects | |
| TaskId | int?, FK → ProjectTasks | Spesifik görev (opsiyonel) |
| StartDate | DateTime | Başlangıç |
| EndDate | DateTime | Bitiş |
| HoursPerDay | decimal(4,2) | Günlük saat |
| TotalHours | decimal(10,2) | Toplam saat |
| Notes | string(500), nullable | Notlar |
| + BaseEntity fields | | |

---

## FAZ 2C: Kilometre Taşları ve Zaman Çizelgesi

### Milestones (Kilometre Taşları / Fazlar)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| ProjectId | int, FK → Projects | |
| Name | string(200), required | Faz 1, Faz 2 vb. |
| TargetDate | DateTime?, nullable | Hedef tarih |
| SortOrder | int | Sıralama |
| + BaseEntity fields | | |

### TimeSheets (Zaman Çizelgeleri)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| UserId | int, FK → Users | |
| TaskId | int, FK → ProjectTasks | |
| Date | DateTime | Çalışma tarihi |
| Hours | decimal(4,2), required | Saat miktarı |
| Description | string(500), nullable | Açıklama |
| IsBillable | bool, default false | Fatura edilebilir mi? |
| + BaseEntity fields | | |

---

## FAZ 3A: Kolaborasyon

### Comments (Kolaborasyon / Notlar)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| EntityType | string(50), required | "Project", "Task", "Contact" |
| EntityId | int, required | İlgili kayıt ID |
| AuthorId | int, FK → Users | Yazan kişi |
| Content | text, required | Not içeriği (HTML destekli) |
| CommentType | enum CommentType | Note, Email, SystemLog, Meeting |
| IsInternal | bool, default true | İç mi, dış (portal) mı? |
| + BaseEntity fields | | |

**Indexler:** `IX_Comments_Entity` (EntityType + EntityId composite)

---

## FAZ 3C: Kontak Yönetimi

### Contacts (Kontaklar / Firmalar)

| Kolon | Tip | Açıklama |
|-------|-----|----------|
| Id | int, PK | |
| CompanyName | string(300), required | Firma adı |
| ContactPersonName | string(200), nullable | İlgili kişi |
| Email | string(200), nullable | |
| Phone | string(50), nullable | |
| Mobile | string(50), nullable | |
| Website | string(300), nullable | |
| Address | string(500), nullable | Adres |
| City | string(100), nullable | |
| Country | string(100), nullable | |
| Tags | string(500), nullable | Etiketler |
| + BaseEntity fields | | |

---

## İlişki Diyagramı (Özet)

```
Users ──────────┐
                │
Contacts ───┐   ├──→ Projects ──→ Milestones
            │   │       │
            │   │       ├──→ TaskStages
            │   │       │
            │   │       ├──→ Sprints
            │   │       │
            │   │       └──→ ProjectTasks ──→ TaskChecklists
            │   │               │         ──→ TaskDependencies
            │   │               │         ──→ TimeSheets
            │   │               │
            │   │               └──→ ResourceAllocations
            │   │
            └───┴──→ Comments (polymorphic: EntityType + EntityId)
```

## MS SQL Geçiş Notları

SQLite → MS SQL geçişinde dikkat edilecekler:

1. `appsettings.json` → connection string değişikliği
2. `Program.cs` → `UseSqlite()` yerine `UseSqlServer()`
3. Yeni migration oluştur: `dotnet ef migrations add MsSqlMigration`
4. `decimal` tipleri MS SQL'de otomatik çalışır
5. `MaxLength` kısıtlamaları zaten tanımlı olduğu için sorunsuz geçiş
6. Full-text search için MS SQL'e özgü index eklenebilir (ileriki faz)
