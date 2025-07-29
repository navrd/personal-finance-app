<script lang="ts">
	import { BudgetsDiagram, Balance, PotsOverview } from '$lib/components';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Balance as BalanceType, Pot, Transaction, TransactionSortOption } from '$lib/types';
	import { getContext } from 'svelte';

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
		return sortTransactions(transactions(), transactionSortOptions[4].id, transactionSortOptions);
	});
	let reccuringTransactions = $derived(
		transactionsSortedByDate.filter((transaction) => transaction.recurring)
	);
</script>

<svelte:head>
	<title>Personal Finance App - Overview</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>
<h1 class="route-title">Overview</h1>
<div class="overview-grid">
	<div class="overview-grid__balance">
		<Balance {balanceData} />
	</div>
	<div class="overview-grid__pots">
		<PotsOverview {totalSavings} pots={pots()}/>
	</div>
	<div class="overview-grid__budgets">
		<BudgetsDiagram />
	</div>
	<div class="overview-grid__transactions">
		<div class="transactions">
			<h2>Transactions</h2>
			<a href="/app/transactions">details</a>
			<ul class="transactions-list">
				{#each transactionsSortedByDate.slice(0, 5) as transaction}
					<li class="transaction">
						<p>{transaction.name} {transaction.amount} {transaction.date}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="overview-grid__reccuring">
		<div class="transactions">
			<h2>Reccuring Transactions</h2>
			<a href="/app/reccuring">details</a>
			<ul class="transactions-list">
				{#each reccuringTransactions.slice(0, 5) as transaction}
					<li class="transaction">
						<p>{transaction.name} {transaction.amount} {transaction.date}</p>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	.route-title {
		padding: 1.75rem;
		color: var(--grey-900);
		font-size: 2rem;
		line-height: 1.2;
		font-weight: 550;
	}
	.overview-grid {
		padding: 1rem;
		display: grid;
		gap: 1.5rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			grid-template-areas: 'balance' 'pots' 'transactions' 'budgets' 'reccuring';
		}
		@media (min-width: 1024px) {
			grid-template-areas:
				'balance balance balance balance balance'
				'pots pots pots budgets budgets'
				'transactions transactions transactions budgets budgets'
				'transactions transactions transactions reccuring reccuring'
				'transactions transactions transactions reccuring reccuring';
		}
	}

	.overview-grid__balance {
		grid-area: balance;
	}
	.overview-grid__pots {
		grid-area: pots;
	}
	.overview-grid__budgets {
		grid-area: budgets;
	}
	.overview-grid__transactions {
		grid-area: transactions;
	}
	.overview-grid__reccuring {
		grid-area: reccuring;
	}
</style>
