<script lang="ts">
	import type { NavLinkProps } from '$lib/types';
	import NavLink from './NavLink.svelte';

	interface NavigationProps {
		minimize: boolean;
	}

	let { minimize }: NavigationProps = $props();

	const links: Omit<NavLinkProps, 'minimize'>[] = [
		{ href: '/overview', title: 'overview', icon: 'overview' },
		{ href: '/transactions', title: 'transactions', icon: 'transactions' },
		{ href: '/budgets', title: 'budgets', icon: 'budgets' },
		{ href: '/pots', title: 'pots', icon: 'pots' },
		{ href: '/reccuring', title: 'reccuring bills', icon: 'reccuring' }
	];
</script>

<ul class="sidebar__navigation" class:sidebar__navigation_minimized={minimize}>
	{#each links as { title, href, icon }}
		<NavLink {title} {href} {minimize} {icon} />
	{/each}
</ul>

<style lang="scss">
	.sidebar__navigation {
		z-index: var(--sidebar-z-index);
		display: flex;
		flex-direction: var(--sidebar-flex-direction);
		gap: var(--space-l);
		@media screen and (min-width: 0px) and (max-width: 1023px) {
			height: 100%;
			width: 100%;
			justify-content: space-between;
		}
	}
	.sidebar__navigation_minimized {
		width: 100%;
	}
</style>
