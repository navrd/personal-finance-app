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
		width: var(--full-screen-width);
		height: var(--full-screen-height);
		min-height: var(--full-screen-height);
		max-width: var(--full-screen-width);
		max-height: var(--full-screen-height);
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--color-beige-100);
		font-size: var(--font-size-l);
		overflow: hidden;
	}
	.error-content {
		padding: var(--padding-xxxl);
		min-width: fit-content;
		max-width: fit-content;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--gap-l);
		background: var(--color-yellow);
		color: var(--color-grey-900);
		overflow: hidden;
		border-radius: var(--radius-s);
		border: var(--thin-border-beige-500);
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
