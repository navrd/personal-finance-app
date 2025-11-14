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
		gap: var(--gap-xs);
	}
	.label {
		text-transform: capitalize;
		font-size: var(--font-size-xs);
		line-height: var(--line-height);
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.container {
		position: relative;
		width: var(--full-container-width);
		color: var(--color-grey-900);
		border: var(--thin-border-beige-500);
		border-radius: var(--radius-s);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: var(--gap-m);
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		padding: var(--padding-xl) var(--padding-m);
	}
	.container_error {
		border-color: var(--color-red);
	}

	.input {
		border-radius: inherit;
		width: var(--full-container-width);
		border: var(--no-border);
		outline: none;
		font-size: var(--font-size-s);
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
		font-size: var(--font-size-s);
		color: var(--color-red);
		text-wrap: wrap;
	}
</style>
