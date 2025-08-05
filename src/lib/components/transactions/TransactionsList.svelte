<script lang="ts">
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Transaction, TransactionSortOption } from '$lib/types';
	import { getContext } from 'svelte';
	import TransactionsListItem from './TransactionsListItem.svelte';

	interface TransactionListProps {
		transactions: Transaction[];
		overview?: boolean;
		reccuring?: boolean;
	}

	let { transactions, overview = false, reccuring = false }: TransactionListProps = $props();

	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let currentDate = $state(
		new Date(
			sortTransactions(transactions, transactionSortOptions[2].id, transactionSortOptions)[0].date
		)
	);

	const dueSoonCutOffDate = new Date(currentDate);
	dueSoonCutOffDate.setDate(currentDate.getDate() + 5);
	let preparedReccuringTransactions: (Transaction & { paid: boolean; dueSoon: boolean })[] =
		$derived.by(() => {
			return transactions.map((transaction) => {
				const transactionDate = new Date(transaction.date);
				const paid = transactionDate.getDate() < currentDate.getDate();
				const dueSoon = !paid && transactionDate.getDate() <= dueSoonCutOffDate.getDate();

				return {
					...transaction,
					paid,
					dueSoon
				};
			});
		});
	$inspect(preparedReccuringTransactions, currentDate);
</script>

<ul class="transactions-list__items">
	{#if !overview}
		<li class="transactions-list__header">
			<div class="transactions-list__category">
				<p>{reccuring ? 'Bill Title' : 'Recipient/Sender'}</p>
			</div>

			{#if !reccuring}<div class="transactions-list__category"><p>Category</p></div>{/if}
			<div class="transactions-list__category">
				<p>{reccuring ? 'Due Date' : 'Transaction Date'}</p>
			</div>
			<div class="transactions-list__category">Amount</div>
		</li>
	{/if}
	{#if reccuring}
		{#each preparedReccuringTransactions as transaction}
			<TransactionsListItem
				{transaction}
				{overview}
				{reccuring}
				paid={transaction.paid}
				dueSoon={transaction.dueSoon}
			/>
		{/each}
	{:else}
		{#each transactions as transaction}
			<TransactionsListItem {transaction} {overview} {reccuring} />
		{/each}
	{/if}
</ul>

<style lang="scss">
	.transactions-list__items {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.transactions-list__header {
		display: flex;
		align-items: center;
	}
	.transactions-list__category {
		display: flex;
		padding-block: 0.75rem;
		border-bottom: 1px solid var(--color-grey-100);
		color: var(--color-grey-500);
		font-size: 0.75rem;
		line-height: 1.5;
		flex: 1;
		&:first-child {
			flex: 4;
		}
		&:last-child {
			align-items: flex-end;
			justify-content: flex-end;
		}
	}
</style>
