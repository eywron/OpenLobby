import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    const distance = formatDistanceToNow(parsedDate, { addSuffix: true });
    
    // Convert to shorter format: "about 2 hours ago" -> "2h ago"
    return distance
      .replace('about ', '')
      .replace('less than a minute ago', 'just now')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch (error) {
    return 'sometime ago';
  }
}

export function formatCount(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  
  const first = parts[0];
  const last = parts[parts.length - 1];
  
  if (!first || !last) return '?';
  
  if (parts.length === 1) return first.substring(0, 2).toUpperCase();
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
