<script lang="ts">
	import { type Transaction } from '$lib/types';

	interface TransactionListProps {
		transactions: Transaction[];
	}

	let { transactions }: TransactionListProps = $props();
</script>

<ul class="transactions-list__items">
	{#each transactions as transaction}
		<li class="transactions-list__item">
			<p>{transaction.name} {transaction.amount} {transaction.date}</p>
		</li>
	{/each}
</ul>

<style lang="scss"></style>
