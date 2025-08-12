<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { getCategoryById } from '$lib/helpers/categories';
	import type { Budget, Category } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext } from 'svelte';

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme: string;
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

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');

	function editBudget(budget: Budget) {
		editingBudget = budget;
		formData = {
			category_id: budget.category_id,
			maximum: budget.maximum.toString(),
			theme: budget.theme,
			id: budget.id
		};
		showForm = true;
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
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
</script>

<div class="budget-card" style="border-left: 4px solid {budget.theme}">
	<div class="budget-header">
		<h3 class="category">
			{getCategoryById(categories, budget.category_id)?.category}
		</h3>
		<div class="actions">
			<button onclick={() => editBudget(budget)} class="btn-icon" title="Edit"> ✏️ </button>
			<form method="POST" action="?/deleteBudget" use:enhance={enhanceForm}>
				<input type="hidden" name="id" value={budget.id} />
				<button type="submit" class="btn-icon" title="Delete"> 🗑️ </button>
			</form>
		</div>
	</div>

	<div class="budget-amount">
		<span class="amount">{formatCurrency(budget.maximum)}</span>
		<span class="label">Maximum</span>
	</div>

	<div class="budget-meta">
		<small>Created: {new Date(budget.created_at).toLocaleDateString()}</small>
		{#if budget.updated_at !== budget.created_at}
			<small>Updated: {new Date(budget.updated_at).toLocaleDateString()}</small>
		{/if}
	</div>
</div>

<style lang="scss">
	.btn-icon {
		background: none;
		border: none;
		font-size: 16px;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.btn-icon:hover {
		background: #f3f4f6;
	}
	.budget-card {
		flex-basis: calc((100% - 1rem) / 2);
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.budget-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.budget-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 15px;
	}

	.category {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: #1f2937;
	}

	.actions {
		display: flex;
		gap: 5px;
	}

	.budget-amount {
		margin-bottom: 15px;
	}

	.amount {
		display: block;
		font-size: 24px;
		font-weight: 700;
		color: #277c78;
	}

	.label {
		font-size: 12px;
		color: #6b7280;
		text-transform: uppercase;
		font-weight: 500;
	}

	.budget-meta {
		border-top: 1px solid #f3f4f6;
		padding-top: 10px;
	}

	.budget-meta small {
		display: block;
		color: #9ca3af;
		font-size: 12px;
		margin-bottom: 2px;
	}
</style>
