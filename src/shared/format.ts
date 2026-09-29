/**
 * Shared formatters. Server-side rendering uses these; they are the reference
 * implementation for how a community is presented.
 */

export type Timestamp = string | number;

/** Normalises the two timestamp shapes the inventory API can return. */
export function toDate(value: Timestamp): Date {
  if (typeof value === 'number') {
    // Legacy import: unix timestamp in seconds.
    return new Date(value * 1000);
  }
  return new Date(value);
}

export function formatRelative(value: Timestamp, now: number = Date.now()): string {
  const then = toDate(value).getTime();
  const minutes = Math.round((now - then) / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.round(hours / 24);
  if (days < 365) return `${days} days ago`;

  return `${Math.round(days / 365)} years ago`;
}

export function formatRate(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString('en-US')}/mo`;
}

export function formatAvailability(units: number): string {
  if (units === 0) return 'Waitlist only';
  if (units === 1) return '1 unit available';
  return `${units} units available`;
}
