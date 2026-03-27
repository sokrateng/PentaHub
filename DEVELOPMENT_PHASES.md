# PentaHub — Geliştirme Fazları Detay

Her faz Claude Code ile bağımsız olarak geliştirilebilir. Her fazın sonunda çalışan bir çıktı olmalıdır.

---

## FAZ 1A — Proje CRUD ve Proje Kanban ⭐ BAŞLANGIÇ

### Amaç
Proje portföyünü yönetebilmek: oluşturma, listeleme, kanban görünümü, proje kartı detay ekranı.

### Backend Görevleri

1. **Solution ve proje yapısını kur**
   - `dotnet new sln`, 4 katman (Domain, Application, Infrastructure, API)
   - NuGet paketleri: `MediatR`, `FluentValidation`, `Microsoft.EntityFrameworkCore.Sqlite`, `Serilog`
   - Referansları ekle (Domain → hiçbiri, Application → Domain, Infrastructure → Application, API → hepsi)

2. **Domain katmanı**
   - `BaseEntity` abstract class
   - `User` entity (basit: Id, FullName, Email, Role, Department, IsActive)
   - `Project` entity (tam şema, DATABASE_SCHEMA.md referans)
   - Enum'lar: `ProjectStatus`, `PrivacyLevel`, `EvaluationFrequency`

3. **Infrastructure katmanı**
   - `PentaHubDbContext` — DbSet'ler, OnModelCreating
   - `ProjectConfiguration` — IEntityTypeConfiguration
   - `UserConfiguration`
   - Seed data: 3-5 örnek kullanıcı, 5-8 örnek proje
   - SQLite connection string: `Data Source=pentahub.db`

4. **Application katmanı**
   - `CreateProjectCommand` + Handler
   - `UpdateProjectCommand` + Handler
   - `DeleteProjectCommand` + Handler (soft delete)
   - `GetProjectByIdQuery` + Handler
   - `GetProjectListQuery` + Handler (filtreleme: status, managerId, search)
   - `GetProjectStatsQuery` + Handler (toplam/aktif/gecikmiş sayıları)
   - AutoMapper profilleri (Entity → DTO)

5. **API katmanı**
   - `POST /api/projects` — Yeni proje oluştur
   - `GET /api/projects` — Proje listesi (query params: status, managerId, search)
   - `GET /api/projects/{id}` — Proje detay
   - `PUT /api/projects/{id}` — Güncelle
   - `DELETE /api/projects/{id}` — Soft delete
   - `GET /api/projects/stats` — Dashboard KPI
   - `GET /api/users` — Kullanıcı listesi (dropdown için)
   - CORS ayarı (localhost:5173 frontend için)
   - Swagger/OpenAPI

### Frontend Görevleri

1. **Proje yapısını kur**
   - Vite + React + TypeScript
   - shadcn/ui init (`npx shadcn@latest init`)
   - Tailwind CSS yapılandırma
   - `theme.css` oluştur (Cloudoffix benzeri yeşil-beyaz tema)
   - React Router v6
   - TanStack Query
   - Zustand (basit store)

2. **Layout**
   - `AppShell`: Sol sidebar + üst header + ana içerik alanı
   - Sidebar: navigasyon linkleri (Projeler, Görevler, Sprintler, Kaynaklar, Dashboard)
   - Header: kullanıcı avatar, bildirim ikonu, arama
   - Cloudoffix'teki gibi koyu sidebar, beyaz içerik alanı

3. **Proje Kanban Ekranı** (`/projects`)
   - 3 kolon: Beklemede, Devam Eden, Tamamlandı
   - Her kolonda proje kartları (isim, müşteri, görev sayısı, yönetici, yıldız)
   - Sürükle-bırak (dnd-kit veya @hello-pangea/dnd)
   - Üstte filtre bar: arama, durum filtresi, "Şablon Olmayanlar" toggle
   - "+ Yeni" butonu → proje oluşturma dialog/modal

