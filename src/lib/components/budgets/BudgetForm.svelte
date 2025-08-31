<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { Budget, Category, ColorTheme, PreparedCategory, PreparedTheme } from '$lib/types';
	import type { User } from '@supabase/supabase-js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getContext } from 'svelte';
	import { CustomSelect, CustomInput } from '$lib/components';
	import { getById } from '$lib/helpers/';
	import { Close } from '$lib/assets/images';

	interface BudgetFormData {
		category_id: string;
		maximum: string;
		theme_id: string;
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
		formData = $bindable(),
		resetFormData,
		loading = $bindable()
	}: BudgetFormProps = $props();

	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');
	let user: () => User = getContext('user');
	let budgets: () => Budget[] = getContext('budgets');
	let themes: ColorTheme[] = getContext('themes');

	let usedCategoriesIds = $derived.by(() => {
		let usedCategories = budgets().map((budget) => budget.category_id);
		return new Set(
			editingBudget
				? usedCategories.filter((categoryId) => categoryId !== editingBudget!.category_id)
				: usedCategories
		);
	});

	let preparedCategories: Pick<PreparedCategory, 'id' | 'category' | 'isUsed'>[] = $derived(
		categories
			.map((category) => ({
				...category,
				isUsed: usedCategoriesIds.has(category.id)
			}))
			.sort((a, b) => Number(b.isUsed) - Number(a.isUsed))
	);

	let usedThemesIds = $derived.by(() => {
		let usedThemes = budgets().map((budget) => budget.theme_id);
		return new Set(
			editingBudget
				? usedThemes.filter((themeId) => themeId !== editingBudget!.theme_id)
				: usedThemes
		);
	});

	let preparedThemes: PreparedTheme[] = $derived(
		themes
			.map((theme) => ({
				...theme,
				isUsed: usedThemesIds.has(theme.id)
			}))
			.sort((a, b) => Number(b.isUsed) - Number(a.isUsed))
	);

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

	function onCategorySelect(category: Pick<PreparedCategory, 'id' | 'category' | 'isUsed'>) {
		formData.category_id = category.id;
	}

	function onThemeSelect(theme: PreparedTheme) {
		formData.theme_id = theme.id;
	}
	function validateBudgetCategory(category: string): string | null {
		if (String(category).length < 1) return 'Budget category could not be epmty';
		if (!editingBudget && budgets().filter((budget) => budget.category_id === category).length > 0)
			return 'Budget with this category already exists';
		return null;
	}

	function validateBudgetMaximum(maximum: string | number): string | null {
		if (Number(maximum) < 0) return 'Budget maximum should be positive';
		if (String(maximum).length < 1) return 'Budget target could not be epmty';
		return null;
	}
	function validateBudgetTheme(theme: string): string | null {
		if (String(theme).length < 1) return 'Budget theme could not be epmty';
		return null;
	}

	let isFormValid = $derived.by(() => {
		return (
			validateBudgetCategory(formData.category_id) === null &&
			validateBudgetMaximum(formData.maximum) === null &&
			validateBudgetTheme(formData.theme_id) === null &&
			!loading
		);
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
				options={preparedCategories}
				label="category"
				onOptionClick={onCategorySelect}
				selectedOption={getById(preparedCategories, formData?.category_id)!}
				hiddenInput
				inputName="category_id"
				bind:inputValue={formData.category_id}
				validator={validateBudgetCategory}
			>
				{#snippet children(category)}
					<p class="category-option" class:category-option_used={category.isUsed}>
						{category.category}{#if category.isUsed}<span>Already used</span>{/if}
					</p>
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
				validator={validateBudgetMaximum}
			/>

			<CustomSelect
				options={preparedThemes}
				label="theme"
				onOptionClick={onThemeSelect}
				selectedOption={getById(preparedThemes, formData.theme_id)}
				hiddenInput
				inputName="theme_id"
				bind:inputValue={formData.theme_id}
				validator={validateBudgetTheme}
			>
				{#snippet children(theme)}
					<p
						class="color-option"
						class:color-option_used={theme.isUsed}
						style:--data-color={theme.theme}
					>
						<span class="color-option__name">{theme.name}</span>
						{#if theme.isUsed}<span>Already used</span>{/if}
					</p>
				{/snippet}</CustomSelect
			>
			<button type="submit" class="button" disabled={!isFormValid}>
								{#if loading}
					<div class="button__loading">
						<div class="loading__dot"></div>
						<div class="loading__dot"></div>
						<div class="loading__dot"></div>
					</div>
				{:else}{editingBudget ? 'Update Budget' : 'Create Budget'}{/if}
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
		width: 100%;
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: space-between;
		text-transform: capitalize;
		border: 1px solid transparent;
		color: var(--color-grey-900);
	}
	.category-option_used {
		pointer-events: none;
		color: color-mix(in srgb, var(--color-grey-500) 100%, var(--color-white) 100%);
	}

	.color-option {
		width: 100%;
		display: flex;
		gap: 0.75rem;
		align-items: center;
		text-transform: capitalize;
		border: 1px solid transparent;
		color: var(--color-grey-900);
		justify-content: space-between;
	}
	.color-option__name {
		display: flex;
		gap: 0.75rem;
		&:before {
			content: ' ';
			height: 1rem;
			width: 1rem;
			border-radius: 50%;
			background: var(--data-color);
		}
	}
	.color-option_used {
		pointer-events: none;
		color: color-mix(in srgb, var(--color-grey-500) 100%, var(--color-white) 100%);
		.color-option__name {
			&:before {
				background: color-mix(in srgb, var(--data-color) 100%, var(--color-white) 100%);
			}
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
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		height: 3.5em;
		&:hover,
		&:active,
		&:focus,
		&:disabled {
			cursor: pointer;
			opacity: 50%;
		}
	}
	.button__loading {
		width: 5rem;
		height: inherit;
		min-height: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	@for $i from 1 through 10 {
		.button__loading :nth-child(#{$i}n) {
			animation-delay: #{$i * 0.25}s;
		}
	}
	@keyframes flickerAnimation {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.loading__dot {
		width: 1rem;
		height: 1rem;
		background: white;
		border-radius: 50%;
		animation: flickerAnimation 1s ease infinite;
	}
</style>
