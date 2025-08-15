<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BlankButtonProps {
		onclick?: (...args: any[]) => any;
		children?: Snippet;
		ariaLabel?: string;
		absolute?: boolean;
		type?: "button" | "submit" | "reset" | null | undefined;
	}

	let { onclick, children, ariaLabel, absolute, type = "button" }: BlankButtonProps = $props();
</script>

<button class="blank-button" {onclick} aria-label={ariaLabel} {type} class:blank-button_absolute={absolute}
	>{@render children?.()}</button
>

<style lang="scss">
	.blank-button {
		display: flex;
		flex-direction: inherit;
		gap: inherit;
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
		color: inherit;
		fill: inherit;
	}
	.blank-button_absolute {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		cursor: pointer;
	}
</style>
