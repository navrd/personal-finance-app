<script lang="ts">
	import { Navigation, Spacer, SidebarAction, BlankButton } from '$lib/components';
	import { Arrow, Logo, LogoMinimized, Logout } from '$lib/assets/images';
	import { getContext } from 'svelte';
	import type { BooleanContextValue } from '$lib/types';

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
		<SidebarAction onclick={() => (minimize.value = !minimize.value)} text="Minimize" rotate
			>{@html Arrow}</SidebarAction
		>
		<form method="POST" action="?/signout">
			<SidebarAction buttonType="submit" text="Logout">{@html Logout}</SidebarAction>
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
		z-index: var(--sidebar-z-index);
		@media (min-width: 0px) and (max-width: 1023px) {
			padding: 0 var(--space-l);
			bottom: 0;
			border-top-right-radius: var(--radius-l);
			border-top-left-radius: var(--radius-l);
		}
		@media (min-width: 1024px) {
			left: 0;
			border-top-right-radius: var(--radius-l);
			border-bottom-right-radius: var(--radius-l);
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
		gap: var(--space-l);
		@media (min-width: 0px) and (max-width: 1023px) {
			display: none;
		}
	}
</style>
