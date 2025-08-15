<script lang="ts">
	import { FilterIcon, SortIcon } from '$lib/assets/images';
	import { TransactionsList, TransactionsPagination } from '$lib/components';
	import DropdownFilter from '$lib/components/DropdownFilter.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import Spacer from '$lib/components/utility/Spacer.svelte';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type {
		Category,
		PaginationData,
		Transaction,
		TransactionFilters,
		TransactionSortOption
	} from '$lib/types';
	import { getContext } from 'svelte';

	let transactions: () => Transaction[] = getContext('transactions');
	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');
	let currentPage = $state(1);
	let pageSize = $state(10);
	let innerWidth = $state(0);

	let filters: TransactionFilters = $state({
		search: '',
		debouncedSearch: '',
		sort: transactionSortOptions[4].id,
		category: 'All'
	});

	let debounceTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			filters.debouncedSearch = filters.search;
		}, 300);
	});

	let filteredTransactions = $derived.by(() => {
		return transactions().filter((transaction) => {
			let searchFlag =
				filters.search === ''
					? true
					: [transaction.name, transaction.amount.toFixed(2)].some((field) =>
							field?.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase())
						);

			let categoryFlag =
				filters.category === 'All' ? true : transaction.category_id === filters.category;

			return searchFlag && categoryFlag;
		});
	});

	let sortedTransactions = $derived.by(() => {
		let sorted = [...filteredTransactions];
		if (filters.sort && transactionSortOptions.length > 0) {
			return sortTransactions(sorted, filters.sort, transactionSortOptions);
		} else return sorted;
	});
	const paginationData: PaginationData<Transaction> = $derived.by(() => {
		const totalPages = Math.ceil(sortedTransactions.length / pageSize);
		const startIndex = (currentPage - 1) * pageSize;
		const items = sortedTransactions.slice(startIndex, startIndex + pageSize);
		return {
			items,
			totalPages,
			currentPage,
			hasNext: currentPage < totalPages,
			hasPrev: currentPage > 1,
			totalItems: transactions().length
		};
	});
	function nextPage() {
		if (paginationData.hasNext) {
			currentPage++;
		}
	}

	function prevPage() {
		if (paginationData.hasPrev) {
			currentPage--;
		}
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= paginationData.totalPages) {
			currentPage = page;
		}
	}
</script>

<svelte:head>
	<title>Personal Finance App - Transactions</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<svelte:window bind:innerWidth />

<header class="page-header">
	<h2 class="page-header__title">Transactions</h2>
</header>

<section class="section transactions-list">
	<div class="transactions-list__filters">
		<div class="transactions-list__filter">
			<SearchInput bind:value={filters.search} />
		</div>
		<Spacer />
		<div class="transactions-list__filter">
			<DropdownFilter
				options={transactionSortOptions}
				valueKey="id"
				labelKey="label"
				label="Sort By"
				bind:selected={filters.sort}
				icon={FilterIcon}
			/>
		</div>
		<div class="transactions-list__filter">
			<DropdownFilter
				options={categories}
				valueKey="id"
				labelKey="category"
				bind:selected={filters.category}
				label="Filter By"
				defaultValue={true}
				icon={SortIcon}
			/>
		</div>
	</div>
	<TransactionsList transactions={paginationData.items} overview={innerWidth <= 649} />
	<TransactionsPagination {paginationData} {prevPage} {nextPage} {goToPage} />
</section>

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 53px;
	}
	.page-header__title {
		color: var(--color-grey-900);
		font-size: 2rem;
		line-height: 1.2;
		font-weight: 550;
	}
	.section {
		padding: 1.25rem;
	}
	.transactions-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.transactions-list__filters {
		display: flex;
		gap: 0.75rem;
	}
	.transactions-list__filter {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		line-height: 1.5;
		gap: 0.75rem;
	}
</style>
