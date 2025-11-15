<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { BlankButton } from './utility';
	import { ArrowRight } from '$lib/assets/images';
	import { clickoutside } from '@svelte-put/clickoutside';

	interface CustomSelectProps<T> {
		// Snippet for rendering individual options in the dropdown
		children: Snippet<[T]>;
		// Snippet for rendering the selected option display
		selectedDisplay?: Snippet<[T | null]>;
		label: string;
		options: T[];
		selectedOption: T | null;
		onOptionClick: (option: T) => void;
		// Optional: custom placeholder when nothing is selected
		placeholder?: string;
		hiddenInput?: boolean;
		inputName?: string;
		inputValue?: string | number;
		disabled?: boolean;
		validator?: (value: string) => string | null; // New prop for validation function
	}

	let {
		children,
		selectedDisplay,
		label,
		options,
		selectedOption,
		onOptionClick,
		placeholder = 'Select an option',
		hiddenInput,
		inputName,
		inputValue = $bindable(),
		validator,
		disabled
	}: CustomSelectProps<T> = $props();

	// Internal touched state
	let touched = $state(false);

	let showOptions = $state(false);

	function clickOutside(e: CustomEvent<MouseEvent>) {
		if (showOptions) {
			touched = true;
		}
		showOptions = false;
		e.stopPropagation();
	}

	function onSelectedOptionClick() {
		showOptions = !showOptions;
	}
	// Computed error message - only show if touched and validator exists
	const errorMessage = $derived.by(() => {
		if (!touched || !validator) return null;
		return validator(String(inputValue) || '');
	});
</script>

<div class="custom-select" use:clickoutside onclickoutside={clickOutside}>
	<p class="custom-select__label">{label}</p>
	<div
		class="custom-select__selected-option"
		class:custom-select__selected-option_error={errorMessage}
	>
		<BlankButton onclick={onSelectedOptionClick} fullWidth>
			<div class="selected-option__content">
				{#if selectedDisplay}
					<!-- Use custom selected display snippet -->
					{@render selectedDisplay(selectedOption)}
				{:else if selectedOption}
					<!-- Fallback: render selected option using the same children snippet -->
					{@render children(selectedOption)}
				{:else}
					<!-- Placeholder when nothing is selected -->
					<span class="placeholder">{placeholder}</span>
				{/if}
			</div>
			<div
				class="selected-option__dropdown-icon"
				class:selected-option__dropdown-icon__active={showOptions}
			>
				{@html ArrowRight}
			</div>
		</BlankButton>
		{#if hiddenInput}
			<input type="hidden" name={inputName} value={inputValue} />
		{/if}
	</div>
	{#if errorMessage}<p class="error">{errorMessage}</p>{/if}

	{#if showOptions}
		<ul class="custom-select__options">
			{#each options as option}
				<li class="option">
					<BlankButton
						fullWidth
						onclick={() => {
							onOptionClick(option);
							showOptions = false;
							touched = true;
						}}
					>
						{@render children(option)}
					</BlankButton>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.custom-select {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--gap-xs);
	}
	.custom-select__label {
		text-transform: capitalize;
		font-size: var(--font-size-xs);
		line-height: var(--line-height);
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.custom-select__selected-option {
		width: var(--full-container-width);
		color: var(--color-grey-900);
		border: var(--thin-border-beige-500);
		border-radius: var(--radius-s);
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		padding: var(--padding-xl) var(--padding-m);
	}
	.custom-select__selected-option_error {
		border-color: var(--color-red);
	}
	.selected-option__content {
		display: flex;
		justify-content: space-between;
	}
	.option {
		width: var(--full-container-width);
		color: var(--color-grey-900);

		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		padding: var(--padding-xl) var(--padding-m);
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.selected-option__dropdown-icon {
		max-width: 0.875rem;
		max-height: 0.875rem;
		transform: rotate(90deg);
		transition: transform 0.25s ease;
	}
	.selected-option__dropdown-icon__active {
		transform: rotate(270deg);
	}
	.custom-select__options {
		width: var(--full-container-width);
		position: absolute;
		top: calc(100% + 0.25rem);
		display: flex;
		flex-direction: column;
		max-height: 15rem;
		background: white;
		z-index: 5;
		overflow: auto;
		border-radius: var(--radius-s);
		box-shadow: var(--box-shadow);
	}
	.error {
		font-size: var(--font-size-s);
		color: var(--color-red);
		text-wrap: wrap;
	}
</style>
