<script lang="ts">
	import type { BudgetError, PotError } from '$lib/types';

	interface BudgetErrorProps {
		form?: BudgetError | null;
		clearForm: () => void;
	}

	let { form, clearForm }: BudgetErrorProps = $props();
</script>

{#if form && Object.keys(form).length > 0}
	<h2>{form.message}</h2>
	<button onclick={clearForm}>Clear errors</button>
{/if}
