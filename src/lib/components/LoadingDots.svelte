<script lang="ts">
	interface LoadingDotsProps {
		dotColor?: string;
	}
	let { dotColor = 'white' }: LoadingDotsProps = $props();
</script>

<div class="loading-dots">
	<div class="loading-dots__container">
		<div class="loading__dot" style:background={dotColor}></div>
		<div class="loading__dot" style:background={dotColor}></div>
		<div class="loading__dot" style:background={dotColor}></div>
	</div>
</div>

<style lang="scss">
	.loading-dots {
		width: var(--full-container-width);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.loading-dots__container {
		width: 5rem;
		height: inherit;
		min-height: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	@for $i from 1 through 10 {
		.loading-dots__container :nth-child(#{$i}n) {
			animation-delay: #{$i * 0.25}s;
		}
	}
	@keyframes flickerAnimation {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.loading__dot {
		width: 1rem;
		height: 1rem;
		background: white;
		border-radius: var(--radius-round);
		animation: flickerAnimation 1s ease infinite;
	}
</style>
