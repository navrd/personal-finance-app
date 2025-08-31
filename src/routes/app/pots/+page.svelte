<script lang="ts">
	import PotsManager from '$lib/components/pots/PotsManager.svelte';
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
	<div class="page-header__buttons"><button class="button" onclick={() => showForm = true}>+ Add new pot</button></div>
</header>

<PotsManager {form} bind:showForm/>

<style lang="scss">
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 53px;
	}
	.page-header__title {
		color: var(--color-grey-900);
		font-size: 2rem;
		line-height: 1.2;
		font-weight: 550;
		font-weight: bolder;
	}
	.page-header__buttons {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		justify-content: flex-end;
	}
	.button {
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		height: 3.5rem;
		&:hover,
		&:active,
		&:focus {
			cursor: pointer;
			opacity: 50%;
		}
	}
</style>
