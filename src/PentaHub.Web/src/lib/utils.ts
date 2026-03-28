import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function formatDate(dateStr?: string, style: 'short' | 'long' | 'numeric' = 'short'): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  const options: Intl.DateTimeFormatOptions = style === 'long'
    ? { day: '2-digit', month: 'long', year: 'numeric' }
    : style === 'numeric'
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
}

export function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
}
