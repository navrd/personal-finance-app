

export function getById<T extends { id: string }>(items: T[], id: string): T | null {
  return items.find(item => item.id === id) ?? null;
}