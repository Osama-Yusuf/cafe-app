export function fmt(n: number): string {
  if (isNaN(n)) return '0';
  return Math.round(n).toLocaleString('en-US');
}

export function fmtK(n: number): string {
  if (isNaN(n)) return '0';
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 10_000) return Math.round(n / 1_000) + 'K';
  return fmt(n);
}

export function fmtPct(n: number): string {
  return Math.round(n) + '%';
}
