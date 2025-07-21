<script lang="ts">
	import { BudgetsDiagram } from '$lib/components';
	import BudgetsManager from '$lib/components/budgets/BudgetsManager.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Budgets</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<BudgetsDiagram />
<BudgetsManager/>

{@render children?.()}
