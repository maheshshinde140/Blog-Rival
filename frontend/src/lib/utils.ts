export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export function getAuthorName(firstName?: string, lastName?: string): string {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  return fullName || 'Unknown author';
}
