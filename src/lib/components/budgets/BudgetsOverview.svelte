<script lang="ts">
	import { PieChart } from '$lib/components';
	import { getById } from '$lib/helpers/';
	import type { Budget, Category, ColorTheme } from '$lib/types';
	import { getContext } from 'svelte';
	import { page } from '$app/state';

	interface BudgetsOverviewProps {
		loading: boolean;
		editingBudget: Budget | null;
	}
	let { loading, editingBudget }: BudgetsOverviewProps = $props();

	let themes: ColorTheme[] = getContext('themes');
	let budgets: () => Budget[] = getContext('budgets');
	let categories: Pick<Category, 'id' | 'category'>[] = getContext('categories');


	let getRouteBasedFlexDirection = $derived.by(() => {
		if (page.url.pathname.includes('overview')) {
			return false;
		} else if (page.url.pathname.includes('budgets')) {
			return true;
		} else return false;
	});
</script>

<div class="segment__data" class:flex-direction-column={getRouteBasedFlexDirection}>
	<PieChart {loading} {editingBudget} />
	<ul class="segment__legend">
		{#each budgets() as budget}
			<li class="legend-item" style:--data-color={loading && editingBudget?.id === budget.id ? 'var(--color-grey-300)' : getById(themes, budget.theme_id)?.theme}>
				<h3 class="budget__label" class:loading={loading && editingBudget?.id === budget.id}>
					{getById(categories, budget.category_id)?.category}
				</h3>
				<p class="budget__sum" class:loading={loading && editingBudget?.id === budget.id}>
					${budget.maximum}
				</p>
			</li>
		{/each}
	</ul>
</div>

<style lang="scss">
	.flex-direction-column {
		flex-direction: column;
	}
	.segment__data {
		display: flex;
		justify-content: space-between;
	}
	.segment__legend {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: inherit;
		max-height: 240px;
		overflow: auto;
	}
	.legend-item {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0 1.5rem;
		&:before {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 4px;
			z-index: 1;
			content: '';
			background: var(--data-color);
		}
	}
	.budget__label {
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.budget__sum {
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: bolder;
	}
	.loading {
		background: var(--color-grey-300);
		color: var(--color-grey-300);
		border-radius: 0.25rem;
	}
</style>
