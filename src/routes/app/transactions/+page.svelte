<script lang="ts">
	import { TransactionsList } from '$lib/components';
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

	let filters: TransactionFilters = $state({
		search: '',
		debouncedSearch: '',
		sort: transactionSortOptions[4].id,
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
		return transactions().filter((transaction) => {
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

<header class="page-header">
	<h2 class="page-header__title">Transactions</h2>
</header>

<section class="transactions-list">
	<div class="transactions-list__filters">
		<div class="transactions-list__filter">
			<input type="text" bind:value={filters.search} />
		</div>
		<div class="transactions-list__filter">
			<select bind:value={filters.sort}
				>{#each transactionSortOptions as sortOption}
					<option value={sortOption.id}>{sortOption.label}</option>
				{/each}</select
			>
		</div>
		<div class="transactions-list__filter">
			<select bind:value={filters.category}>
				<option value="all">all</option>{#each categories as category}
					<option value={category.id}>{category.category}</option>
				{/each}</select
			>
		</div>
	</div>
	<TransactionsList transactions={paginationData.items} />
	<button onclick={prevPage}>prev</button>
	{#each Array.from({ length: paginationData.totalPages }, (_, i) => i + 1) as page}
		<button onclick={() => goToPage(page)}>{page}</button>
	{/each}
	<button onclick={nextPage}>next</button>
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
</style>
