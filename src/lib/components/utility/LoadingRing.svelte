<script lang="ts">
	interface LoadingRingProps {
		loadingRingSize: string;
		animationDuration?: number | string;
	}

	let { loadingRingSize = '4rem', animationDuration = '1.6s' }: LoadingRingProps = $props();
</script>

<div
	class="loading-ring"
	style:--data-size={loadingRingSize}
	style:--data-duration={animationDuration}
>
	<div class="loading-ring__underlay-ring"></div>
	<div class="loading-ring__indicator"></div>
	<div class="loading-ring__indicator"></div>
	<div class="loading-ring__indicator"></div>
	<div class="loading-ring__indicator"></div>
</div>

<style lang="scss">
	@for $i from 1 through 3 {
		.loading-ring :nth-child(#{$i}n) {
			animation-delay: calc(((4 - #{$i}) * var(--data-duration) / -8));
		}
	}
	.loading-ring {
		color: var(--color-brown);
		display: inline-block;
		position: relative;
		width: var(--data-size);
		height: var(--data-size);
		display: flex;
		justify-content: center;
		align-items: center;
		.loading-ring__underlay-ring {
			z-index: 2;
			display: block;
			border-radius: var(--radius-round);
			width: calc(var(--data-size) * 0.8);
			height: calc(var(--data-size) * 0.8);
			border: calc(var(--data-size) * 0.1) solid var(--color-yellow);
		}
		.loading-ring__indicator {
			z-index: 3;
			box-sizing: border-box;
			display: block;
			position: absolute;
			width: calc(var(--data-size) * 0.8);
			height: calc(var(--data-size) * 0.8);
			margin: calc(var(--data-size) * 0.1);
			border: calc(var(--data-size) * 0.1) solid currentColor;
			border-radius: var(--radius-round);
			animation: loading-ring var(--data-duration) cubic-bezier(0.5, 0, 0.5, 1) infinite;
			border-color: currentColor transparent transparent transparent;
		}
	}
	@keyframes loading-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
