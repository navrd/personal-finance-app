<script lang="ts">
	import { type Transaction } from '$lib/types';
	import TransactionsListItem from './TransactionsListItem.svelte';

	interface TransactionListProps {
		transactions: Transaction[];
		overview?: boolean;
	}

	let { transactions, overview = false }: TransactionListProps = $props();
</script>

<ul class="transactions-list__items">
	{#if !overview}
		<li class="transactions-list__header">
			<div class="transactions-list__category"><p>Recipient/Sender</p></div>

			<div class="transactions-list__category"><p>Category</p></div>
			<div class="transactions-list__category"><p>Transaction Date</p></div>
			<div class="transactions-list__category">Amount</div>
		</li>
	{/if}
	{#each transactions as transaction}
		<TransactionsListItem {transaction} {overview} />
	{/each}
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
