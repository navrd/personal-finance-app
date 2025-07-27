<script lang="ts">
	import { BudgetsDiagram } from '$lib/components';
	import type { Balance } from '$lib/types';
	import { getContext } from 'svelte';

	let balance: () => Balance = getContext('balance');
	$inspect(balance())

	let balanceData = $derived.by<Pick<Balance, 'current' | 'expenses' | 'income'>>(() => {
		return (({ current, expenses, income }) => ({ current, expenses, income }))(balance());
	});
	$inspect(balanceData)
</script>

<svelte:head>
	<title>Personal Finance App - Home</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<BudgetsDiagram />
<div class="balance">
	{#each Object.entries(balanceData) as [key, value]}
		<div class="balance-entry">
			<h3 class="balance-entry__title">{key}</h3>
			<p class="balance-entry__value">{value}</p>
		</div>
	{/each}
</div>
