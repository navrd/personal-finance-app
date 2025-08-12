<script lang="ts">
	import { getContext } from 'svelte';
	import type { Category, Budget, BudgetError } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { getCategoryById } from '$lib/helpers/categories';
	import FormError from '../utility/FormError.svelte';
	import { BudgetForm } from '$lib/components';
	import BudgetCard from './BudgetCard.svelte';

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme: string;
	}

	interface BudgetsManagerProps {
		form?: BudgetError | null;
	}

	let { form }: BudgetsManagerProps = $props();

	let user: () => User = getContext('user');

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	// Reactive state
	let budgets: () => Budget[] = getContext('budgets');
	let loading = $state(false);
	let error: string | null | unknown = $state(null);

	// Form state
	let showForm = $state(false);
	let editingBudget: Budget | null = $state(null);
	let formData: BudgetFormData & { id?: string } = $state({
		category_id: '',
		maximum: '',
		theme: '#277C78'
	});

	// Edit budget
	function editBudget(budget: Budget) {
		editingBudget = budget;
		formData = {
			category_id: budget.category_id,
			maximum: budget.maximum.toString(),
			theme: budget.theme
		};
		showForm = true;
	}

	function resetFormData() {
		formData = {
			category_id: '',
			maximum: '',
			theme: '#277C78'
		};
		editingBudget = null;
		showForm = false;
	}

	//clear form prop
	async function clearForm() {
		await applyAction({
			type: 'success',
			status: 200,
			data: {}
		});
	}
</script>

<FormError {form} {clearForm} />

<div class="budget-manager">
	<div class="header">
		<h1>Budget Manager</h1>
		{#if user().id}
			<button onclick={() => (showForm = !showForm)} class="btn btn-primary">
				{showForm ? 'Cancel' : 'Add Budget'}
			</button>
		{/if}
	</div>

	{#if error}
		<div class="alert alert-error" role="alert">
			{error}
			<button onclick={() => (error = null)} class="close-btn">&times;</button>
		</div>
	{/if}

	{#if !user().id}
		<div class="auth-prompt">
			<p>Please sign in to manage your budgets.</p>
		</div>
	{:else}
		{#if showForm}
			<BudgetForm bind:showForm bind:loading bind:editingBudget {formData} {resetFormData} />
		{/if}

		<div class="budgets-list">
			{#if loading && budgets().length === 0}
				<div class="loading">Loading budgets...</div>
			{:else if budgets().length === 0}
				<div class="empty-state">
					<p>No budgets found. Create your first budget to get started!</p>
				</div>
			{:else}
				<div class="budgets">
					{#each budgets() as budget (budget.id)}
						<BudgetCard
							bind:showForm
							bind:loading
							bind:editingBudget
							bind:formData
							{resetFormData}
							{budget}
						/>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.budget-manager {
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	.budgets-list {
		display: flex;
		flex-direction: column;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.header h1 {
		margin: 0;
		color: #1f2937;
	}

	.btn {
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary {
		background: #277c78;
		color: white;
	}

	.btn-primary:hover {
		background: #1f5f5c;
	}

	.alert {
		padding: 15px;
		border-radius: 8px;
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.alert-error {
		background: #fef2f2;
		color: #dc2626;
		border: 1px solid #fecaca;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 18px;
		cursor: pointer;
		color: inherit;
	}

	.auth-prompt {
		text-align: center;
		padding: 40px;
		background: #f9fafb;
		border-radius: 12px;
		color: #6b7280;
	}

	.loading {
		text-align: center;
		padding: 40px;
		color: #6b7280;
	}

	.empty-state {
		text-align: center;
		padding: 40px;
		background: #f9fafb;
		border-radius: 12px;
		color: #6b7280;
	}

	.budgets {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}



	@media (max-width: 1023px) {
		.header {
			flex-direction: column;
			gap: 15px;
			text-align: center;
		}

		.budgets {
			flex-basis: calc((100%));
		}
	}
</style>
