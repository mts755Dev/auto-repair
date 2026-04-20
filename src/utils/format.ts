import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export function combineDateTime(date: string, time: string): string {
  const parsed = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm', true);
  if (parsed.isValid()) return parsed.toISOString();
  return dayjs(`${date}T${time}:00`).toISOString();
}

export function formatCurrency(value: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value.toFixed(0)}`;
  }
}

export function formatDate(iso: string) {
  return dayjs(iso).format('MMM D, YYYY');
}

export function formatDateTime(iso: string) {
  return dayjs(iso).format('MMM D, YYYY · h:mm A');
}

export function formatTime(iso: string) {
  return dayjs(iso).format('h:mm A');
}

export function formatRelative(iso: string) {
  return dayjs(iso).fromNow();
}

export function distanceBetween(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export function formatDistance(miles: number) {
  if (miles < 0.1) return '<0.1 mi';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export function hashPassword(pw: string) {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    hash = (hash << 5) - hash + pw.charCodeAt(i);
    hash |= 0;
  }
  return `h${hash.toString(36)}`;
}
