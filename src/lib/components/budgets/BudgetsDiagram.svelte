<script lang="ts">
	import { PieChart } from '$lib/components';
	import type { Balance, Category, StateWrapper, Transaction } from '$lib/types';
	import { getContext } from 'svelte';

	let transactions: StateWrapper<Transaction[]> = getContext('transactions');
	let categories: Category[] = getContext('categories');
	let balance: StateWrapper<Pick<Balance, 'current' | 'expenses' | 'income'> | null> =
		getContext('balance');
</script>

<section class="budgets-diagram">
	<div class="budgets-diagram__chart">
		<PieChart />
	</div>
	<div class="budgets-diagram__legend"></div>
</section>

<style lang="scss">
	.budgets-diagram {
		padding: 20px;
		display: flex;
		max-width: 100%;
	}
	.budgets-diagram__chart {
		max-width: inherit;
	}
	.budgets-diagram__legend {
		max-width: inherit;
	}
</style>
