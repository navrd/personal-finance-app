<script lang="ts">
	import { getContext } from 'svelte';
	import type { Budget, BudgetError } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import { applyAction } from '$app/forms';
	import { BudgetForm, BudgetCard, BudgetError as BudgetErrorForm } from '$lib/components';

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme_id: string;
	}

	interface BudgetsManagerProps {
		form?: BudgetError | null;
		showForm: boolean;
		loading: boolean;
		editingBudget: Budget | null;
	}

	let {
		form,
		showForm = $bindable(),
		loading = $bindable(),
		editingBudget = $bindable()
	}: BudgetsManagerProps = $props();

	let user: () => User = getContext('user');

	// Reactive state
	let budgets: () => Budget[] = getContext('budgets');

	let error: string | null | unknown = $state(null);

	// Form state

	let formData: BudgetFormData & { id?: string } = $state({
		category_id: '',
		maximum: '',
		theme_id: ''
	});

	function resetFormData() {
		formData = {
			category_id: '',
			maximum: '',
			theme_id: ''
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

<BudgetErrorForm {form} {clearForm} />

<div class="budget-manager">
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
			<BudgetForm bind:showForm bind:loading bind:editingBudget bind:formData {resetFormData} />
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
	}
	.budgets-list {
		display: flex;
		flex-direction: column;
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
		width: var(--full-container-width);
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap-l);
	}
</style>
