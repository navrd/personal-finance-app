<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BlankButtonProps {
		onclick?: (...args: any[]) => any;
		children?: Snippet;
		ariaLabel?: string;
		absolute?: boolean;
		type?: 'button' | 'submit' | 'reset' | null | undefined;
		fullWidth?: boolean;
		flexStart?: boolean;
	}

	let {
		onclick,
		children,
		ariaLabel,
		absolute,
		type = 'button',
		fullWidth = false,
		flexStart = false
	}: BlankButtonProps = $props();
</script>

<button
	class="blank-button"
	{onclick}
	aria-label={ariaLabel}
	{type}
	class:blank-button_absolute={absolute}
	class:blank-button_full-width={fullWidth}
	class:blank-button_flex-start={flexStart}>{@render children?.()}</button
>

<style lang="css">
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
		z-index: 9998;
		border: none;
		background: transparent;
		cursor: pointer;
	}
	.blank-button_full-width {
		width: 100%;
		flex: var(--fill-evenly);
		justify-content: space-between;
	}
	.blank-button_flex-start {
		justify-content: flex-start;
	}
</style>
