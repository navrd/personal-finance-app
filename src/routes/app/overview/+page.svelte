<script lang="ts">
	import { BudgetsDiagram } from '$lib/components';

	let { children } = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Home</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<BudgetsDiagram />

{@render children?.()}
