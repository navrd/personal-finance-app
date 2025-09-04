<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type {
		Budget,
		Category,
		ColorTheme,
		Transaction,
		TransactionSortOption
	} from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext } from 'svelte';
	import { ArrowRight, Dots } from '$lib/assets/images';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { TransactionsList, LoadingDots, BlankButton } from '$lib/components';
	import { sortTransactions } from '$lib/helpers/transactions';
	import { getById } from '$lib/helpers';

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme_id: string;
	}

	interface BudgetCardProps {
		budget: Budget;
		editingBudget: Budget | null;
		loading: boolean;
		resetFormData: () => void;
		formData: BudgetFormData & { id?: string };
		showForm: boolean;
	}

	let {
		budget,
		editingBudget = $bindable(),
		loading = $bindable(),
		showForm = $bindable(),
		formData = $bindable(),
		resetFormData
	}: BudgetCardProps = $props();

	let themes: ColorTheme[] = getContext('themes');
	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	let transactions: () => Transaction[] = getContext('transactions');
	let transactionSortOptions: TransactionSortOption[] = getContext('transactionSortOptions');

	let showContextMenu = $state(false);
let isLoading = $derived(loading && editingBudget?.id === budget.id);

	function editBudget(budget: Budget) {
		editingBudget = budget;
		formData = {
			category_id: budget.category_id,
			maximum: budget.maximum.toString(),
			theme_id: budget.theme_id,
			id: budget.id
		};
		showForm = true;
		showContextMenu = false;
	}

	const enhanceForm: SubmitFunction = async ({ action, formData, cancel }) => {
		if (action.search.includes('deleteBudget') || action.pathname.includes('deleteBudget')) {
			const confirmed = confirm('Are you sure you want to delete this budget?');
			if (!confirmed) {
				cancel();
				return;
			}
		}
		loading = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:budgets');
				loading = false;
				resetFormData();
			} else {
				await update();
				loading = false;
			}
		};
	};

	function clickOutside(e: CustomEvent<MouseEvent>) {
		e.stopPropagation();
		showContextMenu = false;
	}
	let spent = $derived(
		transactions()
			.filter((transaction) => transaction.category_id === budget.category_id)
			.reduce((sum, { amount }) => sum + amount, 0)
	);

	let latestTransactions = $derived(
		sortTransactions(transactions(), transactionSortOptions[2].id, transactionSortOptions)
			.filter((transaction) => transaction.category_id === budget.category_id)
			.slice(0, 3)
	);
</script>

<div class="budget-card">
	<div class="budget-card__header">
		<h3
			class="header-title"
			style:--data-color={isLoading
				? 'var(--color-grey-300)'
				: getById(themes, budget.theme_id)?.theme}
			class:loading={isLoading}
		>
			{getById(categories, budget.category_id)?.category}
		</h3>
		<div class="context-menu">
			<BlankButton
				onclick={(e: MouseEvent) => {
					e.stopPropagation();
					showContextMenu = !showContextMenu;
				}}>{@html Dots}</BlankButton
			>
			{#if showContextMenu}
				<ul class="context-menu__actions" use:clickoutside onclickoutside={clickOutside}>
					<li class="action">
						<BlankButton onclick={() => editBudget(budget)}>Edit budget</BlankButton>
					</li>
					<li class="action action_delete">
						<form method="POST" action="?/deleteBudget" use:enhance={enhanceForm}>
							<input type="hidden" name="id" value={budget.id} />
							<BlankButton type="submit" fullWidth
								>{#if loading}
									<LoadingDots dotColor="var(--color-red)" />
								{:else}Delete budget{/if}</BlankButton
							>
						</form>
					</li>
				</ul>
			{/if}
		</div>
	</div>

	<p class="budget-amount" class:loading={isLoading}>Maximum of ${budget.maximum}</p>

	<div class="amount-progress">
		<div
			class="amount-progress__value"
			style:--data-color={isLoading ? 'var(--color-grey-300)' :getById(themes, budget.theme_id)?.theme}
			style:--data-width={`${(spent * -100) / budget.maximum}%`}
			class:loading={isLoading}
		></div>
	</div>

	<div class="budget-data">
		<div
			class="spent"
			style:--data-color={isLoading
				? 'var(--color-grey-300)'
				: getById(themes, budget.theme_id)?.theme}
		>
			<div class="data">
				<p class="label" class:loading={isLoading}>Spent</p>
				<p class="sum" class:loading={isLoading}>${(spent * -1).toFixed(0)}</p>
			</div>
		</div>
		<div class="remaining">
			<div class="data">
				<p class="label" class:loading={isLoading}>Remaining</p>
				<p class="sum" class:loading={isLoading}>${(budget.maximum - spent * -1).toFixed(0)}</p>
			</div>
		</div>
	</div>
	<div class="latest-transactions">
		<div class="segment__header">
			<h2 class="segment_title" class:loading={isLoading}>Latest transactions</h2>
			<a class="details" href="/app/transactions"><span>See Details</span> {@html ArrowRight}</a>
		</div>
		<TransactionsList transactions={latestTransactions} overview {loading} {editingBudget} />
	</div>
</div>

<style lang="scss">
	.action {
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid var(--color-grey-100);
		color: var(--color-grey-900);
		font-size: 0.875rem;
		&:last-child {
			border-bottom: none;
		}
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.action_delete {
		color: var(--color-red);
	}
	.segment__header {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-grey-900);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.segment_title {
		font-size: 1rem;
		font-weight: 600;
	}
	.latest-transactions {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		border-radius: 0.75rem;
		background: var(--color-beige-100);
	}
	.data {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.budget-data {
		display: flex;
		width: 100%;
	}
	.spent,
	.remaining {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;

		flex: 1 1 auto;
		&:before {
			content: ' ';
			width: 0.25rem;
			height: 2rem;
			background: var(--color-beige-100);
			border-radius: 0.25rem;
		}
	}

	.spent {
		&:before {
			background: var(--data-color);
		}
	}
	.label {
		color: var(--color-grey-500);
		font-size: 0.75rem;
		line-height: 1.5;
	}
	.sum {
		color: var(--color-grey-900);
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: 600;
	}
	.amount-progress {
		padding: 0.25rem;
		display: flex;
		height: 2rem;
		background: var(--color-beige-100);
		border-radius: 0.25rem;
	}
	.amount-progress__value {
		height: calc(2rem - 2 * 0.25rem);
		background: var(--data-color);
		width: var(--data-width);
		border-radius: 0.25rem;
		transition: width 0.25s ease;
	}
	.context-menu {
		position: relative;
		display: flex;

		align-items: center;
		justify-content: center;
		color: var(--color-grey-300);
		fill: currentColor;
	}

	.context-menu__actions {
		background: white;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 130px;
		z-index: 3;
		border-radius: 0.75rem;
		box-shadow: 0rem 0.75rem 1.5rem 0rem hsl(from black h s l / 0.25);
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		font-weight: bolder;
		color: var(--color-grey-900);
		&:before {
			content: ' ';
			width: 0.75rem;
			height: 0.75rem;
			border-radius: 50%;
			background: var(--data-color);
		}
	}
	.budget-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.budget-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.budget-amount {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
</style>
