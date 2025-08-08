<script lang="ts">
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { TransactionSortOption, Transaction } from '$lib/types';
	import { getContext } from 'svelte';

	interface ReccuringBillSummaryProps {
		transactions: Transaction[];
	}

	interface ReccuringTotal {
		title: string;
		value: number;
	}

	interface ReccuringBillsTotals {
		paid: ReccuringTotal;
		dueSoon: ReccuringTotal;
		upcoming: ReccuringTotal;
	}

	let { transactions }: ReccuringBillSummaryProps = $props();

	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let transactionsSortedByDate = $derived.by(() => {
		return sortTransactions(transactions, transactionSortOptions[2].id, transactionSortOptions);
	});

	let reccuringTransactions = $derived(
		transactionsSortedByDate.filter((transaction) => transaction.recurring)
	);

	let currentDate = $state(new Date(transactions[0].date));

	const dueSoonCutOffDate = new Date(currentDate);
	dueSoonCutOffDate.setDate(currentDate.getDate() + 5);
	let preparedReccuringTransactions: (Transaction & { paid: boolean; dueSoon: boolean })[] =
		$derived.by(() => {
			return reccuringTransactions.map((transaction) => {
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
	let totals = $derived.by(() => {
		let result: ReccuringBillsTotals = {
			paid: { title: 'Paid', value: 0 },
			upcoming: { title: 'Upcoming', value: 0 },
			dueSoon: { title: 'Due Soon', value: 0 }
		};
		result.paid.value = preparedReccuringTransactions
			.filter((transaction) => transaction.paid)
			.reduce((sum, { amount }) => sum + amount, 0);
		result.dueSoon.value = preparedReccuringTransactions
			.filter((transaction) => transaction.dueSoon)
			.reduce((sum, { amount }) => sum + amount, 0);
		result.upcoming.value = preparedReccuringTransactions
			.filter((transaction) => !transaction.paid)
			.reduce((sum, { amount }) => sum + amount, 0);

		return result;
	});
</script>

<section class="section bills-totals">
	<p class="label">total bills</p>
	<ul class="bills-totals__segments">
		{#each Object.values(totals) as total}
			<li class="bills-totals__segment">
				<span class="segment__title" class:segment__title_due-soon={total.title === 'Due Soon'}
					>{total.title}</span
				><span class="segment__value" class:segment__value_due-soon={total.title === 'Due Soon'}
					>{total.value.toFixed(2).toString().replace('-', '$')}</span
				>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	.section {
		background: white;
		border-radius: 0.75rem;
	}
	.bills-totals {
		text-transform: capitalize;
		padding: 1.25rem;
		@media screen and (max-width: 1023px) {
			flex: 1;
		}
	}
	.label {
		font-size: 0.875rem;
		line-height: 1.5;
	}
	.bills-totals__segments {
		display: flex;
		flex-direction: column;
	}
	.bills-totals__segment {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--color-grey-100);
		padding: 1rem 0;
		&:last-child {
			border-bottom: none;
		}
	}
	.segment__title {
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.segment__value {
		font-size: 0.75rem;
		color: var(--color-grey-900);
	}
	.segment__value_due-soon,
	.segment__title_due-soon {
		color: var(--color-red);
	}
</style>
