# PentaHub — AI-Native Birleşik İş Yönetim Platformu

## Proje Tanımı

PentaHub, Cloudoffix platformu referans alınarak geliştirilen, proje yönetimi odaklı bir iş yönetim platformudur. İlk aşamada **Project Cloud** modülü geliştirilecek, ardından diğer modüller (Sales, Helpdesk, Invoice vb.) eklenecektir.

## Teknoloji Stack

| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| **Backend** | C# .NET 9, Minimal API + Clean Architecture | CQRS/MediatR pattern |
| **Frontend** | React 18+, TypeScript, Vite | SPA mimarisi |
| **UI Kütüphanesi** | shadcn/ui + Tailwind CSS | theme.css ile renk yönetimi |
| **Veritabanı** | SQLite (başlangıç) → MS SQL (ileriki faz) | EF Core ile ORM, migration path hazır |
| **ORM** | Entity Framework Core 9 | Code-First, SQLite provider başlangıç |
| **Gerçek Zamanlı** | SignalR | Bildirimler, kolaborasyon paneli |
| **Authentication** | JWT Bearer Token | Role-based (RBAC) |
| **Loglama** | Serilog | Structured logging |
| **Test** | xUnit + FluentAssertions | Backend unit/integration test |

## Veritabanı Stratejisi

- **Başlangıç**: SQLite ile geliştirme ve test
- **Geçiş**: EF Core migration ile MS SQL'e taşıma
- **Kural**: SQLite-specific SQL yazmaktan kaçın, her şeyi EF Core LINQ ile yap
- **Migration**: `dotnet ef migrations add` ile yönet
- Provider değişimi sadece `appsettings.json` ve `Program.cs` değişikliği olacak şekilde tasarla

## Proje Yapısı

```
PentaHub/
├── src/
│   ├── PentaHub.Domain/              # Entity'ler, Value Objects, Domain Events
│   │   ├── Entities/
│   │   │   ├── Project.cs
│   │   │   ├── ProjectTask.cs         # "Task" reserved word olduğu için ProjectTask
│   │   │   ├── Sprint.cs
│   │   │   ├── Milestone.cs
│   │   │   ├── TaskChecklist.cs
│   │   │   ├── TaskDependency.cs
│   │   │   ├── ResourceAllocation.cs
│   │   │   ├── TimeSheet.cs
│   │   │   ├── Contact.cs
│   │   │   ├── User.cs
│   │   │   └── Comment.cs             # Kolaborasyon paneli
│   │   ├── Enums/
│   │   │   ├── ProjectStatus.cs
│   │   │   ├── TaskStage.cs
│   │   │   ├── SprintState.cs
│   │   │   ├── Priority.cs
│   │   │   └── RiskLevel.cs
│   │   └── Interfaces/
│   │       └── IRepository.cs
│   │
│   ├── PentaHub.Application/          # Use Cases, CQRS Handlers
│   │   ├── Projects/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateProject/
│   │   │   │   ├── UpdateProject/
│   │   │   │   └── DeleteProject/
│   │   │   └── Queries/
│   │   │       ├── GetProjectById/
│   │   │       ├── GetProjectList/
│   │   │       └── GetProjectDashboard/
│   │   ├── Tasks/
│   │   │   ├── Commands/
│   │   │   └── Queries/
│   │   ├── Sprints/
│   │   ├── Resources/
│   │   └── Common/
│   │       ├── Interfaces/
│   │       ├── Mappings/
│   │       └── Behaviors/              # Validation, Logging pipeline
│   │
│   ├── PentaHub.Infrastructure/        # EF Core, SQLite/MSSQL, External Services
│   │   ├── Data/
│   │   │   ├── PentaHubDbContext.cs
│   │   │   ├── Configurations/         # Entity type configurations
│   │   │   └── Migrations/
│   │   ├── Repositories/
│   │   └── Services/
│   │
│   ├── PentaHub.API/                   # Minimal API endpoints
│   │   ├── Endpoints/
│   │   │   ├── ProjectEndpoints.cs
│   │   │   ├── TaskEndpoints.cs
│   │   │   ├── SprintEndpoints.cs
│   │   │   └── ResourceEndpoints.cs
│   │   ├── Hubs/
│   │   │   └── CollaborationHub.cs     # SignalR
│   │   ├── Middleware/
│   │   └── Program.cs
│   │
│   └── PentaHub.Web/                   # React Frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/                 # shadcn/ui bileşenleri
│       │   │   ├── layout/
│       │   │   │   ├── Sidebar.tsx
│       │   │   │   ├── Header.tsx
│       │   │   │   └── AppShell.tsx
│       │   │   ├── projects/
│       │   │   │   ├── ProjectCard.tsx
│       │   │   │   ├── ProjectKanban.tsx
│       │   │   │   ├── ProjectList.tsx
│       │   │   │   └── ProjectDashboard.tsx
│       │   │   ├── tasks/
│       │   │   │   ├── TaskKanban.tsx
│       │   │   │   ├── TaskCard.tsx
│       │   │   │   ├── TaskDetail.tsx
│       │   │   │   ├── TaskGantt.tsx
│       │   │   │   └── TaskList.tsx
│       │   │   ├── sprints/
│       │   │   ├── resources/
│       │   │   └── collaboration/
│       │   │       └── CollaborationPanel.tsx
│       │   ├── hooks/
│       │   ├── services/               # API client (fetch/axios)
│       │   ├── stores/                 # Zustand state management
│       │   ├── types/
│       │   ├── lib/
│       │   │   └── utils.ts
│       │   ├── styles/
│       │   │   └── theme.css           # CSS variables, renk yönetimi
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── tests/
│   ├── PentaHub.Domain.Tests/
│   ├── PentaHub.Application.Tests/
│   └── PentaHub.API.Tests/
│
├── CLAUDE.md                           # Bu dosya
├── DEVELOPMENT_PHASES.md               # Faz detayları
├── DATABASE_SCHEMA.md                  # Veritabanı şeması
├── PentaHub.sln
└── .gitignore
```

