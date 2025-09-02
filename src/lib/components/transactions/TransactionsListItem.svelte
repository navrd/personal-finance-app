<script lang="ts">
	import type { Budget, Category, Transaction } from '$lib/types';
	import { OK, NotOK } from '$lib/assets/images';
	import { getById } from '$lib/helpers/';
	import { getContext } from 'svelte';

	interface TransactionsListItemProps {
		transaction: Transaction;
		overview?: boolean;
		reccuring?: boolean;
		dueSoon?: boolean;
		paid?: boolean;
		loading?: boolean;
		editingBudget?: Budget | null;
	}

	let {
		transaction,
		overview = false,
		reccuring = false,
		paid = false,
		dueSoon = false,
		loading = false,
		editingBudget = null
	}: TransactionsListItemProps = $props();

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');

	let isLoading = $derived.by(() => {
		return editingBudget?.category_id === transaction.category_id && loading;
	});

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
</script>

<li class="transactions-list__item">
	<div class="transactions-list__category">
		<p class="transaction-creds">
			{#await import(`../../${transaction.avatar}`) then { default: src }}
				{#if isLoading}<span class="avatar-loading"></span>{:else}<img
						class="avatar"
						{src}
						alt={transaction.name}
					/>{/if}
			{/await}
			<span class="transaction-creds__text" class:loading={isLoading}>{transaction.name}</span>
		</p>
	</div>
	{#if !overview}
		{#if !reccuring}<div class="transactions-list__category">
				<p class:loading={isLoading}>{getById(categories, transaction.category_id)?.category}</p>
			</div>{/if}

		<div class="transactions-list__category" class:paid class:due-soon={dueSoon}>
			<span class:loading={isLoading}
				>{reccuring
					? `Monthly — ${new Date(transaction.date).getDate()}`
					: formatDate(transaction.date)}</span
			>
			{#if paid}{@html OK}{/if}
			{#if dueSoon}{@html NotOK}{/if}
		</div>
	{/if}
	<div class="transactions-list__category">
		<p
			class="amount"
			class:amount_plus={transaction.amount > 0}
			class:paid
			class:due-soon={dueSoon}
			class:loading={isLoading}
		>
			{transaction.amount > 0
				? `+$${transaction.amount.toFixed(2)}`
				: transaction.amount.toFixed(2).replace('-', '-$')}
		</p>
		{#if overview}
			<p class:loading={isLoading}>{formatDate(transaction.date)}</p>
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
		align-items: center;
		gap: 0.25rem;
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
	.avatar-loading {
		min-width: 2rem;
		max-width: 2rem;
		min-height: 2rem;
		max-height: 2rem;
		border-radius: 50%;
		background: var(--color-grey-300);
	}
	.transaction-creds {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
	}
	.transaction-creds__text {
		color: var(--color-grey-900);
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: 600;
	}
	.amount {
		color: var(--color-grey-900);
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: 700;
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
	.loading {
		background: var(--color-grey-300);
		color: var(--color-grey-300);
		border-radius: 0.25rem;
	}
</style>
