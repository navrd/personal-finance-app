<script lang="ts">
	import { BudgetsDiagram } from '$lib/components';
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Balance, Pot, Transaction, TransactionSortOption } from '$lib/types';
	import { getContext } from 'svelte';

	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let balance: () => Balance = getContext('balance');
	let balanceData = $derived.by<Pick<Balance, 'current' | 'expenses' | 'income'>>(() => {
		return (({ current, expenses, income }) => ({ current, expenses, income }))(balance());
	});

	let pots: () => Pot[] = getContext('pots');
	let nonEmptyPots = $derived.by(() => {
		return pots().filter((pot) => pot.total > 0);
	});
	let totalSavigs = $derived(nonEmptyPots.reduce((acc, { total }) => acc + total, 0));

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

<BudgetsDiagram />
<div class="balance">
	{#each Object.entries(balanceData) as [key, value]}
		<div class="balance-entry">
			<h3 class="balance-entry__title">{key}</h3>
			<p class="balance-entry__value">{value}</p>
		</div>
	{/each}
</div>
<div class="pots">
	<h2 class="pots__total-savings">{totalSavigs}</h2>
	<a href="/app/pots">details</a>
	{#each pots() as pot}
		<div class="pot">
			<h3 class="pot__title">{pot.name}</h3>
			<p class="pot__total">{pot.total}/{pot.target}</p>
		</div>
	{/each}
</div>
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
