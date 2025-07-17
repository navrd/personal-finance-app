<script lang="ts">
	// import { getAuthContext } from '$lib/auth/context.svelte';
	import { Navigation, Spacer } from '$lib/components';
	import { Logo, LogoMinimized } from '$lib/assets/images';
	import { getContext } from 'svelte';
	import type { BooleanContextValue } from '$lib/types';
	import Minimize from './Minimize.svelte';
	// let auth = getAuthContext();
	let minimize: BooleanContextValue = getContext('minimize');
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
		<!-- <button onclick={auth.signOut}>Sign out</button> -->
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
