<script lang="ts">
	import '$lib/assets/css/main.css';
	import { goto } from '$app/navigation';
	import { setAuthContext } from '$lib/auth/context.svelte';
	import { Sidebar } from '$lib/components';
	import { onMount, setContext } from 'svelte';
	import type { Balance, Category, StateWrapper, Transaction } from '$lib/types';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/state';

	let { children, data } = $props();

	let categories: StateWrapper<Pick<Category, 'id' | 'category'>[]> = $state({
		value: data.categories
	});
	setContext('categories', categories);

	let transactions: StateWrapper<Transaction[]> = $state({ value: [] });
	setContext('transactions', transactions);

	const auth = setAuthContext();
    $inspect(auth.loading, auth.initialized, auth.user?.id)
	let minimize: StateWrapper<boolean> = $state({ value: false });
	setContext('minimize', minimize);

	let balance = $state<StateWrapper<Pick<Balance, 'current' | 'expenses' | 'income'> | null>>({
		value: null
	});
	setContext('balance', balance);

	$effect(() => {
		async function fetchUserBalance() {
			try {
				const { data, error } = await supabase
					.from('balance')
					.select('current, income, expenses')
					.single();

				if (error) {
					console.error('Error fetching balance:', error);
					return null;
				}

				balance.value = data || null;
			} catch (err) {
				console.error('Unexpected error:', err);
				return null;
			}
		}
		fetchUserBalance();
	});

	$effect(() => {
		async function fetchUserTransactions() {
			if (!auth.initialized || !auth.user?.id || auth.loading) {
				return;
			}
			try {
				const { data, error } = await supabase.from('transactions').select('*');

				if (error) {
					console.error('Error fetching transactions:', error.message);
				}

				transactions.value = data || [];
			} catch (err: any) {
				console.error('Fetch error:', err);
			}
		}

		fetchUserTransactions();
	});
	$effect(() => {
		if (!auth.initialized || !auth.user?.id) {
			goto('/login');
		} else {
			return 
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
