import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  ChevronLeft,
  Save,
  Trash2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Smartphone,
  User,
  FolderKanban,
  ShoppingCart,
  FileText,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';
import { contactsApi, projectsApi } from '@/services/api';
import type { CreateContactRequest, ProjectListItem } from '@/types';

type TabId = 'projeler' | 'satislar' | 'faturalar' | 'destek';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'projeler', label: 'Projeler', icon: FolderKanban },
  { id: 'satislar', label: 'Satışlar', icon: ShoppingCart },
  { id: 'faturalar', label: 'Faturalar', icon: FileText },
  { id: 'destek', label: 'Destek', icon: Headphones },
];

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={['h-9 text-sm', Icon ? 'pl-8' : ''].join(' ')}
        />
      </div>
    </div>
  );
}

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const contactId = Number(id);

  const [activeTab, setActiveTab] = useState<TabId>('projeler');
  const [isDirty, setIsDirty] = useState(false);

  const { data: contactResponse, isLoading } = useQuery({
    queryKey: ['contact', contactId],
    queryFn: () => contactsApi.getById(contactId),
    enabled: !!contactId,
  });

  const contact = contactResponse?.data;

  // Form state - initialised from contact
  const [form, setForm] = useState<CreateContactRequest>({
    companyName: '',
    contactPersonName: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    address: '',
    city: '',
    country: '',
    tags: '',
  });

  // Sync form when contact loads
  const [synced, setSynced] = useState(false);
  if (contact && !synced) {
    setForm({
      companyName: contact.companyName ?? '',
      contactPersonName: contact.contactPersonName ?? '',
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      mobile: contact.mobile ?? '',
      website: contact.website ?? '',
      address: contact.address ?? '',
      city: contact.city ?? '',
      country: contact.country ?? '',
      tags: contact.tags ?? '',
    });
    setSynced(true);
  }

  const setField = (field: keyof CreateContactRequest) => (val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setIsDirty(true);
  };

  const updateMutation = useMutation({
    mutationFn: (data: CreateContactRequest) => contactsApi.update(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setIsDirty(false);
      setSynced(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => contactsApi.delete(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      navigate('/contacts');
    },
  });

  // Projects linked to this contact
  const { data: projectsResponse } = useQuery({
    queryKey: ['projects', 'contact', contactId],
    queryFn: () => projectsApi.getAll({ pageSize: 100 }),
    enabled: activeTab === 'projeler',
  });

  const allProjects: ProjectListItem[] = projectsResponse?.data ?? [];
  const linkedProjects = allProjects.filter((p) => p.contactId === contactId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateContactRequest = {
      companyName: form.companyName.trim(),
      contactPersonName: form.contactPersonName?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      mobile: form.mobile?.trim() || undefined,
      website: form.website?.trim() || undefined,
      address: form.address?.trim() || undefined,
      city: form.city?.trim() || undefined,
      country: form.country?.trim() || undefined,
      tags: form.tags?.trim() || undefined,
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'hsl(153 60% 33%)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Kontak bulunamadı</p>
        <Link to="/contacts" className="text-sm text-primary mt-2 hover:underline">
          Kontak listesine dön
        </Link>
      </div>
    );
  }

  const tags = parseTags(form.tags);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          to="/contacts"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Kontaklar
        </Link>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-medium text-foreground">{contact.companyName}</span>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-5 flex-1 min-h-0">
        {/* Left: form + tabs (65%) */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">
          {/* Form card */}
          <form onSubmit={handleSave}>
            <div className="bg-white rounded-xl border border-border p-5">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base"
                    style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                  >
                    {form.companyName.slice(0, 1).toUpperCase() || 'K'}
                  </div>
                  <div>
                    <h2 className="font-semibold text-base text-foreground">
                      {form.companyName || contact.companyName}
                    </h2>
                    {form.contactPersonName && (
                      <p className="text-xs text-muted-foreground">{form.contactPersonName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Kontağı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{contact.companyName}" kontağını silmek istediğinizden emin misiniz? Bu
                          işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate()}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    type="submit"
                    disabled={!isDirty || updateMutation.isPending || !form.companyName.trim()}
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {/* Company section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Firma Bilgileri
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <FormField
                        id="companyName"
                        label="Firma Adı *"
                        value={form.companyName}
                        onChange={setField('companyName')}
                        placeholder="Acme Ltd."
                        icon={Building2}
                      />
                    </div>
                    <FormField
                      id="website"
                      label="Web Sitesi"
                      value={form.website ?? ''}
                      onChange={setField('website')}
                      placeholder="https://www.firma.com"
                      icon={Globe}
                    />
                    <FormField
                      id="address"
                      label="Adres"
                      value={form.address ?? ''}
                      onChange={setField('address')}
                      placeholder="Atatürk Cad. No:1"
                      icon={MapPin}
                    />
                    <FormField
                      id="city"
                      label="Şehir"
                      value={form.city ?? ''}
                      onChange={setField('city')}
                      placeholder="İstanbul"
                    />
                    <FormField
                      id="country"
                      label="Ülke"
                      value={form.country ?? ''}
                      onChange={setField('country')}
                      placeholder="Türkiye"
                    />
                  </div>
                </div>

                {/* Person section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    İletişim Kişisi
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <FormField
                        id="contactPersonName"
                        label="Ad Soyad"
                        value={form.contactPersonName ?? ''}
                        onChange={setField('contactPersonName')}
                        placeholder="Ahmet Yılmaz"
                        icon={User}
                      />
                    </div>
                    <FormField
                      id="email"
                      label="E-posta"
                      type="email"
                      value={form.email ?? ''}
                      onChange={setField('email')}
                      placeholder="ahmet@firma.com"
                      icon={Mail}
                    />
                    <FormField
                      id="phone"
                      label="Telefon"
                      value={form.phone ?? ''}
                      onChange={setField('phone')}
                      placeholder="+90 212 000 00 00"
                      icon={Phone}
                    />
                    <FormField
                      id="mobile"
                      label="Mobil"
                      value={form.mobile ?? ''}
                      onChange={setField('mobile')}
                      placeholder="+90 530 000 00 00"
                      icon={Smartphone}
                    />
                  </div>
                </div>

                {/* Tags section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Etiketler
                  </h3>
                  <FormField
                    id="tags"
                    label="Etiketler (virgülle ayırın)"
                    value={form.tags ?? ''}
                    onChange={setField('tags')}
                    placeholder="müşteri, partner, potansiyel"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="flex border-b border-border px-4 gap-0">
              {TABS.map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                    activeTab === tabId
                      ? 'border-[hsl(153_60%_33%)] text-[hsl(153_60%_33%)]'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === 'projeler' && (
                <div>
                  {linkedProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FolderKanban className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Bu kontakla ilişkili proje bulunamadı
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedProjects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-[hsl(153_60%_40%)] hover:bg-muted/30 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                              style={{ backgroundColor: 'hsl(153 60% 33%)' }}
                            >
                              {project.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{project.name}</p>
                              {project.projectManagerName && (
                                <p className="text-xs text-muted-foreground">
                                  {project.projectManagerName}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.statusText}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'satislar' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Satışlar modülü yakında</p>
                </div>
              )}

              {activeTab === 'faturalar' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Faturalar modülü yakında</p>
                </div>
              )}

              {activeTab === 'destek' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Headphones className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Destek modülü yakında</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: CollaborationPanel (35%) */}
        <div className="w-full md:w-[320px] md:flex-shrink-0 flex">
          <CollaborationPanel entityType="Contact" entityId={contactId} />
        </div>
      </div>
    </div>
  );
}
