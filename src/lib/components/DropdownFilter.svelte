<script lang="ts" generics="T">
	import { tick } from 'svelte';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { ArrowRight } from '$lib/assets/images';
	import BlankButton from './utility/BlankButton.svelte';

	interface DropdownFilterProps {
		labelKey: keyof T;
		valueKey: keyof T;
		options: T[];
		selected: string;
		defaultValue?: boolean;
		label: string;
		icon: string;
	}

	let {
		labelKey,
		valueKey,
		selected = $bindable(),
		options,
		defaultValue = false,
		label,
		icon
	}: DropdownFilterProps = $props();

	let mobileVisible = $state(false);
	let desktopVisible = $state(false);
	let optionsVisible = $state(false);
	let innerWidth = $state(0);

	const onOptionClick = (option: string) => {
		selected = option;
		optionsVisible = false;
	};

	function onMobileOptionClick(event: Event, option: string) {
		event.stopPropagation();
		// document.documentElement.classList.remove('overflow-hidden');
		selected = option;
		optionsVisible = false;
	}

	const onSelectedOptionClick = async () => {
		optionsVisible = !optionsVisible;
		await tick();
	};

	function onIconClick(e: Event) {
		e.stopPropagation();
		// document.documentElement.classList.add('overflow-hidden');
		optionsVisible = true;
		mobileVisible = true;
	}
	function onMobileOverlayClick() {
		// document.documentElement.classList.remove('overflow-hidden');
		optionsVisible = false;
	}

	function setupMobile() {
		mobileVisible = true;
		desktopVisible = false;
	}
	function setupDesktop() {
		mobileVisible = false;
		desktopVisible = true;
	}

	let selectedOptionLabel = $derived.by(() => {
		if (defaultValue && selected === 'All') {
			return 'All';
		} else {
			let selectedOption = options.find((option) => option[valueKey] === selected);

			return selectedOption![labelKey];
		}
	});
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
		<BlankButton onclick={onIconClick}><span class="filter-icon">{@html icon}</span></BlankButton>
		{#if optionsVisible}
			<BlankButton onclick={onMobileOverlayClick}>
				<div class="mobile-options-wrapper">
					<div class="mobile-options">
						<ul>
							{#if defaultValue}
								<button
									class="filter__option-wrapper"
									onclick={(event) => onMobileOptionClick(event, 'All')}
								>
									<li class={['filter__option', { filter__option_active: 'All' === selected }]}>
										All
									</li>
								</button>
							{/if}
							{#each options as option}
								<button
									class="filter__option-wrapper"
									onclick={(event) => onMobileOptionClick(event, String(option[valueKey]))}
								>
									<li
										class={[
											'filter__option',
											{ filter__option_active: option[valueKey] === selected }
										]}
									>
										{option[labelKey]}
									</li>
								</button>
							{/each}
						</ul>
					</div>
				</div>
			</BlankButton>{/if}{/if}
	{#if desktopVisible}
		<span class="filter-label">{label}</span>
		<div class="filter" use:clickoutside onclickoutside={() => (optionsVisible = false)}>
			<div class="filter__active-option-wrapper">
				<button class="filter__active-option" type="button" onclick={onSelectedOptionClick}>
					<span
						>{#if selected}
							{selectedOptionLabel}{:else}
							{labelKey}{/if}</span
					>
					<div class="dropdown-icon" class:dropdown-icon__active={optionsVisible}>{@html ArrowRight}</div>
				</button>
			</div>
			{#if optionsVisible}
				<div class="filter-options-wrapper">
					<ul class="filter__options">
						{#if defaultValue}
							<button class="filter__option-wrapper" onclick={() => onOptionClick('All')}>
								<li class={['filter__option', { filter__option_active: 'All' === selected }]}>
									All
								</li>
							</button>
						{/if}
						{#each options as option}
							<button
								class="filter__option-wrapper"
								onclick={() => onOptionClick(String(option[valueKey]))}
							>
								<li
									class={[
										'filter__option',
										{ filter__option_active: option[valueKey] === selected }
									]}
								>
									{option[labelKey]}
								</li>
							</button>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
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
	}
	.filter__option {
		width: 100%;
		cursor: pointer;
		padding: var(--space-xl) var(--space-m);
		display: flex;
		border-bottom: var(--border-thin) solid var(--color-grey-100);
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.filter__option_active {
		background: var(--color-grey-300);
	}
	.filter__option-wrapper {
		max-width: 150px;
		width: 100%;
		cursor: pointer;
		min-width: inherit;
		min-height: inherit;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		padding: 0;
		margin: 0;
		border: 0;
		outline: 0;
		background: transparent;
		@media screen and (max-width: 632px) {
			max-width: 100%;
		}
	}
	.filter-options-wrapper {
		width: 100%;
		padding-top: var(--space-m);
		position: absolute;
		width: 100%;
		z-index: 2;
		top: calc(100% + 4px);
		border-radius: var(--radius-xs);
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
