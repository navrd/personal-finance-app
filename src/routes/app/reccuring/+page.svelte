<script lang="ts">
	import { SortIcon } from '$lib/assets/images';
	import DropdownFilter from '$lib/components/DropdownFilter.svelte';
	import ReccuringBillsSummary from '$lib/components/reccuring/ReccuringBillsSummary.svelte';
	import ReccuringBillsTotals from '$lib/components/reccuring/ReccuringBillsTotals.svelte';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import { TransactionsList, TransactionsPagination}  from '$lib/components';
	import Spacer from '$lib/components/utility/Spacer.svelte';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type {
		PaginationData,
		Transaction,
		TransactionFilters,
		TransactionSortOption
	} from '$lib/types';
	import { getContext } from 'svelte';

	let transactions: () => Transaction[] = getContext('transactions');
	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');
	let currentPage = $state(1);
	let pageSize = $state(10);

	let filters: Omit<TransactionFilters, 'category'> = $state({
		search: '',
		debouncedSearch: '',
		sort: transactionSortOptions[2].id
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

	let totalBills = $derived(
		transactions()
			.filter((transaction) => transaction.recurring)
			.reduce((sum, { amount }) => sum + amount, 0)
	);

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
	<section class="bills">
		<ReccuringBillsTotals {totalBills} />
		<ReccuringBillsSummary transactions={transactions()} />
	</section>
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
					icon={SortIcon}
				/>
			</div>
		</div>

		<TransactionsList transactions={paginationData.items} reccuring />
		<TransactionsPagination {paginationData} {prevPage} {nextPage} {goToPage} />
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
			grid-template-areas: 'bills bills' 'transactions transactions';
		}
		@media (min-width: 1024px) {
			height: 100%;
			grid-template-areas:
				'bills transactions transactions'
				'bills transactions transactions';
		}
	}
	.section {
		background: white;
		border-radius: 0.75rem;
	}
	.bills {
		grid-area: bills;
		display: flex;
		gap: 1.5rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			flex-direction: row;
		}
		@media (min-width: 1024px) {
			flex-direction: column;
		}
	}

	.transactions-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem 1.25rem;
		grid-area: transactions;
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
