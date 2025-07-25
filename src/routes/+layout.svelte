<script lang="ts">
	import '$lib/assets/css/main.css';
	import { setContext } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type {
		StateWrapper,
		Transaction,
		TransactionSortOption
	} from '$lib/types';
	import type { User } from '@supabase/auth-js';
	import type { SupabaseClient } from '@supabase/supabase-js';

	let { data, children } = $props();

	let { session } = $derived(data);

	onMount(() => {
		const { data } = supabase.value.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	let user: StateWrapper<User | null> = $state({ value: data.user });
	setContext('user', user);

	let supabase: StateWrapper<SupabaseClient> = $state({ value: data.supabase });
	setContext('supabase', supabase);



	let transactionSortOptions: StateWrapper<TransactionSortOption[]> = $state({
		value: data.transactionSortOptions
	});
	setContext('transactionSortOptions', transactionSortOptions);

	let transactions: StateWrapper<Transaction[]> = $state({ value: data.transactions });
	setContext('transactions', transactions);

	let minimize: StateWrapper<boolean> = $state({ value: false });
	setContext('minimize', minimize);
	//non-reactive contexts
	setContext('categories', data.categories);

	//reactive contexts
	setContext('balance', () => data.balance);
	setContext('budgets', () => data.budgets);
	setContext('pots', () => data.pots);

	$effect(() => {
		user.value = data.session?.user || null;
		transactions.value = data.transactions;
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
		min-height: 100dvh;
		min-width: 100%;
		max-width: 100%;
	}
</style>
