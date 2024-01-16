// ex) 20210101 -> 2021-01-01
export function formatDate(date: string): string {
  return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8);
}
