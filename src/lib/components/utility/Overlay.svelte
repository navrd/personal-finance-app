<script lang="ts">
	import { BlankButton } from '$lib/components/utility';
	import { type Snippet } from 'svelte';

	const OVERLAY_ANIMATION_DURATION = 500;

	interface FormOverlayProps {
		show: boolean;
		slideInFrom?: 'top' | 'left' | 'bottom' | 'right' | 'none';
		children?: Snippet;
		onclose: () => void;
		animationDuration?: number;
	}

	let {
		show,
		slideInFrom = 'top',
		children,
		onclose,
		animationDuration = OVERLAY_ANIMATION_DURATION
	}: FormOverlayProps = $props();

	let timeoutId: NodeJS.Timeout | null = null;
	let centered = $state(false);

	export function close() {
		centered = false;
		timeoutId = setTimeout(() => {
			show = false;
			timeoutId = null;
			onclose();
		}, animationDuration);
	}

	$effect(() => {
		if (show) {
			timeoutId = setTimeout(() => {
				centered = true;
				timeoutId = null;
			}, 0);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};
	});
</script>

{#if show}
	<div class="overlay">
		<BlankButton absolute onclick={close} />
		<div
			class="wrapper"
			style:--animation-duration="{animationDuration}ms"
			class:wrapper_static={slideInFrom === 'none'}
			class:wrapper_from-top={slideInFrom === 'top'}
			class:wrapper_from-bottom={slideInFrom === 'bottom'}
			class:wrapper_from-left={slideInFrom === 'left'}
			class:wrapper_from-right={slideInFrom === 'right'}
			class:wrapper_centered={centered}
		>
			{@render children?.()}
		</div>
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		width: var(--viewport-width);
		height: var(--viewport-height);
		background: rgba(0, 0, 0, 0.25);
		z-index: 9;
	}

	.wrapper {
		position: fixed;
		padding: var(--space-l);
		background: white;
		@media screen and (min-width: 800px) {
			max-width: 40dvw;
		}
		display: flex;
		flex-direction: column;
		gap: var(--space-xxl);
		border: 1px solid var(--color-grey-900);
		transition: transform var(--animation-duration) ease-in-out;
		border-radius: var(--radius-l);
		max-height: 75dvh;
		z-index: 10;

		@media screen and (max-width: 899px) {
			width: 90dvw;
		}

		@media screen and (min-width: 900px) {
			width: fit-content;
			max-width: 40dvw;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgb(130, 143, 163);
			border-radius: var(--radius-xl);
			width: 0.625rem;
			height: 1.25rem;
		}

		&::-webkit-scrollbar {
			width: 0.5rem;
			height: 0.5rem;
		}
	}

	.wrapper_from-top {
		transform: translate(calc((var(--viewport-width) / 2) - 50%), -100%);
	}

	.wrapper_from-bottom {
		transform: translate(calc((var(--viewport-width) / 2) - 50%), var(--viewport-height));
	}

	.wrapper_from-left {
		transform: translate(-100%, calc(50dvh - 50%));
	}

	.wrapper_from-right {
		transform: translate(var(--viewport-width), calc(50dvh - 50%));
	}

	.wrapper_centered {
		transform: translate(calc((var(--viewport-width) / 2) - 50%), calc(50dvh - 50%));
	}

	.wrapper_static {
		background: transparent;
		transition: none;
		border-color: transparent;
	}
</style>
