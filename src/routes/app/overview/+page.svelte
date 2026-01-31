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

	let transactionSortOptions: () => TransactionSortOption[] = getContext('transactionSortOptions');

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
		return sortTransactions(
			transactions(),
			transactionSortOptions()[2].id,
			transactionSortOptions()
		);
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
			<h2 class="segment__title">Pots</h2>
			<a class="details" href="/app/pots"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<PotsOverview {totalSavings} pots={pots()} />
	</div>
	<div class="overview-grid__segment overview-grid__segment_budgets">
		<div class="segment__header">
			<h2 class="segment__title">Budgets</h2>
			<a class="details" href="/app/budgets"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<BudgetsOverview />
	</div>
	<div class="overview-grid__segment overview-grid__segment_transactions">
		<div class="segment__header">
			<h2 class="segment__title">Transactions</h2>
			<a class="details" href="/app/reccuring"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<TransactionsOverview transactions={transactionsSortedByDate.slice(0, 5)} />
	</div>
	<div class="overview-grid__segment overview-grid__segment_reccuring">
		<div class="segment__header">
			<h2 class="segment__title">Reccuring Bills</h2>
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
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: bolder;
	}
	.overview-grid {
		display: grid;
		gap: var(--space-xxl);
		@media screen and (min-width: 0px) and (max-width: 1023px) {
			grid-template-areas: 'balance' 'pots' 'transactions' 'budgets' 'reccuring';
			grid-template-columns: 100%;
		}
		@media screen and (min-width: 1024px) {
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
		gap: var(--space-l);
		flex-direction: column;
		background: white;
		border-radius: var(--radius-m);
		padding: var(--space-xxl);
		@media screen and (min-width: 0px) and (max-width: 1023px) {
			max-width: 100%;
			padding: var(--space-m);
			gap: var(--space-m); /* or whatever spacing you want */
		}
		@media screen and (min-width: 1024px) {
			height: 100%;
		}
	}
	.overview-grid__segment_balance {
		grid-area: balance;
		background: transparent;
		padding: 0;
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
	.segment__title {
		font-weight: bolder;
	}
</style>
