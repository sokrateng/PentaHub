import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  Search,
  Plus,
  LayoutGrid,
  List,
  Phone,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { contactsApi } from '@/services/api';
import type { ContactListItem, CreateContactRequest } from '@/types';

function parseTags(tags?: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

interface ContactCardProps {
  contact: ContactListItem;
  onClick: () => void;
}

function ContactCard({ contact, onClick }: ContactCardProps) {
  const tags = parseTags(contact.tags);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:shadow-md hover:border-[hsl(153_60%_40%)] transition-all duration-150 group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
          style={{ backgroundColor: 'hsl(153 60% 33%)' }}
        >
          {contact.companyName.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-[hsl(153_60%_33%)] transition-colors">
            {contact.companyName}
          </h3>
          {contact.contactPersonName && (
            <div className="flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{contact.contactPersonName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1.5 mb-3">
        {contact.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{contact.phone}</span>
          </div>
        )}
        {(contact.city || contact.country) && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              {[contact.city, contact.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

interface ContactRowProps {
  contact: ContactListItem;
  onClick: () => void;
}

function ContactRow({ contact, onClick }: ContactRowProps) {
  const tags = parseTags(contact.tags);

  return (
    <tr
      onClick={onClick}
      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
            style={{ backgroundColor: 'hsl(153 60% 33%)' }}
          >
            {contact.companyName.slice(0, 1).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">{contact.companyName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{contact.contactPersonName ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{contact.email ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{contact.phone ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {[contact.city, contact.country].filter(Boolean).join(', ') || '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-auto">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      </td>
    </tr>
  );
}

const EMPTY_FORM: CreateContactRequest = {
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
};

export function ContactsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateContactRequest>(EMPTY_FORM);

  const { data: contactsResponse, isLoading } = useQuery({
    queryKey: ['contacts', search, city, country],
    queryFn: () =>
      contactsApi.getAll({
        search: search || undefined,
        city: city || undefined,
        country: country || undefined,
        pageSize: 100,
      }),
  });

  const contacts: ContactListItem[] = contactsResponse?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (data: CreateContactRequest) => contactsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    },
  });

  const handleOpenDialog = () => {
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) return;

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
    createMutation.mutate(payload);
  };

  const setField = (field: keyof CreateContactRequest) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'hsl(153 60% 33% / 0.12)' }}
          >
            <Building2 className="w-4.5 h-4.5" style={{ color: 'hsl(153 60% 33%)' }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Kontaklar</h1>
            <p className="text-xs text-muted-foreground">
              {contacts.length} kontak
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex items-center rounded-lg border border-border overflow-hidden"
            style={{ backgroundColor: 'hsl(220 14% 96%)' }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={[
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-label="Kart görünümü"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={[
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              aria-label="Liste görünümü"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={handleOpenDialog}
            className="gap-1.5 text-sm h-9"
            style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
          >
            <Plus className="w-4 h-4" />
            Yeni Kontak
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma adı, kişi, e-posta..."
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Şehir"
          className="h-9 text-sm w-32"
        />
        <Input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Ülke"
          className="h-9 text-sm w-32"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'hsl(153 60% 33%)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'hsl(153 60% 33% / 0.08)' }}
          >
            <Building2 className="w-7 h-7" style={{ color: 'hsl(153 60% 33%)' }} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {search || city || country ? 'Sonuç bulunamadı' : 'Henüz kontak yok'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {search || city || country
              ? 'Farklı filtreler deneyin'
              : 'İlk kontağı eklemek için "+ Yeni Kontak" butonuna tıklayın'}
          </p>
          {!search && !city && !country && (
            <Button
              onClick={handleOpenDialog}
              className="gap-1.5 text-sm h-9"
              style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              Yeni Kontak
            </Button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => navigate(`/contacts/${contact.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Firma</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">İletişim Kişisi</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-posta</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Telefon</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Konum</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Etiketler</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Kontak</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-xs font-medium">
                Firma Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                value={form.companyName}
                onChange={setField('companyName')}
                placeholder="Acme Ltd."
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="contactPersonName" className="text-xs font-medium">İletişim Kişisi</Label>
                <Input
                  id="contactPersonName"
                  value={form.contactPersonName}
                  onChange={setField('contactPersonName')}
                  placeholder="Ahmet Yılmaz"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="info@firma.com"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium">Telefon</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder="+90 212 000 00 00"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mobile" className="text-xs font-medium">Mobil</Label>
                <Input
                  id="mobile"
                  value={form.mobile}
                  onChange={setField('mobile')}
                  placeholder="+90 530 000 00 00"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs font-medium">Web Sitesi</Label>
              <Input
                id="website"
                value={form.website}
                onChange={setField('website')}
                placeholder="https://www.firma.com"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-medium">Adres</Label>
              <Input
                id="address"
                value={form.address}
                onChange={setField('address')}
                placeholder="Atatürk Cad. No:1"
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-medium">Şehir</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={setField('city')}
                  placeholder="İstanbul"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-xs font-medium">Ülke</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={setField('country')}
                  placeholder="Türkiye"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-xs font-medium">Etiketler</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={setField('tags')}
                placeholder="müşteri, partner (virgülle ayırın)"
                className="h-9 text-sm"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-sm"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !form.companyName.trim()}
                className="text-sm gap-1.5"
                style={{ backgroundColor: 'hsl(153 60% 33%)', color: 'white' }}
              >
                {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
