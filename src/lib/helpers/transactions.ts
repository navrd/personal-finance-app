import type { GenericSortConfig, Transaction, TransactionSortOption } from "$lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortByConfig<T extends Record<string, any>>(
    items: T[],
    config: GenericSortConfig
): T[] {
    return [...items].sort((a, b) => {
        const aValue = getNestedValue(a, config.field);
        const bValue = getNestedValue(b, config.field);

        let comparison = 0;

        switch (config.type) {
            case 'string':
                comparison = String(aValue).localeCompare(String(bValue));
                break;
            case 'number':
                comparison = Number(aValue) - Number(bValue);
                break;
            case 'date':
                comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
                break;
            case 'boolean':
                comparison = Number(aValue) - Number(bValue);
                break;
        }

        return config.direction === 'desc' ? -comparison : comparison;
    });
}

// Convert SortOption to GenericSortConfig
export function transactionSortOptionToConfig(
    transactionSortOption: TransactionSortOption
): GenericSortConfig {
    return {
        field: transactionSortOption.field,
        direction: transactionSortOption.direction,
        type: transactionSortOption.type
    };
}
export function sortTransactions(
    transactions: Transaction[],
    sortOptionId: string,
    availableSortOptions: TransactionSortOption[]
): Transaction[] {
    const sortOption = availableSortOptions.find((opt) => opt.id === sortOptionId);

    if (!sortOption) {
        console.warn(`Sort option "${sortOptionId}" not found`);
        return [...transactions];
    }

    return sortByConfig(transactions, transactionSortOptionToConfig(sortOption));
}
