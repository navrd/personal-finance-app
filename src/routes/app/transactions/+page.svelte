<script lang="ts">
	import { sortTransactions } from '$lib/helpers/transactions';
	import type {
		Category,
		PaginationData,
		StateWrapper,
		Transaction,
		TransactionFilters,
		TransactionSortOption
	} from '$lib/types';
	import { getContext } from 'svelte';

	let { children } = $props();

	let transactions: StateWrapper<Transaction[]> = getContext('transactions');
	let categories: StateWrapper<Pick<Category, 'id' | 'category'>[]> = getContext('categories');
	let transactionSortOptions: StateWrapper<TransactionSortOption[]> =
		getContext('transactionSortOptions');
	let currentPage = $state(1);
	let pageSize = $state(10);

	let filters: TransactionFilters = $state({
		search: '',
		debouncedSearch: '',
		sort: transactionSortOptions.value[4].id,
		category: 'all'
	});

	let debounceTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			filters.debouncedSearch = filters.search;
		}, 300);
	});

	let filteredTransactions = $derived.by(() => {
		return transactions.value.filter((transaction) => {
			let searchFlag =
				filters.search === ''
					? true
					: [transaction.name, transaction.amount.toFixed(2)].some((field) =>
							field?.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase())
						);

			let categoryFlag =
				filters.category === 'all' ? true : transaction.category_id === filters.category;

			return searchFlag && categoryFlag;
		});
	});
    
	let sortedTransactions = $derived.by(() => {
		let sorted = [...filteredTransactions];
		if (filters.sort && transactionSortOptions.value.length > 0) {
			return sortTransactions(sorted, filters.sort, transactionSortOptions.value);
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
			totalItems: transactions.value.length
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

<section class="transactions-list">
	<div class="transactions-list__filters">
		<div class="transactions-list__filter">
			<input type="text" bind:value={filters.search} />
		</div>
		<div class="transactions-list__filter">
			<select bind:value={filters.sort}
				>{#each transactionSortOptions.value as sortOption}
					<option value={sortOption.id}>{sortOption.label}</option>
				{/each}</select
			>
		</div>
		<div class="transactions-list__filter">
			<select bind:value={filters.category}>
				<option value="all">all</option>{#each categories.value as category}
					<option value={category.id}>{category.category}</option>
				{/each}</select
			>
		</div>
	</div>
	<ul class="transactions-list__items">
		{#each paginationData.items as transaction}
			<li class="transactions-list__item">
				<p>{transaction.name} {transaction.amount} {transaction.date}</p>
			</li>
		{/each}
	</ul>
	<button onclick={prevPage}>prev</button>
	{#each Array.from({ length: paginationData.totalPages }, (_, i) => i + 1) as page}
		<button onclick={() => goToPage(page)}>{page}</button>
	{/each}
	<button onclick={nextPage}>next</button>
</section>

{@render children?.()}
