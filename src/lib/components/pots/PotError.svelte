<script lang="ts">
	import type { PotError } from '$lib/types';

	interface PotErrorProps {
		form?: PotError | null;
		clearForm: () => void;
	}

	let { form, clearForm }: PotErrorProps = $props();
</script>

{#if form && Object.keys(form).length > 0}
	<h2>{form.message}</h2>
	<button onclick={clearForm}>Clear errors</button>
{/if}
