<script lang="ts">
	import type { Transaction } from '$lib/types';
	import TransactionsList from './TransactionsList.svelte';
	interface TransactionsOverviewProps {
		transactions: Transaction[];
	}
	let { transactions }: TransactionsOverviewProps = $props();
</script>

<TransactionsList {transactions} overview />