4. **Proje Kartı Detay Ekranı** (`/projects/:id`)
   - Üst bölüm: proje başlığı, durum badge, breadcrumb
   - Özet metrikleri (Belgeler, Tasks, Toplantı, Riskler, Kaynak Tahsisi — şimdilik placeholder)
   - Tab yapısı: Ayarlar, Kilometre Taşları, Açıklama, E-postalar, Görev Aşamaları, Hand-over, AI Analysis
   - Ayarlar tab: form alanları (yönetici, gizlilik, müşteri, departman, değerlendirme, fatura)
   - Sağ tarafta kolaborasyon paneli (placeholder — Faz 3A'da doldurulacak)

5. **Proje Listesi Görünümü** (toggle: kanban ↔ liste)
   - Tablo: Proje Adı, Yönetici, Durum, Müşteri, Başlangıç, Bitiş

### Kabul Kriterleri
- [ ] Proje CRUD çalışıyor (API + UI)
- [ ] Kanban board'da projeler sürükle-bırak ile durum değiştirebiliyor
- [ ] Proje kartı detay ekranı tab yapısıyla açılıyor
- [ ] Filtre ve arama çalışıyor
- [ ] Seed data ile anlamlı örnek veriler yükleniyor

---

## FAZ 1B — Görev Yönetimi (Kanban Board)

### Amaç
Proje içindeki görevleri kanban board üzerinde yönetmek.

### Backend Görevleri

1. **Domain**
   - `TaskStage` entity
   - `ProjectTask` entity (tam şema)
   - `Priority` enum
   - Otomatik `TaskNumber` üretimi (T0001, T0002...)

2. **Application**
   - `CreateTaskCommand`, `UpdateTaskCommand`, `MoveTaskStageCommand`
   - `GetTasksByProjectQuery` (kanban view: stage'e göre gruplu)
   - `GetTaskByIdQuery` (detay)
   - `GetBacklogQuery` (sprint'e atanmamış görevler)
   - `ReorderTasksCommand` (kanban sıralama)

3. **API Endpoints**
   - `POST /api/projects/{projectId}/tasks`
   - `GET /api/projects/{projectId}/tasks` (query: stageId, assigneeId, search)
   - `GET /api/tasks/{id}`
   - `PUT /api/tasks/{id}`
   - `PATCH /api/tasks/{id}/stage` (sürükle-bırak stage değişimi)
   - `GET /api/projects/{projectId}/task-stages`
   - Seed: her proje için varsayılan 5 stage oluştur

### Frontend Görevleri

1. **Görev Kanban Board** (`/projects/:id/tasks`)
   - Kolonlar: proje stage'lerine göre dinamik
   - Görev kartı: numara, başlık, atanan (avatar), öncelik yıldızları, faz badge, fatura ikonu, checklist bar
   - Sürükle-bırak ile stage değişimi
   - Kart üzerine tıklayınca detay açılsın (slide-over panel veya modal)
   - Üstte filtre: atanan, öncelik, arama
   - Gruplama: atanana göre, faza göre

2. **Görev Detay Paneli/Sayfası** (`/tasks/:id`)
   - Görev aşama bar (Yapılacak → Analiz → ... → Bitti)
   - Özet metrikleri (alt görevler, toplantı, satış siparişi, aktif, timer)
   - Form alanları: proje, atanan, kilometre taşı, sprint, öncelik, fatura, tarihler, süre
   - Tab'lar: Açıklama, Zaman Çizelgeleri, Kontrol Listesi, Bağımlılıklar, Diğer
   - Sağda kolaborasyon paneli (placeholder)

3. **Görev Oluşturma Formu**
   - Quick-add (kanban üzerinde + butonu)
   - Full form (modal/sayfa)

### Kabul Kriterleri
- [ ] Proje bazlı görev kanban çalışıyor
- [ ] Sürükle-bırak ile stage geçişi yapılabiliyor
- [ ] Görev detay ekranı tab yapısıyla açılıyor
- [ ] Öncelik, atanan, fatura edilebilir bilgileri görev kartında görünüyor
- [ ] Otomatik görev numarası üretiliyor

---

## FAZ 1C — Sprint Yönetimi

### Backend Görevleri

1. **Domain**: `Sprint` entity, `SprintState` enum
2. **Application**:
   - `CreateSprintCommand`, `UpdateSprintCommand`
   - `ChangeSprintStateCommand` (Draft → InProgress → Done)
   - `AssignTaskToSprintCommand`, `RemoveTaskFromSprintCommand`
   - `TransferTasksBetweenSprintsCommand`
   - `GetSprintListQuery`, `GetSprintDetailQuery`

3. **API Endpoints**:
   - `POST /api/sprints`
   - `GET /api/sprints` (query: projectId, state)
   - `GET /api/sprints/{id}`
   - `PUT /api/sprints/{id}`
   - `PATCH /api/sprints/{id}/state`
   - `POST /api/sprints/{id}/assign-task`
   - `POST /api/sprints/{id}/transfer-tasks`

### Frontend Görevleri

1. **Sprint Listesi** (`/sprints`)
   - Tablo: Name, Start Date, End Date, Goal, State, Task Count
   - State badge: Draft (gri), In Progress (yeşil), Done (mavi)

2. **Sprint Detay** (`/sprints/:id`)
   - State bar (Draft → In Progress → Done)
   - Sprint bilgileri: tarihler, hedef, kullanıcılar
   - İçindeki görevler listesi + ilerleme
   - "Add Task" butonu → backlog'dan görev seçimi

3. **Backlog Ekranı** (`/backlog`)
   - Sprint'e atanmamış görevlerin listesi
   - Toplu seçim → sprint'e atama
   - Aksiyon: sprint ekle/çıkar

### Kabul Kriterleri
- [ ] Sprint CRUD çalışıyor
- [ ] Backlog'dan sprint'e görev atanabiliyor
- [ ] Sprint state geçişleri yapılıyor
- [ ] Sprint detayında görevler ve ilerleme görünüyor

---

## FAZ 2A — Gantt Chart ve Bağımlılıklar

### Backend: `TaskDependency`, `TaskChecklist` entity ve CRUD
### Frontend:
- **Gantt Chart** (kütüphane: `frappe-gantt` veya `dhtmlx-gantt` veya custom SVG)
  - Görevler zaman çizgisinde bar olarak
  - Bağımlılık okları
  - İlerleme yüzdesi overlay
  - Hover ile detay tooltip
  - Tıklayınca görev detay
- **Kontrol Listesi** tab'ı: maddeler, atanan, bitti checkbox
- **Bağımlılıklar** tab'ı: bağlı görev listesi, tür seçimi

---

## FAZ 2B — Kaynak Tahsisi

### Backend: `ResourceAllocation` entity ve CRUD, kapasite hesaplama sorguları
### Frontend:
- **Kaynak Takvimi**: haftalık/aylık grid, kişiler satırda, günler kolonda, renkli bloklar
- **Sürükle-bırak tahsis**: proje ve görev seçerek kişiye atama
- **Kaynak Raporu**: kapasite/planlanan/planlanmamış/fatura edilebilir KPI'lar
  - Kaynaklar tabı: kişi bazlı tablo
  - Projeler tabı: proje bazlı tablo

---

## FAZ 2C — Kilometre Taşları ve Time Sheet

### Backend: `Milestone`, `TimeSheet` entity ve CRUD
### Frontend:
- Proje kartında **Kilometre Taşları tab**: fazlar, hedef tarih, görev sayısı, ilerleme bar
- Görev kartında **Timer**: başlat/durdur, otomatik time sheet kaydı
- **Zaman Çizelgeleri tab**: time sheet kayıtları, toplam saat, fatura edilebilir ayrımı

---

## FAZ 3A — Kolaborasyon Paneli

### Backend: `Comment` entity (polymorphic), SignalR hub
### Frontend:
- Sağ panel: kronolojik not/mail/log akışı
- Not ekleme: @mention, doküman eki
- Sistem logları: "Aşama değişti: To Do → Analysis"
- Gerçek zamanlı güncelleme (SignalR)

---

## FAZ 3B — Project Dashboard

### Backend: Aggregate sorgular (toplam danışman, aktif proje, açık görev, gecikmiş vb.)
### Frontend:
- **KPI kartları**: Toplam Danışman, Aktif Proje, Açık Görev, Gecikmiş Görevler (renkli)
- **Grafikler**: Faturalandırılabilir pie, Aşama bar, Departman bar, Risk dağılımı, Sprint statüleri, Yönetici kırılımı
- **Görev ilerleme tablosu**: scrollable
- Kütüphane: Recharts veya Chart.js

---

## FAZ 3C — Kontak/Firma Yönetimi

### Backend: `Contact` entity CRUD
### Frontend:
- Kontak listesi (filtreleme, gruplama)
- 360° Kontak Kartı: sol tarafta firma bilgileri, sağda kolaborasyon
- Tab yapısı: projeler, satışlar, faturalar (placeholder), destek talepleri (placeholder)

---

## FAZ 4 — Authentication ve RBAC

### Backend:
- JWT token üretimi (login endpoint)
- Refresh token mekanizması
- Role-based middleware
- Endpoint bazlı yetkilendirme

### Frontend:
- Login sayfası
- Protected routes
- Kullanıcı context/store
- Rol bazlı UI (admin menüleri, yönetici butonları)

---

## Her Faz İçin Ortak Checklist

- [ ] Backend API çalışıyor ve Swagger'da test edilebilir
- [ ] Frontend ekranları responsive
- [ ] shadcn/ui bileşenleri kullanılmış
- [ ] TypeScript strict, any kullanılmamış
- [ ] Seed data anlamlı ve Cloudoffix örneklerine yakın
- [ ] Hata durumları handle edilmiş (loading, error, empty states)
