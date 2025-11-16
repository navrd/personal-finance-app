<script lang="ts">
	import { PotsManager, CustomButton } from '$lib/components';
	import type { PotError } from '$lib/types';
	import { type PageData } from '../$types';

	interface Props {
		data: PageData;
		form?: PotError | null;
	}

	let { form }: Props = $props();

	let showForm = $state(false);
</script>

<svelte:head>
	<title>Personal Finance App - Pots</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<header class="page-header">
	<h2 class="page-header__title">Pots</h2>
	<div class="page-header__buttons">
		<CustomButton onclick={() => (showForm = true)}>+ Add new pot</CustomButton>
	</div>
</header>

<PotsManager {form} bind:showForm />

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 53px;
	}
	.page-header__title {
		color: var(--color-grey-900);
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: var(--font-weight-550);
		font-weight: bolder;
	}
	.page-header__buttons {
		display: flex;
		gap: var(--space-m);
		align-items: center;
		justify-content: flex-end;
	}
</style>
