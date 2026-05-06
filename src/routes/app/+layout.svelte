<script lang="ts">
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { Sidebar } from '$lib/components';
	import { Overlay, LoadingRing } from '$lib/components/utility/';
	import type { StateWrapper } from '$lib/types/index.js';
	import { getContext } from 'svelte';
	let minimize: StateWrapper<boolean> = getContext('minimize');

	let { children } = $props();

	let isNavigating = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = $state(null);

	const SHOW_DELAY = 220;

	beforeNavigate(({ from, to, type }) => {
		if (type === 'leave') return;
		if (from?.url?.pathname === to?.url?.pathname) return;

		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			isNavigating = true;
		}, SHOW_DELAY);
	});

	afterNavigate(({ to }) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		isNavigating = false;
	});
</script>

<Sidebar />
<main class="content" class:content_expanded={minimize.value}>
	<div class="content-wrapper">
		{@render children?.()}
	</div>
</main>

<Overlay slideInFrom="none" show={isNavigating} onclose={() => {}}
	><LoadingRing loadingRingSize="5rem" /></Overlay
>

<style lang="scss">
	.content {
		background: var(--color-beige-100);
		min-width: 100%;
		max-width: 100%;
		transition: padding 0.3s ease;
		@media screen and (min-width: 0px) and (max-width: 1023px) {
			padding-bottom: var(--sidebar-height);
		}
		@media screen and (min-width: 1024px) {
			padding-left: var(--sidebar-width);
		}
	}
	.content_expanded {
		@media screen and (min-width: 1024px) {
			padding-left: 5rem;
		}
	}
	.content-wrapper {
		padding: var(--space-l);
		display: flex;
		flex-direction: column;
		gap: var(--space-xxl);
	}
</style>
