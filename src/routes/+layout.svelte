<script lang="ts">
	import '$lib/assets/css/main.css';
	import { goto } from '$app/navigation';
	import { setAuthContext } from '$lib/auth/context.svelte';
	import { Sidebar } from '$lib/components';
	import { setContext } from 'svelte';
	import type { BooleanContextValue, Transaction } from '$lib/types';
	import { supabase } from '$lib/supabaseClient';

	let { children } = $props();

	const auth = setAuthContext();
	let minimize: BooleanContextValue = $state({ value: false });
	setContext('minimize', minimize);
	let transactions: Transaction[] = $state([]);
	$inspect(transactions);

	$effect(() => {
		async function fetchDailyEntries() {
			if (!auth.initialized || !auth.user?.id || auth.loading) {
				return;
			}

			try {
				const { data, error } = await supabase.from('transactions').select('*');

				if (error) {
					console.error('Error fetching transactions:', error.message);
					// Handle error - show toast, set error state, etc.
				}

				transactions = data || [];
			} catch (err: any) {
				console.error('Fetch error:', err);
			}
		}

		fetchDailyEntries();
	});

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
	{:else if !auth.initialized || !auth.user?.id}
		{@render children?.()}
	{:else}
		<Sidebar />
		<main class="content" class:content_expanded={minimize.value}>
			{@render children?.()}
		</main>
	{/if}
</div>

<style lang="scss">
	.app {
		display: flex;
		min-height: 100dvh;
		min-width: 100dvw;
	}
	.content {
		transition: padding 0.3s ease;
		@media (min-width: 0px) and (max-width: 1023px) {
			padding-bottom: var(--sidebar-height);
		}
		@media (min-width: 1024px) {
			padding-left: var(--sidebar-width);
		}
	}
	.content_expanded {
		@media (min-width: 1024px) {
			padding-left: 5rem;
		}
	}
</style>
