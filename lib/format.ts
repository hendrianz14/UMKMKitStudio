export function formatNumberID(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDateID(dateString: string | Date): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use local timezone
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}
