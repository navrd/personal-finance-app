<script lang="ts">
	import { BudgetsOverview } from '$lib/components';
	import BudgetsManager from '$lib/components/budgets/BudgetsManager.svelte';
	import type { BudgetError } from '$lib/types/index.js';
	import { type PageData } from '../$types.js';
	interface Props {
		data: PageData;
		form?: BudgetError | null;
	}

	let { form }: Props = $props();
	let showForm = $state(false);
</script>

<svelte:head>
	<title>Personal Finance App - Budgets</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Budgets</h2>
	<div class="page-header__buttons">
		<button class="button" onclick={() => (showForm = true)}>+ Add new budget</button>
	</div>
</header>
<div class="budgets-grid">
	<div class="budgets-grid__segment budgets-grid__segment_overview">
		<BudgetsOverview />
	</div>
	<div class="budgets-grid__segment budgets-grid__segment_budgets">
		<BudgetsManager {form} bind:showForm />
	</div>
</div>

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
		font-weight: bolder;
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

	.budgets-grid {
		overflow-y: auto;
		display: grid;
		align-items: start;
		gap: 1.5rem;
		@media screen and (min-width: 0px) and (max-width: 1023px) {
			grid-template-areas: 'overview' 'budgets';
		}
		@media screen and (min-width: 1024px) {
			grid-template-columns: repeat(4, 1fr);
			grid-template-areas: 'overview budgets budgets budgets';
		}
	}
	.budgets-grid__segment {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		z-index: 5;
	}
	.budgets-grid__segment_overview {
		align-self: start;
		grid-area: overview;
	}

	.budgets-grid__segment_budgets {
		grid-area: budgets;
		background: transparent;
		gap: 1.5rem;
		padding: 0;
	}
</style>
