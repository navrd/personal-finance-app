<script lang="ts">
	import { getAuthContext } from '$lib/auth/context.svelte';
	import { Navigation } from '$lib/components';
	import { Logo, LogoMinimized } from '$lib/assets/images';
	let auth = getAuthContext();
	let minimize = $state(false);
</script>

<nav class="sidebar" class:sidebar__minimized={minimize}>
	<div class="sidebar__logo">
		{#if minimize}
			{@html LogoMinimized}
		{:else}
			{@html Logo}
		{/if}
	</div>
	<Navigation {minimize} />
	<div class="spacer"></div>
	<div class="sidebar__buttons">
		<button onclick={() => (minimize = !minimize)}>Minimize</button>
		<button onclick={auth.signOut}>Sign out</button>
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
		@media (min-width: 325px) and (max-width: 1023px) {
			bottom: 0;
		}
		@media (min-width: 1024px) and (max-width: 1199px) {
			left: 0;
		}
		@media screen and (min-width: 1200px) {
			left: 0;
		}
	}
	.sidebar__minimized {
		width: 5rem;
		align-items: center;
		@media (min-width: 325px) and (max-width: 1023px) {
			width: var(--sidebar-width);
		}
	}
	.sidebar__logo {
		padding: var(--sidebar-padding);
		min-height: 2rem;
		@media (min-width: 325px) and (max-width: 1023px) {
			display: none;
		}
	}
	.sidebar__buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		@media (min-width: 325px) and (max-width: 1023px) {
			display: none;
		}
	}

	.spacer {
		flex: 1 1 auto;
	}
</style>
