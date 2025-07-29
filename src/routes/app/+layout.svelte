<script lang="ts">
	import { Sidebar } from '$lib/components';
	import type { StateWrapper } from '$lib/types/index.js';
	import { getContext } from 'svelte';
	let minimize: StateWrapper<boolean> = getContext('minimize');

	let { children } = $props();
</script>

<Sidebar />
<main class="content" class:content_expanded={minimize.value}>
	{@render children?.()}
</main>

<style lang="scss">
	.content {
		background: var(--color-beige-100);
		min-width: 100%;
		max-width: 100%;
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
