import { supabase } from "$lib/supabaseClient";
import type { Category } from "$lib/types";

export const load = async () => {
    const { data } = await supabase.from("instruments").select();
    let categories: Pick<Category, 'id' | 'category'>[] = [];
    async function getCategoriesMinimal(): Promise<Pick<Category, 'id' | 'category'>[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('id, category')
            .order('category', { ascending: true })
        if (error) {
            console.error('Error fetching categories:', error)
            return []
        }
        return data
    }

    categories = await getCategoriesMinimal();
    const instruments = data;
    return { instruments, categories }
}
