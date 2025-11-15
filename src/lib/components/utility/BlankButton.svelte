<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BlankButtonProps {
		onclick?: (...args: any[]) => any;
		children?: Snippet;
		ariaLabel?: string;
		absolute?: boolean;
		type?: "button" | "submit" | "reset" | null | undefined;
		fullWidth?: boolean
	}

	let { onclick, children, ariaLabel, absolute, type = "button", fullWidth = false }: BlankButtonProps = $props();
</script>

<button class="blank-button" {onclick} aria-label={ariaLabel} {type} class:blank-button_absolute={absolute} class:blank-button_full-width={fullWidth}
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
		width: var(--full-container-width);
		height: var(--full-container-height);
		border: none;
		background: transparent;
		cursor: pointer;
	}
	.blank-button_full-width {
		width: var(--full-container-width);
		flex: 1;
		justify-content: space-between;
	}
</style>
