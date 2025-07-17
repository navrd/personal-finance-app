<script lang="ts">
	import type { NavLinkProps } from '$lib/types';
	import NavLink from './NavLink.svelte';

	interface NavigationProps {
		minimize: boolean;
	}
	let { minimize }: NavigationProps = $props();
    $inspect(minimize)

	const links: Omit<NavLinkProps, 'minimize'>[] = [
		{ href: '/budgets', title: 'budgets' },
		{ href: '/transactions', title: 'transactions' },
		{ href: '/reccuring', title: 'reccuring' },
		{ href: '/pots', title: 'pots' },
		{ href: '/', title: 'overview' }
	];
</script>

<ul class="sidebar__navigation" class:sidebar__navigation_minimized={minimize}>
	{#each links as { title, href }}
		<NavLink {title} {href} {minimize} />
	{/each}
</ul>

<style lang="scss">
	.sidebar__navigation {
		display: flex;
		flex-direction: var(--sidebar-flex-direction);
		gap: 1rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			height: 100%;
            width: 100%;
			justify-content: space-between;
		}
	}
	.sidebar__navigation_minimized {
		width: 100%;
	}
</style>
