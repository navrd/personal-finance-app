<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let errorMessage = $derived(
		$page.url.searchParams.get('message') || 'An authentication error occurred'
	);
</script>

// /auth/error/+page.svelte (Svelte 5 with TypeScript)
<div class="error-container">
	<div class="error-card">
		<h1>Authentication Error</h1>
		<p>{errorMessage}</p>
		<div class="actions">
			<button onclick={() => goto('/auth')} type="button">Try Again</button>
			<button onclick={() => goto('/')} type="button">Go Home</button>
		</div>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: var(--padding-l);
	}

	.error-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: var(--padding-xxxl);
		text-align: center;
		max-width: 400px;
		border-left: 4px solid #dc2626;
	}

	h1 {
		color: #dc2626;
		margin-bottom: 1rem;
		font-size: var(--font-size-xxl)
	}

	p {
		margin-bottom: 2rem;
		color: #6b7280;
		line-height: var(--line-height-l);
	}

	.actions {
		display: flex;
		gap: var(--gap-l);
		justify-content: center;
		flex-wrap: wrap;
	}

	button {
		padding: var(--padding-m) var(--padding-xxl);
		border: 1px solid #d1d5db;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
		font-size: var(--font-size-s);
	}

	button:first-child {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	button:hover {
		background: #f3f4f6;
		transform: translateY(-1px);
	}

	button:first-child:hover {
		background: #2563eb;
		color: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:first-child {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	button:hover {
		background: #f3f4f6;
	}

	button:first-child:hover {
		background: #2563eb;
	}
</style>
