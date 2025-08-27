import type { Category } from "$lib/types";

export function getCategoryById(categories: Pick<Category, 'id' | 'category'>[], id: string) {
    const category = categories.find((category) => category.id === id);
    if (category) {
        return category
    } else return null;
}