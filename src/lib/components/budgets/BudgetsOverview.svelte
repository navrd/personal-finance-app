<script lang="ts">
	import { ArrowRight } from '$lib/assets/images';
	import { PieChart } from '$lib/components';
	import type { Budget, Category } from '$lib/types';
	import { getContext } from 'svelte';

	let budgets: () => Budget[] = getContext('budgets');
	let categories: Category[] = getContext('categories');

	function getCategoryById(id: string) {
		const category = categories.find((category) => category.id === id);
		if (category) {
			return categories.find((category) => category.id === id);
		} else return null;
	}
</script>

<section class="budgets-overview">
	<div class="budgets-overview__header">
		<h2 class="budgets-overview__title">Budgets</h2>
		<a class="details" href="/app/budgets"><span>See Details</span> {@html ArrowRight}</a>
	</div>
	<div class="budgets-overview__data">
		<PieChart />
		<ul class="budgets-overview__legend">
			{#each budgets() as budget}
				<li class="legend-item" style:--data-color={budget.theme}>
					<h3 class="budget__label">{getCategoryById(budget.category_id)?.category}</h3>
					<p class="budget__sum">{budget.maximum}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	.budgets-overview {
		background: white;
		padding: 20px;
		display: flex;
		flex-direction: column;
		max-width: 100%;
		border-radius: 0.75rem;
	}
	.budgets-overview__legend {
		display: flex;
		flex-direction: column;
		max-width: inherit;
		max-height: 240px;
		overflow: auto;
	}
	.budgets-overview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.budgets-overview__data {
		display: flex;
		justify-content: space-between;
	}
	.budgets-overview__legend {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		gap: 0.75rem;
	}

	.legend-item {
		position: relative;
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
	}
	.details {
		text-decoration: none;
		display: flex;
		gap: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		align-items: center;
		justify-content: center;
		font-weight: 350;
		font-style: normal;
		* {
			color: currentColor;
			fill: currentColor;
		}
		&:hover {
			color: var(--color-grey-900);
			* {
				color: currentColor;
				fill: currentColor;
			}
		}
	}
</style>
