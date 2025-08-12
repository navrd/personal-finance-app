<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { Budget, Category } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext } from 'svelte';

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

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme: string;
	}

	interface BudgetFormProps {
		editingBudget: Budget | null;
		loading: boolean;
		resetFormData: () => void;
		formData: BudgetFormData;
		showForm: boolean;
	}

	let {
		editingBudget = $bindable(),
		showForm = $bindable(),
		formData,
		resetFormData,
		loading = $bindable()
	}: BudgetFormProps = $props();

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	let user: () => User = getContext('user');

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

<div class="form-container">
	<form
		method="POST"
		class="budget-form"
		action={editingBudget ? '?/updateBudget' : '?/createBudget'}
		use:enhance={enhanceForm}
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
			<input id="theme" name="theme" type="color" bind:value={formData.theme} class="color-input" />
		</div>

		<div class="form-actions">
			<button type="submit" class="btn btn-primary" disabled={loading}>
				{loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
			</button>
			<button type="button" onclick={resetFormData} class="btn btn-secondary"> Cancel </button>
		</div>
	</form>
</div>

<style lang="scss">
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

	@media (max-width: 1023px) {
		.form-actions {
			flex-direction: column;
		}
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
</style>
