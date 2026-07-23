

export function getById<T extends { id: string }>(items: T[], id: string): T | null {
  return items.find(item => item.id === id) ?? null;
}


export function computeAlignedPosition(
  trigger: DOMRect,
  menu: DOMRect,
  p: 'top' | 'bottom' | 'left' | 'right',
  align: "start" | "end",
  offset: number,
): { x: number; y: number } {
  switch (p) {
    case 'top':
      return {
        x: align === 'end' ? trigger.right - menu.width : trigger.left,
        y: trigger.top - menu.height - offset
      };
    case 'bottom':
      return {
        x: align === 'end' ? trigger.right - menu.width : trigger.left,
        y: trigger.bottom + offset
      };
    case 'left':
      return {
        x: trigger.left - menu.width - offset,
        y: align === 'end' ? trigger.bottom - menu.height : trigger.top
      };
    case 'right':
      return {
        x: trigger.right + offset,
        y: align === 'end' ? trigger.bottom - menu.height : trigger.top
      };
  }
}

export function fitsInViewport(pos: { x: number; y: number }, size: DOMRect): boolean {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return pos.x >= 0 && pos.y >= 0 && pos.x + size.width <= vw && pos.y + size.height <= vh;
}

export function clamp(pos: { x: number; y: number }, size: DOMRect, margin = 6) {
  return {
    x: Math.max(margin, Math.min(pos.x, window.innerWidth - size.width - margin)),
    y: Math.max(margin, Math.min(pos.y, window.innerHeight - size.height - margin))
  };
}