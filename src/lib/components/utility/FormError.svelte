<script lang="ts">
	import type { BudgetError, PotError } from '$lib/types';

	interface FormErrorProps {
		form?: PotError | BudgetError | null;
		clearForm: () => void;
	}

	let { form, clearForm }: FormErrorProps = $props();
</script>

{#if form && Object.keys(form).length > 0}
	<h2>{form.message}</h2>
	<button onclick={clearForm}>Clear errors</button>
{/if}
