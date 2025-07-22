import { supabase } from "$lib/supabaseClient";
import type { Category, SortOption } from "$lib/types";

export const load = async () => {
    let categories: Pick<Category, 'id' | 'category'>[] = [];
    let sortOptions: Pick<SortOption, 'id' | 'title'>[] = [];
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


    categories = await getCategoriesMinimal();
    sortOptions = await getSortOptions();

    return { categories, sortOptions }
}
