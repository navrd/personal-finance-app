<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	interface CustomInputProps {
		value?: string | number;
		icon?: string;
		type: HTMLInputTypeAttribute;
		placeholder?: string;
		symbol?: string;
		name?: string;
		id?: string;
		label?: string;
		disabled?: boolean;
		validator?: (value: string | number) => string | null; // New prop for validation function
	}

	let {
		value = $bindable(),
		icon,
		type,
		placeholder = '',
		symbol,
		name,
		id,
		label,
		disabled,
		validator
	}: CustomInputProps = $props();

	// Internal touched state
	let touched = $state(false);

	// Computed error message - only show if touched and validator exists
	const errorMessage = $derived.by(() => {
		if (!touched || !validator) return null;
		return validator(value || '');
	});
	function onblur() {
		touched = true;
	}
</script>

<div class="wrapper">
	{#if label}
		<label for={id} class="label">{label}</label>
	{/if}
	<div class="container" class:container_error={errorMessage}>
		{#if icon}
			<div class="icon">
				{@html icon}
			</div>
		{/if}
		{#if symbol}<div class="symbol">{symbol}</div>{/if}
		<input class="input" {id} {type} {name} {placeholder} {disabled} bind:value {onblur} />
	</div>
	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.label {
		text-transform: capitalize;
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.container {
		position: relative;
		width: 100%;
		color: var(--color-grey-900);
		border: 1px solid var(--color-beige-500);
		border-radius: 0.5rem;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		padding: 1.25rem 0.75rem;
	}
	.container_error {
		border-color: var(--color-red);
	}

	.input {
		border-radius: inherit;
		width: 100%;
		border: 0;
		outline: none;
		font-size: 0.875rem;
	}

	.icon,
	.symbol {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		pointer-events: none;
	}
	.error {
		font-size: 0.875rem;
		color: var(--color-red);
	}
</style>
