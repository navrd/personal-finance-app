<script lang="ts">
	import { PieChart } from '$lib/components';

	import data from '$lib/data.json';
	import type { CategorisedTransactions, Transaction } from '$lib/types';

	let transactions = $state(data.transactions);
	let budgets = $state(data.budgets);

	let categorizedTransactions: CategorisedTransactions = $derived.by(() => {
		return transactions.reduce((acc: CategorisedTransactions, transaction: Transaction) => {
			const { category } = transaction;
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(transaction);
			return acc;
		}, {});
	});
	$inspect(categorizedTransactions);
</script>

<section class="budgets-diagram">
	<div class="budgets-diagram__chart">
		<PieChart />
	</div>
	<div class="bugets-diagram__legend">
		{#each Object.entries(categorizedTransactions) as category}
			<p>{category[0]}</p>
		{/each}
	</div>
</section>

<style lang="scss"></style>
