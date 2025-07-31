<script lang="ts">
	import { BudgetsOverview } from '$lib/components';
	import BudgetsManager from '$lib/components/budgets/BudgetsManager.svelte';
	import type { BudgetError } from '$lib/types/index.js';
	import { type PageData } from '../$types.js';
	interface Props {
		data: PageData;
		form?: BudgetError | null;
	}

	let { form, data }: Props = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Budgets</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Budgets</h2>
	<div class="page-header__buttons"><button class="button">+ Add new budget</button></div>
</header>

<BudgetsOverview />
<BudgetsManager {form} />

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 53px;
	}
	.page-header__title {
		color: var(--color-grey-900);
		font-size: 2rem;
		line-height: 1.2;
		font-weight: 550;
	}
	.page-header__buttons {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: flex-end;
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
