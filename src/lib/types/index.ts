import { Home, Pots, Reccuring, Transactions, Budgets } from '$lib/assets/images';
export interface NavLinkProps {
    href: string;
    minimize: boolean;
    title: string;
}

export const titleToIcon: Record<string, string> = {
    overview: Home,
    pots: Pots,
    budgets: Budgets,
    reccuring: Reccuring,
    transactions: Transactions
};