export const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const;
export type TooltipPlacement = (typeof TOOLTIP_PLACEMENTS)[number];

export const TOOLTIP_FALLBACKS: Record<TooltipPlacement, TooltipPlacement[]> = {
    top: ['top', 'bottom', 'left', 'right'],
    bottom: ['bottom', 'top', 'left', 'right'],
    left: ['left', 'right', 'top', 'bottom'],
    right: ['right', 'left', 'top', 'bottom']
};
