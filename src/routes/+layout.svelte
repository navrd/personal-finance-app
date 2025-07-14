<script lang="ts">
	import { goto } from '$app/navigation';
	import { setAuthContext } from '$lib/auth/context.svelte';

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

{#if auth.loading}
	<h1>Loading...</h1>
{:else}
	{@render children?.()}
{/if}
