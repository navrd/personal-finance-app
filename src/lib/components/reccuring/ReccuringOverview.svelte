<script lang="ts">
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Transaction, TransactionSortOption } from '$lib/types';
	import { getContext } from 'svelte';

	interface ReccuringOverviewProps {
		transactions: Transaction[];
	}

	let { transactions }: ReccuringOverviewProps = $props();

	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let transactionsSortedByDate = $derived.by(() => {
		return sortTransactions(transactions, transactionSortOptions[2].id, transactionSortOptions);
	});

	let reccuringTransactions = $derived(
		transactionsSortedByDate.filter((transaction) => transaction.recurring)
	);
    $inspect(reccuringTransactions)

	let currentDay = $state(new Date(transactions[0].date).toLocaleDateString('en-EN'));
    $inspect(currentDay);
	let paidBills = $derived.by(() => {});
	let upcommingBills = $derived.by(() => {});
	let dueSoonBills = $derived.by(() => {});
</script>

<section class="reccuring-overview">
</section>

<style lang="scss"></style>
