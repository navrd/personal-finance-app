import { Home, Pots, Reccuring, Transactions, Budgets } from '$lib/assets/images';
export interface NavLinkProps {
    href: string;
    minimize: boolean;
    title: string;
}

export type StateWrapper<T> = {
    value: T;
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
    category_id: string;
    date: string;
    amount: number;
    recurring: boolean;
}

export type CategorisedTransactions = Record<string, Transaction[]>;

export interface Category {
    id: string
    category: string
    created_at: string
}
export interface SupabaseResponse<T> {
    data: T | null
    error: Error | null
}

export interface Balance {
    id: string
    user_id: string
    current: number
    income: number
    expenses: number
    created_at: string
    updated_at: string
}

export interface BalanceUpdate {
    current?: number
    income?: number
    expenses?: number
}