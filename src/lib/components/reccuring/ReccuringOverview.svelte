<script lang="ts">
	import { sortTransactions } from '$lib/helpers/transactions';
	import type { Transaction, TransactionSortOption } from '$lib/types';
	import { getContext } from 'svelte';

	interface ReccuringOverviewProps {
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

	let { transactions }: ReccuringOverviewProps = $props();

	let transactionSortOptions: () => TransactionSortOption[] = getContext('transactionSortOptions');

	let transactionsSortedByDate = $derived.by(() => {
		return sortTransactions(transactions, transactionSortOptions()[2].id, transactionSortOptions());
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
			dueSoon: { title: 'Due Soon', value: 0 },
			upcoming: { title: 'Upcoming', value: 0 }
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

<div class="segment__data">
	{#each Object.entries(totals) as [key, total]}
		<div
			class="segment__particle"
			class:segment__particle_paid={key === 'paid'}
			class:segment__particle_due-soon={key === 'dueSoon'}
			class:segment__particle_upcoming={key === 'upcoming'}
		>
			<span class="segment__title">{total.title}</span><span class="segment__value"
				>{total.value.toFixed(2).toString().replace('-', '$')}</span
			>
		</div>
	{/each}
</div>

<style lang="scss">
	.segment__data {
		display: flex;
		flex-direction: column;
		gap: var(--gap-m);
	}
	.segment__particle {
		background: var(--color-beige-100);
		padding: var(--padding-l) var(--padding-m);
		display: flex;
		flex: 1;
		justify-content: space-between;
		border-left: var(--regular-border-chocolate);
		border-radius: 8px;
	}
	.segment__particle_paid {
		border-left: var(--regular-border-green);
	}
	.segment__particle_due-soon {
		border-left: var(--regular-border-yellow);
	}
	.segment__particle_upcoming {
		border-left: var(--regular-border-cyan);
	}
	.segment__title {
		color: var(--color-grey-500);
	}
	.segment__value {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		font-weight: bolder;
	}
</style>
