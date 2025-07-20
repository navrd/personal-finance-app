<script lang="ts">
	import { PieChart } from '$lib/components';
	import type { Balance, Category, StateWrapper, Transaction } from '$lib/types';
	import { getContext } from 'svelte';

	let transactions: StateWrapper<Transaction[]> = getContext('transactions');
	let categories: Category[] = getContext('categories');
	let balance: StateWrapper<Pick<Balance, 'current' | 'expenses' | 'income'> | null> =
		getContext('balance');

	$inspect('transactions', transactions);
	$inspect('categories', categories);
	$inspect('balance', balance);
</script>

<section class="budgets-diagram">
	<div class="budgets-diagram__chart">
		<PieChart />
	</div>
	<div class="bugets-diagram__legend"></div>
</section>

<style lang="scss"></style>
