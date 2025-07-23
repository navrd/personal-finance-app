import { supabase } from "$lib/supabaseClient";
import type { Category, SortOption, TransactionSortOption } from "$lib/types";

export const load = async () => {
    let categories: Pick<Category, 'id' | 'category'>[] = [];
    let sortOptions: Pick<SortOption, 'id' | 'title'>[] = [];
    let transactionSortOptions: TransactionSortOption[] = [];
    async function getCategoriesMinimal(): Promise<Pick<Category, 'id' | 'category'>[]> {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, category')
                .order('category', { ascending: true })
            if (error) {
                console.error('Error fetching categories:', error)
                return []
            }
            return data || []
        } catch (error) {
            console.error('Failed to get categories:', error);
            throw error;
        }
    }
    async function getSortOptions(): Promise<Pick<SortOption, 'id' | 'title'>[]> {
        try {
            const { data, error } = await supabase
                .from('sort_options')
                .select('id, title')
                .order('title', { ascending: true });

            if (error) {
                console.error('Error fetching sort options:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Failed to get sort options:', error);
            throw error;
        }
    }

    async function getTransactionSortOptions(): Promise<TransactionSortOption[]> {
        try {
            const { data, error } = await supabase
                .from('transactions_sort_options')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                throw new Error(`Failed to fetch sort options: ${error.message}`);
            }

            return data || []
        } catch (error) {
            console.error('Failed to get transactions sort options:', error);
            throw error;
        }
    }


    categories = await getCategoriesMinimal();
    sortOptions = await getSortOptions();
    transactionSortOptions = await getTransactionSortOptions();

    return { categories, sortOptions, transactionSortOptions }
}
