<script lang="ts">
	import '$lib/assets/css/main.css';
	import { goto } from '$app/navigation';
	import { setAuthContext } from '$lib/auth/context.svelte';
	import { Sidebar } from '$lib/components';

	let { children } = $props();

	const auth = setAuthContext();

	$effect(() => {
		if (!auth.initialized || !auth.user?.id) {
			goto('/login');
		} else {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Personal Finance App — Initialisation</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>
<div class="app">
	{#if auth.loading}
		<h1>Loading...</h1>
	{:else}
		<Sidebar />
		{@render children?.()}
	{/if}
</div>

<style lang="scss">
	.app {
		min-height: 100dvh;
		min-width: 100dvw;
	}
</style>
