<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CustomButtonProps {
		onclick?: (...args: any[]) => any;
		children?: Snippet;
		type?: 'button' | 'submit' | 'reset' | null | undefined;
		disabled?: boolean;
	}

	let { onclick, children, type = 'button', disabled }: CustomButtonProps = $props();
</script>

<button {type} class="button" {disabled} {onclick}>{@render children?.()}</button>

<style lang="scss">
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		height: 3.5rem;
		&:hover,
		&:active,
		&:focus,
		&:disabled {
			cursor: pointer;
			opacity: 50%;
		}
	}
</style>
