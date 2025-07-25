<script lang="ts">
	import PotsManager from "$lib/components/pots/PotsManager.svelte";
	import type { PotError } from "$lib/types";
	import { type PageData } from "../$types";

	interface Props {
		data: PageData;
		form?: PotError | null;
	}

	let { form, data }: Props = $props();
</script>

<svelte:head>
	<title>Personal Finance App - Pots</title>
	<meta name="description" content="Personal Finance App" />
</svelte:head>

<PotsManager {form}/>

