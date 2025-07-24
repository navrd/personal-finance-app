<script lang="ts">
	import { Navigation, Spacer } from '$lib/components';
	import { Logo, LogoMinimized } from '$lib/assets/images';
	import { getContext } from 'svelte';
	import type { BooleanContextValue, StateWrapper } from '$lib/types';
	import Minimize from './Minimize.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	let user = getContext('user');
	let supabase: StateWrapper<SupabaseClient> = getContext('supabase');
	let minimize: BooleanContextValue = getContext('minimize');
	import { enhance } from '$app/forms';

	let signingOut = $state(false);

	// async function signOut() {
	// 	signingOut = true;
	// 	// Sign out from Supabase
	// 	await supabase.value.auth.signOut();

	// 	// Clear cookies
	// 	clearCookies();
	// 	clearSupabaseCookies();

	// 	// Update state
	// 	user = null;
	// 	signingOut = false;
	// }

	// function clearCookies() {
	// 	// Clear all cookies
	// 	document.cookie.split(';').forEach((cookie) => {
	// 		const eqPos = cookie.indexOf('=');
	// 		const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
	// 		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
	// 	});
	// }

	// // Clear specific Supabase cookies only
	// function clearSupabaseCookies() {
	// 	const cookiesToClear = [
	// 		'sb-access-token',
	// 		'sb-refresh-token',
	// 		'supabase-auth-token',
	// 		'supabase.auth.token'
	// 	];

	// 	cookiesToClear.forEach((cookieName) => {
	// 		document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	// 	});
	// }

	// async function signOut() {
	// 	signingOut = true;
	// 	try {
	// 		const { error } = await supabase.value.auth.signOut();
	// 		if (error) {
	// 			console.warn('Server signOut failed, but clearing local state:', error);
	// 		}

	// 		user = null;
	// 		goto('/auth');
	// 		signingOut = false;

	// 		return { error: null };
	// 	} catch (err) {
	// 		console.error('SignOut exception:', err);
	// 		user = null;
	// 		signingOut = false;

	// 		return { error: null };
	// 	}
	// }
</script>

<nav class="sidebar" class:sidebar__minimized={minimize.value}>
	<div class="sidebar__logo">
		{#if minimize.value}
			{@html LogoMinimized}
		{:else}
			{@html Logo}
		{/if}
	</div>
	<Navigation minimize={minimize.value} />
	<Spacer />
	<div class="sidebar__buttons">
		<Minimize />
		<!-- <button type="submit" disabled={signingOut} onclick={signOut}>
			{signingOut ? 'Signing out...' : 'Sign Out'}
		</button> -->
		<form method="POST" action="?/signout">
			<button type="submit">Sign Out</button>
		</form>
	</div>
</nav>

<style lang="scss">
	.sidebar {
		width: var(--sidebar-width);
		height: var(--sidebar-height);
		background: var(--color-grey-900);
		color: white;
		display: flex;
		flex-direction: var(--sidebar-flex-direction);
		justify-content: center;
		align-items: flex-start;
		position: fixed;
		transition: width 0.3s ease;

		@media (min-width: 0px) and (max-width: 1023px) {
			padding: 0 1rem;
			bottom: 0;
			border-top-right-radius: 1rem;
			border-top-left-radius: 1rem;
		}
		@media (min-width: 1024px) {
			left: 0;
			border-top-right-radius: 1rem;
			border-bottom-right-radius: 1rem;
		}
	}
	.sidebar__minimized {
		width: 5rem;
		align-items: center;
		@media (min-width: 0px) and (max-width: 1023px) {
			width: var(--sidebar-width);
		}
	}
	.sidebar__logo {
		padding: var(--sidebar-padding);
		min-height: 2rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			display: none;
		}
	}
	.sidebar__buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			display: none;
		}
	}
</style>
