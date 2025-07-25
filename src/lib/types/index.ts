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

export interface SortOption {
    id: string
    title: string
    created_at: string
    updated_at: string
}

export interface PaginationData<T> {
    items: T[];
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalItems: number;
}

export interface TransactionFilters {
    search: string;
    debouncedSearch: string;
    sort: string;
    category: string;
}

export interface TransactionSortOption {
    id: string; // UUID from database
    label: string;
    field: string;
    direction: 'asc' | 'desc';
    type: 'string' | 'number' | 'date' | 'boolean';
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface GenericSortConfig {
    field: string;
    direction: 'asc' | 'desc';
    type: 'string' | 'number' | 'date' | 'boolean';
}

export interface AuthFormError {
    error: string
    email?: string
    fullName?: string
}

export interface SignupFormData {
    full_name: string
    email: string
    password: string
}

export interface LoginFormData {
    email: string
    password: string
}

export interface Pot {
    id: string;
    user_id: string;
    name: string;
    target: number;
    total: number;
    theme: string;
    created_at?: string;
    updated_at?: string;
}

export interface PotError {
    id?: string;
    target?: number;
    name?: string;
    theme?: string;
    message?: string;
}

export interface CreatePotData {
    name: string;
    target: number;
    total: number;
    theme: string;
}


export interface Budget {
    id: string;
    category_id: string;
    user_id: string;
    maximum: number;
    theme: string;
    created_at: string;
    updated_at: string;
}
export interface UpdateBudgetData {
    category_id?: string;
    user_id: string;
    maximum?: number;
    theme?: string;
}

export interface BudgetError {
    category_id?: string;
    maximum?: number;
    theme?: string;
    message?: string;
}