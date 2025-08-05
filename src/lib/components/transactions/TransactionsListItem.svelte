<script lang="ts">
	import type { Category, Transaction } from '$lib/types';
	import { getCategoryById } from '$lib/helpers/categories';
	import { getContext } from 'svelte';

	interface TransactionsListItemProps {
		transaction: Transaction;
		overview?: boolean;
		reccuring?: boolean;
		dueSoon?: boolean;
		paid?: boolean;
	}

	let {
		transaction,
		overview = false,
		reccuring = false,
		paid = false,
		dueSoon = false
	}: TransactionsListItemProps = $props();
	$inspect(paid, dueSoon);
	const formatDate = (dateString: string): string => {
		let date = new Date(dateString);
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		const day = String(date.getDate()).padStart(2, '0');
		const month = months[date.getMonth()];
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	};

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
</script>

<li class="transactions-list__item">
	<div class="transactions-list__category">
		<p class="transaction-creds">
			{#await import(`../../${transaction.avatar}`) then { default: src }}
				<img class="avatar" {src} alt={transaction.name} />
			{/await}
			<span>{transaction.name}</span>
		</p>
	</div>
	{#if !overview}
		{#if !reccuring}<div class="transactions-list__category">
				<p>{getCategoryById(categories, transaction.category_id)?.category}</p>
			</div>{/if}

		<div class="transactions-list__category" class:paid class:due-soon={dueSoon}>
			<p>
				{reccuring
					? `Monthly — ${new Date(transaction.date).getDate()}`
					: formatDate(transaction.date)}
			</p>
		</div>
	{/if}
	<div class="transactions-list__category">
		<p
			class="amount"
			class:amount_plus={transaction.amount > 0}
			class:paid
			class:due-soon={dueSoon}
		>
			{transaction.amount > 0
				? `+$${transaction.amount}`
				: transaction.amount.toString().replace('-', '-$')}
		</p>
		{#if overview}
			<p>{formatDate(transaction.date)}</p>
		{/if}
	</div>
</li>

<style lang="scss">
	.transactions-list__item {
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--color-grey-100);
		&:last-child {
			border-bottom: none;
		}
	}
	.transactions-list__category {
		display: flex;
		padding-block: 0.75rem;
		color: var(--color-grey-500);
		font-size: 0.75rem;
		line-height: 1.5;
		flex: 1;
		&:first-child {
			flex: 4;
		}
		&:last-child {
			flex-direction: column;
			align-items: flex-end;
			justify-content: flex-end;
		}
	}
	.avatar {
		min-width: 2rem;
		max-width: 2rem;
		min-height: 2rem;
		max-height: 2rem;
		border-radius: 50%;
	}
	.transaction-creds {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		span {
			color: var(--color-grey-900);
			font-size: 0.875rem;
			line-height: 1.5;
			font-weight: 600;
		}
	}
	.amount {
		color: var(--color-grey-900);
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: 600;
	}
	.amount_plus {
		color: var(--color-green);
	}
	.paid {
		color: var(--color-green);
	}
	.due-soon {
		color: var(--color-red);
	}
</style>
