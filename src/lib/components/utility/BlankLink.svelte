<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BlankButtonProps {
		onclick?: (...args: any[]) => any;
		children?: Snippet;
		ariaLabel?: string;
		absolute?: boolean;
		relative?: boolean;
		href: string;
	}

	let { onclick, children, absolute, relative, href }: BlankButtonProps = $props();
</script>

<a
	{href}
	class="blank-link"
	{onclick}
	class:blank-link_absolute={absolute}
	class:blank-link_relative={relative}>{@render children?.()}</a
>

<style lang="scss">
	.blank-link {
		display: flex;
		position: inherit;
		align-items: inherit;
		justify-content: inherit;
		flex-direction: inherit;
		gap: inherit;
		text-decoration: none;
		color: inherit;
		min-width: inherit;
		min-height: inherit;
		width: inherit;
		height: inherit;
		background: transparent;
		font-size: inherit;
		font-weight: inherit;
		font-style: inherit;
		border: none;
		outline: none;
		&:visited,
		&:hover,
		&:active {
			text-decoration: none;
		}
	}
	.blank-link_absolute {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--full-container-width);
		height: var(--full-container-height);
		border: none;
		background: transparent;
		cursor: pointer;
	}
	.blank-link_relative {
		position: relative;
		/* top: 0;
		left: 0; */
		width: var(--full-container-width);
		height: var(--full-container-height);
		border: none;
		background: transparent;
		cursor: pointer;
	}
</style>
