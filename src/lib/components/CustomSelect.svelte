<script lang="ts" generics="T">
	import { tick, type Snippet } from 'svelte';
	import { BlankButton } from './utility';
	import { ArrowRight } from '$lib/assets/images';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { TOOLTIP_FALLBACKS } from '$lib/constants';
	import { clamp, computeAlignedPosition, fitsInViewport } from '$lib/helpers';
	import { scale } from 'svelte/transition';

	interface CustomSelectProps<T> {
		children: Snippet<[T]>;
		selectedDisplay?: Snippet<[T | null]>;
		label: string;
		options: T[];
		selectedOption: T | null;
		onOptionClick: (option: T) => void;
		placeholder?: string;
		hiddenInput?: boolean;
		inputName?: string;
		inputValue?: string | number;
		disabled?: boolean;
		validator?: (value: string) => string | null;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		align?: 'start' | 'end';
		offset?: number;
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
		disabled,
		placement = 'bottom',
		align = 'end',
		offset = 8
	}: CustomSelectProps<T> = $props();

	let touched = $state(false);
	let triggerEl = $state<HTMLElement | null>(null);
	let triggerElWidth: number = $derived(triggerEl ? triggerEl.getBoundingClientRect().width : 0);
	let containerEl = $state<HTMLElement | null>(null);
	let coords = $state({ x: 0, y: 0 });
	let resolvedPlacement = $state(placement);
	let ready = $state(false);

	let showOptions = $state(false);

	function clickOutside(e: CustomEvent<MouseEvent>) {
		if (showOptions) {
			touched = true;
		}
		showOptions = false;
		e.stopPropagation();
	}

	const errorMessage = $derived.by(() => {
		if (!touched || !validator) return null;
		return validator(String(inputValue) || '');
	});

	function close() {
		showOptions = false;
	}

	const ORIGIN_VERTICAL: Record<'top' | 'bottom', 'top' | 'bottom'> = {
		top: 'bottom',
		bottom: 'top'
	};
	let transformOrigin = $derived.by(() => {
		if (resolvedPlacement === 'top' || resolvedPlacement === 'bottom') {
			const vertical = ORIGIN_VERTICAL[resolvedPlacement];
			const horizontal = align === 'end' ? 'right' : 'left';
			return `${vertical} ${horizontal}`;
		}
		const horizontal = resolvedPlacement === 'left' ? 'right' : 'left';
		const vertical = align === 'end' ? 'bottom' : 'top';
		return `${vertical} ${horizontal}`;
	});

	async function position(triggerEl: HTMLElement, containerEl: HTMLElement) {
		if (!triggerEl || !containerEl) return;

		const triggerRect = triggerEl.getBoundingClientRect();
		const menuRect = containerEl.getBoundingClientRect();

		for (const p of TOOLTIP_FALLBACKS[placement]) {
			const pos = computeAlignedPosition(triggerRect, menuRect, p, align, offset);
			if (fitsInViewport(pos, menuRect)) {
				coords = pos;
				resolvedPlacement = p;
				return;
			}
		}
		resolvedPlacement = placement;

		coords = clamp(
			computeAlignedPosition(triggerRect, menuRect, placement, align, offset),
			menuRect
		);
	}

	async function open() {
		ready = false;
		showOptions = true;
		await tick();
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		await position(triggerEl!, containerEl!);
		ready = true;
	}

	function onclick(e: MouseEvent) {
		e.stopPropagation();
		if (showOptions) {
			close();
		} else {
			open();
		}
	}

	function onclickoutside(e: CustomEvent<MouseEvent>) {
		close();
		e.stopPropagation();
	}

	function onScroll() {
		if (showOptions) positionMenu();
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}
	export async function positionMenu() {
		if (!triggerEl || !containerEl) return;
		await tick();
		await tick();
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		await position(triggerEl!, containerEl!);
	}
</script>

<svelte:window
	onscroll={onScroll}
	onresize={onScroll}
/>

<div class="custom-select" use:clickoutside onclickoutside={clickOutside}>
	<p class="custom-select__label">{label}</p>
	<div
		class="custom-select__selected-option"
		class:custom-select__selected-option_error={errorMessage}
		bind:this={triggerEl}
	>
		<BlankButton {onclick} fullWidth>
			<div class="selected-option__content">
				{#if selectedDisplay}
					{@render selectedDisplay(selectedOption)}
				{:else if selectedOption}
					{@render children(selectedOption)}
				{:else}
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
		<ul
			class="custom-select__options"
			bind:this={containerEl}
			use:portal
			use:clickoutside
			{onclickoutside}
			class:custom-select__options--enter={ready}
			style:left="{coords.x}px"
			style:top="{coords.y}px"
			style:visibility={ready ? 'visible' : 'hidden'}
			style:transform-origin={transformOrigin}
			style:width="{triggerEl.getBoundingClientRect().width}px"
			out:scale={{ duration: 300, start: 0 }}
		>
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

<style lang="css">
	.custom-select {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.custom-select__label {
		text-transform: capitalize;
		font-size: var(--font-size-xs);
		line-height: var(--line-height);
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.custom-select__selected-option {
		width: 100%;
		color: var(--color-grey-900);
		border: var(--border-thin) solid var(--color-grey-500);
		border-radius: var(--radius-s);
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		padding: var(--space-xl) var(--space-m);
	}
	.custom-select__selected-option_error {
		border-color: var(--color-red);
	}
	.selected-option__content {
		display: flex;
		justify-content: space-between;
	}
	.option {
		width: 100%;
		color: var(--color-grey-900);

		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		padding: var(--space-xl) var(--space-m);
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
		/* width: 100%; */
		position: fixed;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		max-height: 15rem;
		background: white;
		overflow: auto;
		border-radius: var(--radius-s);
		box-shadow: var(--box-shadow);
	}
	.custom-select__options--enter {
		animation: context-in 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
	.error {
		font-size: var(--font-size-s);
		color: var(--color-red);
		text-wrap: wrap;
	}
</style>
