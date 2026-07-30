<script lang="ts" generics="T">
	import { MobileDropdownFilter, DesktopDropdownFilter } from '$lib/components/dropdownFilter';
	import type { DropdownFilterProps } from '$lib/types';

	let {
		labelKey,
		valueKey,
		selected = $bindable(),
		options,
		defaultValue = false,
		label,
		icon
	}: DropdownFilterProps<T> = $props();

	let mobileVisible = $state(false);
	let desktopVisible = $state(false);
	let optionsVisible = $state(false);
	let innerWidth = $state(0);

	function setupMobile() {
		mobileVisible = true;
		desktopVisible = false;
	}
	function setupDesktop() {
		mobileVisible = false;
		desktopVisible = true;
	}

	$effect(() => {
		innerWidth >= 649 ? setupDesktop() : null;
	});

	$effect(() => {
		innerWidth < 649 ? setupMobile() : null;
	});
</script>

<svelte:window bind:innerWidth />

<div class="filter-wrapper">
	{#if mobileVisible}
		<MobileDropdownFilter
			{label}
			{labelKey}
			{valueKey}
			{options}
			{icon}
			{defaultValue}
			bind:selected
			bind:optionsVisible
			bind:mobileVisible
		/>
	{/if}
	{#if desktopVisible}
		<DesktopDropdownFilter
			{label}
			{labelKey}
			{valueKey}
			{options}
			{icon}
			{defaultValue}
			bind:selected
			bind:optionsVisible
			bind:mobileVisible
		/>
	{/if}
</div>

<style lang="css">
	.filter-wrapper {
		display: flex;
		gap: var(--space-m);
		align-items: center;
		min-width: inherit;
		max-width: inherit;
		@media screen and (max-width: 632px) {
			min-width: 20px;
			max-width: 20px;
		}
	}
</style>
