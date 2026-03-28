# PentaHub

**AI-Native Birlesik Is Yonetim Platformu**

PentaHub, proje yonetimi odakli, modern bir is yonetim platformudur. Clean Architecture ve CQRS pattern ile gelistirilmis .NET 9 backend, React 19 + TypeScript frontend ile tam kapsamli bir SPA sunmaktadir.

> **Canli Demo:** [sokrateng.github.io/PentaHub](https://sokrateng.github.io/PentaHub/)

---

## Ozellikler

### Proje Yonetimi
- **Proje Kanban** -- Beklemede / Devam Eden / Tamamlandi gorunumleri
- **Proje Karti** -- Durum, ilerleme yuzdeleri, atamalar, etiketler
- **Proje Detay** -- Coklu tab yapisi (Gorevler, Sprint, Gantt, Kilometre Taslari, Kaynaklar, Kolaborasyon)

### Gorev Yonetimi
- **Gorev Kanban** -- Proje bazli surukle-birak gorev tahtasi
- **Gorev Detay** -- Alt gorevler (checklist), bagimliliklar, zaman takibi, yorumlar
- **Gorev Asamalari** -- Proje bazli ozellestirilmis kanban kolonlari
- **Global Gorevler** -- Tum projelerdeki gorevlerin tek sayfadan yonetimi

### Sprint Yonetimi
- **Sprint Yasam Dongusu** -- Taslak → Devam Eden → Tamamlandi
- **Backlog** -- Gorevleri sprint'lere atama, onceliklendirme
- **Sprint Detay** -- Burndown chart, sprint kapsamindaki gorevler

### Planlama & Takip
- **Gantt Chart** -- Gorev zamanlama, bagimlilik goruntuleme
- **Kaynak Takvimi** -- Kullanici bazli kaynak tahsisi
- **Kilometre Taslari** -- Hedef tarihler, faz yonetimi
- **Zaman Cizelgesi** -- Gorev bazli zaman kaydi, haftalik raporlar

### Isbirligi & Iletisim
- **Kolaborasyon Paneli** -- Sag sidebar uzerinden gercek zamanli not, e-posta, toplanti, sistem logları
- **SignalR** -- Canli bildirimler

### Kontak Yonetimi
- **360° Kontak Karti** -- Sirket / birey yonetimi
- **Kontak Detay** -- Iliskili projeler, gorevler, notlar

### Dashboard & Raporlama
- **KPI Kartlari** -- Proje sayilari, gorev dagilimi, sprint durumu
- **Grafikler** -- Recharts ile gorev dagilim grafikleri, ilerleme raporlari

### Kimlik Dogrulama
- **JWT Bearer Token** -- Login / Register
- **RBAC** -- Admin, ProjectManager, User rolleri
- **Korunmus Rotalar** -- ProtectedRoute ile yetki kontrolu

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Backend** | C# .NET 9, Minimal API, Clean Architecture |
| **Pattern** | CQRS + MediatR, FluentValidation, AutoMapper |
| **Frontend** | React 19, TypeScript 5.9, Vite 8 |
| **UI** | shadcn/ui, Tailwind CSS 4, Lucide Icons |
| **State** | Zustand 5 (global), TanStack Query 5 (server) |
| **Routing** | React Router DOM 7 |
| **Grafik** | Recharts 3 |
| **Drag & Drop** | @hello-pangea/dnd |
| **Veritabani** | SQLite (baslangic) → MS SQL (uretim) |
| **ORM** | Entity Framework Core 9 (Code-First) |
| **Gercek Zaman** | SignalR |
| **Auth** | JWT Bearer Token |
| **Loglama** | Serilog |
| **Test** | xUnit + FluentAssertions |

---

## Mimari

```
PentaHub/
├── src/
│   ├── PentaHub.Domain/           # Entity, Enum, Interface
│   ├── PentaHub.Application/      # CQRS Command/Query + Handler
│   ├── PentaHub.Infrastructure/   # EF Core, Repository, Migration
│   ├── PentaHub.API/              # Minimal API Endpoint, SignalR Hub
│   └── PentaHub.Web/              # React SPA
└── tests/
    ├── PentaHub.Domain.Tests/
    ├── PentaHub.Application.Tests/
    └── PentaHub.API.Tests/
```

**Clean Architecture** katmanlari:

- **Domain** -- Entity'ler, Value Object'ler, Enum'lar. Hicbir dis bagimliligi yok.
- **Application** -- Use case'ler. MediatR handler'lari, validation, mapping.
- **Infrastructure** -- EF Core DbContext, repository implementasyonlari, seed data.
- **API** -- Minimal API endpoint'leri, middleware, SignalR hub'lari.
- **Web** -- React SPA. shadcn/ui bilesenler, Zustand store, TanStack Query.

---

## API Endpoint'leri

| Modul | Endpoint | Islem |
|-------|----------|-------|
| Auth | `/api/auth` | Login, Register, JWT |
| Projeler | `/api/projects` | CRUD, istatistikler, filtreleme |
| Gorevler | `/api/tasks` | CRUD, asama degisikligi, atama |
| Gorev Asamalari | `/api/task-stages` | Kanban kolon yonetimi |
| Sprintler | `/api/sprints` | Yasam dongusu, gorev atama |
| Kontrol Listesi | `/api/checklists` | Alt gorev yonetimi |
| Bagimliliklar | `/api/dependencies` | Gorev bagimliliklari |
| Kaynaklar | `/api/resources` | Tahsis takvimi |
| Kilometre Taslari | `/api/milestones` | Hedef tarih yonetimi |
| Zaman Cizelgesi | `/api/timesheets` | Zaman kaydi |
| Yorumlar | `/api/comments` | Not, e-posta, log |
| Kontaklar | `/api/contacts` | Sirket/birey yonetimi |
| Kullanicilar | `/api/users` | Kullanici listesi |

---

## Veritabani Semasi

10 ana tablo, tumu `BaseEntity` (Id, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, IsDeleted) miras alir:

```
Users ─────────┐
               ├── Projects ──── TaskStages
               │       │              │
               │       ├── Sprints    │
               │       │              │
               │       └── ProjectTasks ──┬── TaskChecklists
               │               │          ├── TaskDependencies
               │               │          └── TimeSheets
               │               │
               ├── ResourceAllocations
               ├── Milestones
               └── Comments (polymorphic: Project/Task/Contact)

Contacts ──────┘
```

---

## Kurulum

### Gereksinimler

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- Git

### Backend

```bash
# Repo'yu klonla
git clone https://github.com/sokrateng/PentaHub.git
cd PentaHub

# Bagimliliklari yukle ve calistir
dotnet restore
dotnet build
dotnet run --project src/PentaHub.API
```

Backend varsayilan olarak `http://localhost:5278` adresinde calisir.

### Frontend

```bash
cd src/PentaHub.Web

# Bagimliliklari yukle
npm install

# Gelistirme sunucusunu baslat
npm run dev
```

Frontend `http://localhost:5180` adresinde calisir ve API isteklerini `localhost:5278`'e proxy eder.

### Uretim Build

```bash
cd src/PentaHub.Web
npm run build
```

Cikti `dist/` klasorune olusturulur.

---

## Gelistirme Yol Haritasi

| Faz | Odak | Durum |
|-----|------|-------|
| Faz 1A | Proje CRUD, Kanban | ✅ Tamamlandi |
| Faz 1B | Gorev Yonetimi, Kanban Board | ✅ Tamamlandi |
| Faz 1C | Sprint Yonetimi, Backlog | ✅ Tamamlandi |
| Faz 2A | Gantt Chart, Bagimliliklar, Checklist | ✅ Tamamlandi |
| Faz 2B | Kaynak Tahsisi Takvimi | ✅ Tamamlandi |
| Faz 2C | Kilometre Taslari, Zaman Cizelgesi | ✅ Tamamlandi |
| Faz 3A | Kolaborasyon Paneli | ✅ Tamamlandi |
| Faz 3B | Dashboard, KPI Kartlari | ✅ Tamamlandi |
| Faz 3C | Kontak/Firma Yonetimi | ✅ Tamamlandi |
| Faz 4 | Authentication (JWT), RBAC | ✅ Tamamlandi |
| Faz 5+ | Sales Cloud, Helpdesk, Invoice | 📋 Planlanıyor |

---

## Lisans

Bu proje ozel kullanim icin gelistirilmistir.