## Geliştirme Kuralları

### Backend Kuralları
- Her endpoint Minimal API ile yazılacak (`MapGet`, `MapPost`, `MapPut`, `MapDelete`)
- CQRS pattern: her işlem ayrı Command/Query + Handler
- MediatR ile pipeline (validation, logging)
- FluentValidation ile input doğrulama
- Entity'ler Domain katmanında, DB bağımlılığı yok
- Repository pattern ile data access soyutlaması
- Tüm tarihler UTC olarak saklanacak
- Soft delete kullanılacak (`IsDeleted` flag)
- Audit fields: `CreatedAt`, `CreatedBy`, `UpdatedAt`, `UpdatedBy`
- Response wrapper: `ApiResponse<T>` ile standart response format

### Frontend Kuralları
- shadcn/ui bileşenleri kullanılacak (ZORUNLU)
- Tailwind CSS ile stillendirme
- theme.css dosyasında CSS variables ile renk yönetimi
- Zustand ile global state management
- React Query (TanStack Query) ile server state
- React Router v6 ile routing
- TypeScript strict mode
- Tüm API çağrıları `services/` altında merkezi

### Veritabanı Kuralları
- EF Core Code-First yaklaşımı
- IEntityTypeConfiguration ile ayrı configuration dosyaları
- SQLite'a özgü SQL yazılmayacak
- GUID yerine int ID kullan (SQLite uyumluluğu için)
- String length'leri mutlaka belirt (`MaxLength`)
- Index tanımlarını configuration'da yap
- Cascade delete kurallarını açıkça belirt

### İsimlendirme
- Backend: PascalCase (C# convention)
- Frontend: camelCase (TypeScript convention)
- API endpoints: kebab-case (`/api/projects`, `/api/project-tasks`)
- Veritabanı tabloları: PascalCase (`Projects`, `ProjectTasks`)
- Türkçe UI label'ları, İngilizce kod

### Git Kuralları
- Feature branch: `feature/faz1-proje-karti`
- Commit mesajları Türkçe olabilir
- Her faz sonunda tag: `v0.1.0-faz1`

## Faz Planı (Özet)

| Faz | Odak | Süre |
|-----|------|------|
| **Faz 1A** | Proje CRUD, Proje Kartı, Proje Kanban (Beklemede/Devam/Tamamlandı) | 1 hafta |
| **Faz 1B** | Görev Yönetimi: Kanban board, görev kartı, görev aşamaları | 1 hafta |
| **Faz 1C** | Sprint yönetimi, backlog, sprint kartı | 1 hafta |
| **Faz 2A** | Gantt chart, görev bağımlılıkları, kontrol listesi | 1 hafta |
| **Faz 2B** | Kaynak tahsisi takvimi, kaynak raporları | 1 hafta |
| **Faz 2C** | Kilometre taşları, zaman çizelgesi (time sheet), timer | 1 hafta |
| **Faz 3A** | Kolaborasyon paneli, e-posta tab yapısı | 1 hafta |
| **Faz 3B** | Project Dashboard, KPI kartları, grafikler | 1 hafta |
| **Faz 3C** | Kontak/Firma yönetimi, 360° kart | 1 hafta |
| **Faz 4** | Authentication (JWT), RBAC, kullanıcı yönetimi | 1 hafta |

> Detaylı faz planı için `DEVELOPMENT_PHASES.md` dosyasına bakınız.

## Hızlı Başlangıç

```bash
# Backend
dotnet new sln -n PentaHub
dotnet new classlib -n PentaHub.Domain -o src/PentaHub.Domain
dotnet new classlib -n PentaHub.Application -o src/PentaHub.Application
dotnet new classlib -n PentaHub.Infrastructure -o src/PentaHub.Infrastructure
dotnet new webapi -n PentaHub.API -o src/PentaHub.API --use-minimal-apis
dotnet sln add src/PentaHub.Domain src/PentaHub.Application src/PentaHub.Infrastructure src/PentaHub.API

# Frontend
cd src
npm create vite@latest PentaHub.Web -- --template react-ts
cd PentaHub.Web
npm install
npx shadcn@latest init
```

## Önemli Notlar

- Bu dosya Claude Code tarafından her oturumda okunmalıdır
- Her faz başında `DEVELOPMENT_PHASES.md` dosyasındaki ilgili faz detayına bakılmalıdır
- Veritabanı şeması için `DATABASE_SCHEMA.md` referans alınmalıdır
- UI tasarımında Cloudoffix ekran görüntüleri referans alınmalıdır (yeşil tema, beyaz kartlar, sol menü, sağ kolaborasyon paneli)
