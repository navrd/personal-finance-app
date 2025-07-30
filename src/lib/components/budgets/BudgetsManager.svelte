<script lang="ts">
	import { getContext } from 'svelte';
	import type { StateWrapper, Category, Budget, BudgetError } from '$lib/types';
	import type { User, SupabaseClient } from '@supabase/supabase-js';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

	interface BudgetsManagerProps {
		form?: BudgetError | null;
	}

	let { form }: BudgetsManagerProps = $props();

	let user: () => User = getContext('user');
	let supabase: StateWrapper<SupabaseClient> = getContext('supabase');

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	// Reactive state
	let budgets: () => Budget[] = getContext('budgets');
	let loading = $state(false);
	let error: string | null | unknown = $state(null);

	// Form state
	let showForm = $state(false);
	let editingBudget: Budget | null = $state(null);
	let formData = $state({
		category_id: '',
		maximum: '',
		theme: '#277C78'
	});

	// Predefined color themes
	const colorThemes = [
		'#277C78',
		'#82C341',
		'#F2CDAC',
		'#626070',
		'#597081',
		'#AF81BA',
		'#FF9500',
		'#DC2626'
	];

	// helpers

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

	// Reset form
	function resetForm() {
		formData = {
			category_id: '',
			maximum: '',
			theme: '#277C78'
		};
		editingBudget = null;
		showForm = false;
	}

	// Format currency
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	//get category by id
	function getCategoryById(id: string) {
		const category = categories.find((category) => category.id === id);
		if (category) {
			return categories.find((category) => category.id === id);
		} else return null;
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

{#if form && Object.keys(form).length > 0}
	<h2>{form.message}</h2>
	<button onclick={clearForm}>Clear errors</button>
{/if}

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
			<div class="form-container">
				<form
					method="POST"
					class="budget-form"
					action={editingBudget ? '?/updateBudget' : '?/createBudget'}
					use:enhance={() => {
						loading = true;
						return async ({ result, update }) => {
							if (result.type === 'success') {
								// Only reload pots data, not everything
								await invalidate('app:budgets');
								loading = false;
								resetForm();
							} else {
								await update(); // Handle errors normally
								loading = false;
							}
						};
					}}
				>
					<h2>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</h2>
					<input type="hidden" name="user_id" value={user().id} />
					{#if editingBudget}
						<input type="hidden" name="id" value={editingBudget.id} />
					{/if}

					<div class="form-group">
						<label for="category">Category *</label>
						<select
							name="category_id"
							id="category"
							bind:value={formData.category_id}
							placeholder="e.g. Entertainment, Food, Transport"
							required
						>
							{#each categories as category}
								<option value={category.id}>{category.category}</option>
							{/each}
						</select>
					</div>

					<div class="form-group">
						<label for="maximum">Maximum Amount *</label>
						<input
							id="maximum"
							name="maximum"
							type="number"
							step="0.01"
							bind:value={formData.maximum}
							placeholder="0.00"
							required
						/>
					</div>

					<div class="form-group">
						<label for="theme">Theme Color</label>
						<div class="color-picker">
							{#each colorThemes as color}
								<button
									type="button"
									class="color-option {formData.theme === color ? 'selected' : ''}"
									style="background-color: {color}"
									onclick={() => (formData.theme = color)}
									title={color}>x</button
								>
							{/each}
						</div>
						<input
							id="theme"
							name="theme"
							type="color"
							bind:value={formData.theme}
							class="color-input"
						/>
					</div>

					<div class="form-actions">
						<button type="submit" class="btn btn-primary" disabled={loading}>
							{loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
						</button>
						<button type="button" onclick={resetForm} class="btn btn-secondary"> Cancel </button>
					</div>
				</form>
			</div>
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
						<div class="budget-card" style="border-left: 4px solid {budget.theme}">
							<div class="budget-header">
								<h3 class="category">{getCategoryById(budget.category_id)?.category}</h3>
								<div class="actions">
									<button onclick={() => editBudget(budget)} class="btn-icon" title="Edit">
										✏️
									</button>
									<form
										method="POST"
										action="?/deleteBudget"
										use:enhance={() => {
											if (!confirm('Are you sure you want to delete this budget?')) return;
											loading = true;
											return async ({ result, update }) => {
												if (result.type === 'success') {
													// Only reload budgets data, not everything
													await invalidate('app:budgets');
													loading = false;
												} else {
													await update(); // Handle errors normally
													loading = false;
												}
											};
										}}
									>
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
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

	.btn-secondary {
		background: #6b7280;
		color: white;
	}

	.btn-secondary:hover {
		background: #4b5563;
	}

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

	.form-container {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.budget-form h2 {
		margin: 0 0 20px 0;
		color: #1f2937;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
		color: #374151;
	}

	.form-group input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 14px;
	}

	.form-group input:focus {
		outline: none;
		border-color: #277c78;
		box-shadow: 0 0 0 3px rgba(39, 124, 120, 0.1);
	}

	.color-picker {
		display: flex;
		gap: 8px;
		margin-bottom: 10px;
		flex-wrap: wrap;
	}

	.color-option {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s;
	}

	.color-option:hover,
	.color-option.selected {
		border-color: #1f2937;
		transform: scale(1.1);
	}

	.color-input {
		width: 60px !important;
		height: 40px;
		padding: 2px;
	}

	.form-actions {
		display: flex;
		gap: 12px;
		margin-top: 30px;
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

	@media (max-width: 1023px) {
		.header {
			flex-direction: column;
			gap: 15px;
			text-align: center;
		}

		.budgets {
			flex-basis: calc((100%));
		}

		.form-actions {
			flex-direction: column;
		}
	}
</style>
