import type { Category, TransactionSortOption, Transaction, Balance, Pot, Budget, ColorTheme } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies, depends }) => {
    const { session } = await safeGetSession();

    async function fetchColorThemes(): Promise<ColorTheme[]> {
        try {
            const { data, error } = await supabase
                .from('colors')
                .select('*')
            if (error) {
                console.error('Error fetching color themes:', error);
                return [];
            }
            return data || [];
        } catch (err: unknown) {
            console.error('Failed to get color themes:', err);
            throw err;
        }
    }

    async function fetchCategoriesMinimal(): Promise<Pick<Category, 'id' | 'category'>[]> {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, category')
                .order('category', { ascending: true });
            if (error) {
                console.error('Error fetching categories:', error);
                return [];
            }
            return data || [];
        } catch (err: unknown) {
            console.error('Failed to get categories:', err);
            throw err;
        }
    }

    async function fetchTransactionSortOptions(): Promise<TransactionSortOption[]> {
        try {
            const { data, error } = await supabase
                .from('transactions_sort_options')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw new Error(`Failed to fetch sort options: ${error.message}`);
            }

            return data || [];
        } catch (err: unknown) {
            console.error('Failed to get transactions sort options:', err);
            throw err;
        }
    }

    async function fetchUserTransactions(): Promise<Transaction[]> {
        try {
            const { data, error } = await supabase.from('transactions').select('*');

            if (error) {
                console.error('Error fetching transactions:', error.message);
            }

            return data || [];
        } catch (err: unknown) {
            console.error('Fetch user transactions error:', err);
            throw err;
        }
    }

    async function fetchUserBalance(): Promise<Balance> {
        try {
            const { data, error } = await supabase
                .from('balance')
                .select('current, income, expenses, id')
                .single();

            if (error) {
                console.error('Error fetching balance:', error);
            }
            return data || null;
        } catch (err) {
            console.error('Unexpected error:', err);
            throw err;
        }
    }

    async function fetchPots(): Promise<Pot[]> {
        depends('app:pots')
        try {

            const { data, error: fetchError } = await supabase
                .from('pots')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            return data || [];
        } catch (err) {
            console.error('Error fetching pots:', err);
            throw err;
        }
    }

    async function fetchBudgets(): Promise<Budget[]> {
        depends('app:budgets')
        try {
            const { data, error } = await supabase
                .from('budgets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching budgets:', err);
            throw err;
        }
    }


    return {
        session,
        cookies: cookies.getAll(),
        categories: await fetchCategoriesMinimal(),
        transactionSortOptions: await fetchTransactionSortOptions(),
        transactions: await fetchUserTransactions(),
        balance: await fetchUserBalance(),
        pots: await fetchPots(),
        budgets: await fetchBudgets(), 
        themes: await fetchColorThemes(),
    };
};


