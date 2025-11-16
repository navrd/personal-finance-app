<script lang="ts">
	import { page } from '$app/state';

	const status = $derived(page.status);
	const message = $derived(page.error?.message || 'An error occurred');
</script>

<svelte:head>
	<title>{status} — {message}</title>
</svelte:head>

<div class="error-page">
	<div class="error-content">
		<h1>{status}</h1>
		<p>{message}</p>
	</div>
</div>

<style lang="scss">
	.error-page {
		width: var(--viewport-width);
		height: var(--viewport-height);
		min-height: var(--viewport-height);
		max-width: var(--viewport-width);
		max-height: var(--viewport-height);
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-beige-100);
		font-size: var(--font-size-l);
		overflow: hidden;
	}
	.error-content {
		padding: var(--space-xxxl);
		min-width: fit-content;
		max-width: fit-content;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--space-l);
		background: var(--color-yellow);
		color: var(--color-grey-900);
		overflow: hidden;
		border-radius: var(--radius-s);
		border: var(--border-thin) solid var(--color-grey-500);
		h1 {
			font-size: var(--font-size-xxxl);
			font-weight: bolder;
		}
		p {
			font-weight: var(--font-weight-500);
			color: var(--color-grey-500);
			font-size: var(--font-size-xxl)
		}
	}
</style>
