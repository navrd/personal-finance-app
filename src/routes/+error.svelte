<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An error occurred');
</script>

<div class="error-page">
	<div class="error-content">
		<h1>{status}</h1>
		<p>{message}</p>
	</div>
</div>

<style lang="scss">
	.error-page {
		width: 100dvw;
		height: 100dvh;
		min-height: 100dvh;
		max-width: 100dvw;
		max-height: 100dvh;
		display: flex;
		justify-content: center;
		align-items: center;
        background: var(--color-beige-100);
		font-size: 1.125rem;
		overflow: hidden;
	}
	.error-content {
		padding: 2rem;
		min-width: fit-content;
		max-width: fit-content;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 1rem;
		background: var(--color-yellow);
		color: var(--color-grey-900);
		overflow: hidden;
		border-radius: 0.5rem;
		border: 1px solid var(--color-beige-500);
		h1 {
			font-size: 2rem;
			font-weight: bolder;
		}
		p {
			font-weight: 500;
			color: var(--color-grey-500);
			font-size: 1.5rem;
		}
	}
</style>
