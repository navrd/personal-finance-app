import { Home, Pots, Reccuring, Transactions, Budgets } from '$lib/assets/images';
export interface NavLinkProps {
    href: string;
    minimize: boolean;
    title: string;
}

export interface BooleanContextValue {
    value: boolean;
}
export const titleToIcon: Record<string, string> = {
    overview: Home,
    pots: Pots,
    budgets: Budgets,
    reccuring: Reccuring,
    transactions: Transactions
};

export interface Transaction {
    avatar: string;
    name: string;
    category: string;
    date: string;
    amount: number;
    recurring: boolean;
}

export type CategorisedTransactions = Record<string, Transaction[]>;