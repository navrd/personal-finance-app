<script lang="ts">
	import '$lib/assets/css/main.css';
	import { setContext } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { StateWrapper } from '$lib/types';

	import type { SupabaseClient } from '@supabase/supabase-js';

	let { data, children } = $props();

	let { session } = $derived(data);

	let supabase: StateWrapper<SupabaseClient> = $state({ value: data.supabase });
	let minimize: StateWrapper<boolean> = $state({ value: false });

	//non-reactive data contexts
	setContext('categories', data.categories);
	setContext('transactionSortOptions', data.transactionSortOptions);
	setContext('themes', data.themes);

	//reactive data contexts
	setContext('user', () => data.user);
	setContext('supabase', () => data.supabase);
	setContext('balance', () => data.balance);
	setContext('budgets', () => data.budgets);
	setContext('pots', () => data.pots);
	setContext('transactions', () => data.transactions);

	//reactive app contexts
	setContext('minimize', minimize);

	onMount(() => {
		const { data } = supabase.value.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
	onMount(() => {
		const channel = supabase.value
			.channel('app-sync')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, () =>
				invalidate('app:budgets')
			)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'pots' }, () =>
				invalidate('app:pots')
			)
			// etc...
			.subscribe();
	});
</script>

<svelte:head>
	<title>Personal Finance App — Initialisation</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>
<div class="app">
	{@render children?.()}
</div>

<style lang="scss">
	.app {
		display: flex;
		min-height: 100vh;
		overflow-y: auto;
		min-width: 100%;
		max-width: 100%;
	}
</style>
