<script lang="ts">
	import PotsManager from "$lib/components/pots/PotsManager.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Pots</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<PotsManager />


{@render children?.()}