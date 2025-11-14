<script lang="ts">
	import { BudgetsOverview, BudgetsManager, CustomButton } from '$lib/components';
	import type { Budget, BudgetError } from '$lib/types';
	import { type PageData } from '../$types.js';
	interface Props {
		data: PageData;
		form?: BudgetError | null;
	}

	let { form }: Props = $props();
	let showForm = $state(false);
	let loading = $state(false);
	let editingBudget: Budget | null = $state(null);
</script>

<svelte:head>
	<title>Personal Finance App - Budgets</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Budgets</h2>
	<div class="page-header__buttons">
		<CustomButton onclick={() => (showForm = true)}>+ Add new budget</CustomButton>
	</div>
</header>
<div class="budgets-grid">
	<div class="budgets-grid__segment budgets-grid__segment_overview">
		<BudgetsOverview {loading} {editingBudget} />
	</div>
	<div class="budgets-grid__segment budgets-grid__segment_budgets">
		<BudgetsManager bind:editingBudget bind:loading {form} bind:showForm />
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
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: var(--font-weight-550);
		font-weight: bolder;
	}
	.page-header__buttons {
		display: flex;
		gap: var(--gap-m);
		align-items: center;
		justify-content: flex-end;
	}

	.budgets-grid {
		overflow-y: auto;
		display: grid;
		align-items: start;
		gap: var(--gap-xxl);
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
		gap: var(--gap-l);
		flex-direction: column;
		background: white;
		border-radius: var(--radius-m);
		padding: var(--padding-xxl);
		z-index: 5;
	}
	.budgets-grid__segment_overview {
		align-self: start;
		grid-area: overview;
	}

	.budgets-grid__segment_budgets {
		grid-area: budgets;
		background: transparent;
		gap: var(--gap-xxl);
		padding: 0;
	}
</style>
