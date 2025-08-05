<script lang="ts">
	import { ArrowRight, Reccuring } from '$lib/assets/images';
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
	let preparedReccuringTransactions: (Transaction & {paid: boolean, dueSoon: boolean})[] = $derived.by(() => {
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

<section class="reccuring-overview">
	<div class="reccuring-overview__header">
		<h2 class="reccuring-overview__title">Reccuring Bills</h2>
		<a class="details" href="/app/reccuring"><span>See Details</span> {@html ArrowRight}</a>
	</div>
	<div class="reccuring-overview__data">
		{#each Object.entries(totals) as [key, total]}
			<div
				class="reccuring-overview__segment"
				class:reccuring-overview__segment_paid={key === 'paid'}
				class:reccuring-overview__segment_due-soon={key === 'dueSoon'}
				class:reccuring-overview__segment_upcoming={key === 'upcoming'}
			>
				<span class="segment__title">{total.title}</span><span class="segment__value"
					>{total.value.toFixed(2).toString().replace('-', '$')}</span
				>
			</div>
		{/each}
	</div>
</section>

<style lang="scss">
	.reccuring-overview {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		@media screen and (min-width: 1024px) {
			height: 100%;
		}
	}
	.reccuring-overview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.reccuring-overview__data {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.reccuring-overview__segment {
		background: var(--color-beige-100);
		padding: 1rem 0.75rem;
		display: flex;
		flex: 1;
		justify-content: space-between;
		border-left: 0.25rem solid chocolate;
		border-radius: 8px;
	}
	.reccuring-overview__segment_paid {
		border-left: 0.25rem solid var(--color-green);
	}
	.reccuring-overview__segment_due-soon {
		border-left: 0.25rem solid var(--color-yellow);
	}
	.reccuring-overview__segment_upcoming {
		border-left: 0.25rem solid var(--color-cyan);
	}
	.segment__title {
		color: var(--color-grey-500);
	}
	.segment__value {
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: bolder;
	}
	.details {
		text-decoration: none;
		display: flex;
		gap: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		align-items: center;
		justify-content: center;
		font-weight: 350;
		font-style: normal;
		* {
			color: currentColor;
			fill: currentColor;
		}
		&:hover {
			color: var(--color-grey-900);
			* {
				color: currentColor;
				fill: currentColor;
			}
		}
	}
</style>
