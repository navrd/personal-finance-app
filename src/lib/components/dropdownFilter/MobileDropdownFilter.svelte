<script lang="ts" generics="T">
	import { BlankButton } from '$lib/components/utility';
	import type { DropdownFilterProps } from '$lib/types';
	import { fade, scale } from 'svelte/transition';

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

	function onMobileOptionClick(event: Event, option: string) {
		event.stopPropagation();
		selected = option;
		optionsVisible = false;
	}

	function onMobileOverlayClick() {
		optionsVisible = false;
	}

	function onIconClick(e: Event) {
		e.stopPropagation();
		optionsVisible = true;
		mobileVisible = true;
	}
</script>

<BlankButton onclick={onIconClick}><span class="filter-icon">{@html icon}</span></BlankButton>
{#if optionsVisible}
	<BlankButton onclick={onMobileOverlayClick}>
		<div class="mobile-options-wrapper" transition:fade>
			<div class="mobile-options" transition:scale>
				<ul>
					{#if defaultValue}
						<button
							class="filter__option-wrapper"
							onclick={(event) => onMobileOptionClick(event, 'All')}
						>
							<li class={['filter__option', { filter__option_active: 'All' === selected }]}>All</li>
						</button>
					{/if}
					{#each options as option}
						<button
							class="filter__option-wrapper"
							onclick={(event) => onMobileOptionClick(event, String(option[valueKey]))}
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
		</div>
	</BlankButton>{/if}

<style>
	.mobile-options-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		width: var(--viewport-width);
		height: var(--viewport-height);
		background: rgba(0, 0, 0, 0.25);
	}
	.mobile-options {
		width: 80dvw;
		max-height: 40dvh;
		overflow: auto;
		border-radius: var(--radius-m);
		background: white;
	}
</style>
