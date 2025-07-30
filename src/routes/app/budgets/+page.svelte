<script lang="ts">
	import { BudgetsOverview } from '$lib/components';
	import BudgetsManager from '$lib/components/budgets/BudgetsManager.svelte';
	import type { BudgetError } from '$lib/types/index.js';
	import { type PageData } from '../$types.js';
	interface Props {
		data: PageData;
		form?: BudgetError | null;
	}

	let { form, data }: Props = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Budgets</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<BudgetsOverview />
<BudgetsManager {form} />
