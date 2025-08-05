<script lang="ts">
	import TransactionsList from '$lib/components/transactions/TransactionsList.svelte';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type {
		PaginationData,
		StateWrapper,
		Transaction,
		TransactionFilters,
		TransactionSortOption
	} from '$lib/types';
	import { getContext } from 'svelte';

	let { children } = $props();

	let transactions: () => Transaction[] = getContext('transactions');
	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');
	let currentPage = $state(1);
	let pageSize = $state(10);

	let filters: Omit<TransactionFilters, 'category'> = $state({
		search: '',
		debouncedSearch: '',
		sort: transactionSortOptions[4].id
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
			let reccuringFlag = transaction.recurring === true;

			return searchFlag && reccuringFlag;
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
			totalItems: transactions.length
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
	<title>Personal Finance App - Reccuring Transactions</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Reccuring bills</h2>
</header>

<div class="reccuring-grid">
	<section class="total-bills">total bills</section>
	<section class="reccuring-summary">summary</section>
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
		</div>
		<TransactionsList transactions={paginationData.items} reccuring />
		<button onclick={prevPage}>prev</button>
		{#each Array.from({ length: paginationData.totalPages }, (_, i) => i + 1) as page}
			<button onclick={() => goToPage(page)}>{page}</button>
		{/each}
		<button onclick={nextPage}>next</button>
	</section>
</div>

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
	.reccuring-grid {
		display: grid;
		gap: 1.5rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			grid-template-areas: 'totals summary' 'transactions transactions';
		}
		@media (min-width: 1024px) {
			height: 100%;
			grid-template-areas:
				'totals transactions'
				'summary transactions';
		}
	}
	.total-bills {
		grid-area: totals;
	}
	.reccuring-summary {
		grid-area: summary;
	}
	.transactions-list {
		grid-area: transactions;
	}
</style>
