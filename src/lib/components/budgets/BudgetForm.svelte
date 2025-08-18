<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { Budget, Category } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext, onDestroy, onMount } from 'svelte';
	import CustomSelect from '../CustomSelect.svelte';
	import { getCategoryById } from '$lib/helpers/categories';
	import { Close } from '$lib/assets/images';
	import CustomInput from '../CustomInput.svelte';

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

	function onCategorySelect(category: Pick<Category, 'id' | 'category'>) {
		formData.category_id = category.id;
	}

	function onColorSelect(color: string) {
		formData.theme = color;
	}

	onMount(() => {
		document.documentElement.classList.add('overflow-hidden');
	});
	onDestroy(() => {
		document.documentElement.classList.remove('overflow-hidden');
	});
</script>

<div class="budget-form-wrapper">
	<div class="form-container">
		<form
			method="POST"
			class="budget-form"
			action={editingBudget ? '?/updateBudget' : '?/createBudget'}
			use:enhance={enhanceForm}
		>
			<header class="form-header">
				<h2 class="title">{editingBudget ? 'Edit Budget' : 'Add New Budget'}</h2>
				<button class="close" type="button" onclick={resetFormData}>{@html Close}</button>
			</header>
			<p class="description">
				{editingBudget
					? 'As your budgets change, feel free to update your spending limits.'
					: 'Choose a category to set a spending budget. These categories can help you monitor spending.'}
			</p>
			<input type="hidden" name="user_id" value={user().id} />

			{#if editingBudget}
				<input type="hidden" name="id" value={editingBudget.id} />
			{/if}
			<CustomSelect
				options={categories}
				label="category"
				onOptionClick={onCategorySelect}
				selectedOption={getCategoryById(categories, formData?.category_id)!}
				hiddenInput
				inputName="category_id"
				bind:inputValue={formData.category_id}
			>
				{#snippet children(category)}
					<p class="category-option">{category.category}</p>
				{/snippet}
			</CustomSelect>

			<CustomInput
				bind:value={formData.maximum}
				type="number"
				placeholder="e.g. 200"
				symbol="$"
				name="maximum"
				id="maximum"
				label="Maximum Spending"
			/>

			<CustomSelect
				options={colorThemes}
				label="color"
				onOptionClick={onColorSelect}
				selectedOption={formData.theme}
				hiddenInput
				inputName="theme"
				bind:inputValue={formData.theme}
			>
				{#snippet children(color)}
					<p class="color-option" style:--data-color={color}>{color}</p>
				{/snippet}
			</CustomSelect>
			<button type="submit" class="button" disabled={loading}>
				{loading ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
			</button>
		</form>
	</div>
</div>

<style lang="scss">
	.budget-form-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		width: 100dvw;
		height: 100dvh;
		background: rgba(0, 0, 0, 0.25);
	}
	.budget-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.form-container {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.description {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.category-option {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		text-transform: capitalize;
		border: 1px solid transparent;
		color: var(--color-grey-900);
	}
	.color-option {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		text-transform: capitalize;
		border: 1px solid transparent;
		color: var(--color-grey-900);
		&:before {
			content: ' ';
			height: 1rem;
			width: 1rem;
			border-radius: 50%;
			background: var(--data-color);
		}
	}
	.form-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.close {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 0;
		outline: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.title {
		margin: 0;
	}
	.button {
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		&:hover,
		&:active,
		&:focus {
			cursor: pointer;
			opacity: 50%;
		}
	}
</style>
