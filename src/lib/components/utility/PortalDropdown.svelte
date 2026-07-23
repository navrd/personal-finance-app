<script lang="ts">
	import { scale } from 'svelte/transition';
	import { BlankButton } from '$lib/components/utility';
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ContextOption } from '$lib/types';
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { TOOLTIP_FALLBACKS } from '$lib/constants';
	import { clamp, computeAlignedPosition, fitsInViewport } from '$lib/helpers';
	import { Dots } from '$lib/assets/images';

	interface Props {
		opened: boolean;
		disabled?: boolean;
		options?: ContextOption[];
		iconSize?: number;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		align?: 'start' | 'end';
		offset?: number;
		trigger?: Snippet;
		children?: Snippet;
	}

	let {
		opened = $bindable(),
		disabled,
		options,
		iconSize = 16,
		placement = 'bottom',
		align = 'end',
		offset = 8,
		trigger,
		children
	}: Props = $props();

	let triggerEl = $state<HTMLElement | null>(null);
	let menuEl = $state<HTMLElement | null>(null);
	let coords = $state({ x: 0, y: 0 });
	// svelte-ignore state_referenced_locally
	let resolvedPlacement = $state(placement);
	let ready = $state(false);

	function close() {
		opened = false;
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

	async function position(triggerEl: HTMLElement, menuEl: HTMLElement) {
		if (!triggerEl || !menuEl) return;

		const triggerRect = triggerEl.getBoundingClientRect();
		const menuRect = menuEl.getBoundingClientRect();

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
		opened = true;
		await tick();
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		await position(triggerEl!, menuEl!);
		ready = true;
	}

	function onclick(e: MouseEvent) {
		e.stopPropagation();
		if (opened) {
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
		if (opened) position(triggerEl!, menuEl!);
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}
	export async function positionMenu() {
		if (!triggerEl || !menuEl) return;
        await tick()
		position(triggerEl, menuEl);
	}
</script>

<svelte:window on:scroll={onScroll} on:resize={onScroll} />

<div class="portal-dropdown-wrapper">
	<button bind:this={triggerEl} class="custom-icon" {disabled} {onclick}>
		{#if trigger}
			{@render trigger()}
		{:else}
			{@html Dots}
		{/if}
	</button>

	{#if opened}
		<ul
			bind:this={menuEl}
			use:portal
			use:clickoutside
			{onclickoutside}
			class="portal-dropdown"
			class:portal-dropdown--enter={ready}
			style:left="{coords.x}px"
			style:top="{coords.y}px"
			style:visibility={ready ? 'visible' : 'hidden'}
			style:transform-origin={transformOrigin}
			out:scale={{ duration: 300, start: 0 }}
		>
			{#if children}
				{@render children()}
			{:else}
				{#each options as option}
					<li
						class="portal-dropdown__item"
						class:portal-dropdown__item_destructive={option.variant === 'destructive'}
					>
						<BlankButton
							onclick={(e: MouseEvent) => {
								option.onclick(e);
								close();
							}}
						>
							{#if option.icon}
								<div class="icon-wrapper" style:--size={iconSize}>
									{@html option.icon}
								</div>
							{/if}{option.title}</BlankButton
						>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.portal-dropdown-wrapper {
		color: inherit;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-s);
	}

	.portal-dropdown {
		flex-direction: column;
		min-width: 10rem;
		position: fixed;
		z-index: 9997;
		border-radius: var(--radius-s);
		background: white;
		box-shadow: var(--box-shadow);
		color: var(--color-grey-500);
	}

	.portal-dropdown--enter {
		animation: context-in 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
</style>
