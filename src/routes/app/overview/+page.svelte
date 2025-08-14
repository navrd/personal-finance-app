<script lang="ts">
	import { ArrowRight } from '$lib/assets/images';
	import { BudgetsOverview, Balance, PotsOverview } from '$lib/components';
	import ReccuringOverview from '$lib/components/reccuring/ReccuringOverview.svelte';
	import TransactionsOverview from '$lib/components/transactions/TransactionsOverview.svelte';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Balance as BalanceType, Pot, Transaction, TransactionSortOption } from '$lib/types';
	import { getContext, type Component } from 'svelte';

	interface Overview {
		title: string;
		component: Component<any>;
	}

	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let balance: () => BalanceType = getContext('balance');
	let balanceData = $derived.by<Pick<BalanceType, 'current' | 'expenses' | 'income'>>(() => {
		return (({ current, expenses, income }) => ({ current, expenses, income }))(balance());
	});

	let pots: () => Pot[] = getContext('pots');
	let nonEmptyPots = $derived.by(() => {
		return pots().filter((pot) => pot.total > 0);
	});
	let totalSavings = $derived(nonEmptyPots.reduce((acc, { total }) => acc + total, 0));

	let transactions: () => Transaction[] = getContext('transactions');
	let transactionsSortedByDate = $derived.by(() => {
		return sortTransactions(transactions(), transactionSortOptions[2].id, transactionSortOptions);
	});

	let overviews: Overview[] = [{ title: 'balance', component: Balance }];
</script>

<svelte:head>
	<title>Personal Finance App - Overview</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Overview</h2>
</header>

<div class="overview-grid">
	<div class="overview-grid__segment overview-grid__segment_balance">
		<Balance {balanceData} />
	</div>
	<div class="overview-grid__segment overview-grid__segment_pots">
		<div class="segment__header">
			<h2 class="segment_title">Pots</h2>
			<a class="details" href="/app/pots"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<PotsOverview {totalSavings} pots={pots()} />
	</div>
	<div class="overview-grid__segment overview-grid__segment_budgets">
		<div class="segment__header">
			<h2 class="segment_title">Budgets</h2>
			<a class="details" href="/app/budgets"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<BudgetsOverview />
	</div>
	<div class="overview-grid__segment overview-grid__segment_transactions">
		<div class="segment__header">
			<h2 class="segment_title">Transactions</h2>
			<a class="details" href="/app/reccuring"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<TransactionsOverview transactions={transactionsSortedByDate.slice(0, 5)} />
	</div>
	<div class="overview-grid__segment overview-grid__segment_reccuring">
		<div class="segment__header">
			<h2 class="segment_title">Reccuring Bills</h2>
			<a class="details" href="/app/reccuring"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<ReccuringOverview transactions={transactions()} />
	</div>
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
	.overview-grid {
		display: grid;
		gap: 1.5rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			grid-template-areas: 'balance' 'pots' 'transactions' 'budgets' 'reccuring';
		}
		@media (min-width: 1024px) {
			height: 100%;
			grid-template-areas:
				'balance balance balance balance balance'
				'pots pots pots budgets budgets'
				'transactions transactions transactions budgets budgets'
				'transactions transactions transactions reccuring reccuring'
				'transactions transactions transactions reccuring reccuring';
			grid-template-columns: repeat(5, 1fr);
		}
	}
	.overview-grid__segment {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		@media screen and (min-width: 1024px) {
			height: 100%;
		}
	}
	.overview-grid__segment_balance {
		grid-area: balance;
	}
	.overview-grid__segment_pots {
		grid-area: pots;
	}
	.overview-grid__segment_budgets {
		grid-area: budgets;
	}
	.overview-grid__segment_transactions {
		grid-area: transactions;
	}
	.overview-grid__segment_reccuring {
		grid-area: reccuring;
	}

	.segment__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.details {
		text-decoration: none;
		display: flex;
		gap: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		align-items: center;
		justify-content: center;
		font-weight: 350;
		font-style: normal;
		* {
			color: currentColor;
			fill: currentColor;
		}
		&:hover {
			color: var(--color-grey-900);
			* {
				color: currentColor;
				fill: currentColor;
			}
		}
	}
</style>
