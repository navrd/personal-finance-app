<script lang="ts" generics="T">
	import { ArrowRight } from '$lib/assets/images';
	import { TOOLTIP_FALLBACKS } from '$lib/constants';
	import { clamp, computeAlignedPosition, fitsInViewport } from '$lib/helpers';
	import type { DropdownFilterProps } from '$lib/types';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';

	let {
		labelKey,
		valueKey,
		selected = $bindable(),
		options,
		defaultValue = false,
		label,
		icon,
		optionsVisible = $bindable(),
		mobileVisible = $bindable()
	}: DropdownFilterProps<T> & { optionsVisible: boolean; mobileVisible: boolean } = $props();

	let triggerEl = $state<HTMLElement | null>(null);
	let placement = $state<'bottom' | 'top' | 'right' | 'left'>('bottom');
	let align = $state<'start' | 'end'>('end');
	let offset = $state(8);
	let triggerElWidth: number = $derived(triggerEl ? triggerEl.getBoundingClientRect().width : 0);
	let containerEl = $state<HTMLElement | null>(null);
	let coords = $state({ x: 0, y: 0 });
	// svelte-ignore state_referenced_locally
	let resolvedPlacement = $state<'bottom' | 'top' | 'right' | 'left'>(placement);
	let ready = $state(false);

	let selectedOptionLabel = $derived.by(() => {
		if (defaultValue && selected === 'All') {
			return 'All';
		} else {
			let selectedOption = options.find((option) => option[valueKey] === selected);

			return selectedOption![labelKey];
		}
	});

	const onSelectedOptionClick = async () => {
		optionsVisible = !optionsVisible;
		await tick();
	};

	const onOptionClick = (option: string) => {
		selected = option;
		optionsVisible = false;
	};

	function clickOutside(e: CustomEvent<MouseEvent>) {
		optionsVisible = false;
		e.stopPropagation();
	}

	function close() {
		optionsVisible = false;
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
		optionsVisible = true;
		await tick();
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		await position(triggerEl!, containerEl!);
		ready = true;
	}

	function onclick(e: MouseEvent) {
		e.stopPropagation();
		if (optionsVisible) {
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
		if (optionsVisible) positionMenu();
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

<svelte:window onscroll={onScroll} onresize={onScroll} />

<span class="filter-label">{label}</span>
<div class="filter" use:clickoutside onclickoutside={() => (optionsVisible = false)}>
	<div class="filter__active-option-wrapper" bind:this={triggerEl}>
		<button class="filter__active-option" type="button" {onclick}>
			<span
				>{#if selected}
					{selectedOptionLabel}{:else}
					{labelKey}{/if}</span
			>
			<div class="dropdown-icon" class:dropdown-icon__active={optionsVisible}>
				{@html ArrowRight}
			</div>
		</button>
	</div>
	{#if optionsVisible}
		<div
			class="filter-options-wrapper"
			bind:this={containerEl}
			use:portal
			use:clickoutside
			{onclickoutside}
			class:filter-options-wrapper--enter={ready}
			style:left="{coords.x}px"
			style:top="{coords.y}px"
			style:visibility={ready ? 'visible' : 'hidden'}
			style:transform-origin={transformOrigin}
			style:width="{triggerElWidth}px"
			out:scale={{ duration: 300, start: 0 }}
		>
			<ul class="filter__options">
				{#if defaultValue}
					<button class="filter__option-wrapper" onclick={() => onOptionClick('All')}>
						<li class={['filter__option', { filter__option_active: 'All' === selected }]}>All</li>
					</button>
				{/if}
				{#each options as option}
					<button
						class="filter__option-wrapper"
						onclick={() => onOptionClick(String(option[valueKey]))}
					>
						<li
							class={['filter__option', { filter__option_active: option[valueKey] === selected }]}
						>
							{option[labelKey]}
						</li>
					</button>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.filter {
		position: relative;
		min-height: 58px;
		display: flex;
		flex-direction: column;
		margin: 0;
		border-radius: var(--radius-xs);
		background: white;
		z-index: 1;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		color: var(--color-grey-500);
	}
	.filter-label {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		color: var(--color-grey-500);
	}

	.filter__active-option-wrapper {
		cursor: pointer;
		min-width: inherit;
		min-height: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
		@media screen and (min-width: 633px) {
			min-width: 150px;
			max-width: 150px;
		}
	}
	.filter__active-option {
		cursor: pointer;
		width: 100%;
		min-width: inherit;
		min-height: inherit;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-xl) var(--space-m);
		height: max-content;
		border: var(--border-thin) solid var(--color-grey-500);
		border-radius: var(--radius-s);
		outline: none;
		background: transparent;
		span {
			font-size: var(--font-size-s);
			line-height: var(--line-height);
		}
	}
	.filter__options {
		width: 100%;
		padding-top: var(--space-m);
		padding-bottom: var(--space-m);
		display: flex;
		flex-direction: column;
		min-width: inherit;
		background: white;
		max-height: 400px;
		overflow: auto;
		scrollbar-width: none;
		box-shadow: var(--box-shadow);
	}
	.dropdown-icon {
		max-width: 0.875rem;
		max-height: 0.875rem;
		transform: rotate(90deg);
		transition: transform 0.25s ease;
	}
	.dropdown-icon__active {
		transform: rotate(270deg);
	}
	.filter-options-wrapper {
		position: fixed;
		z-index: 9999;
	}

	.filter-options-wrapper--enter {
		animation: context-in 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
</style>
