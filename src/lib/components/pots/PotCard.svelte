<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Dots } from '$lib/assets/images';
	import type { ColorTheme, CreatePotData, Pot } from '$lib/types';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { BlankButton } from '../utility';
	import type { SubmitFunction } from '@sveltejs/kit';
	import PotMoneyControls from './PotMoneyControls.svelte';
	import { getThemeById } from '$lib/helpers/themes';
	import { getContext } from 'svelte';
	import type { User } from '@supabase/supabase-js';

	interface PotCardProps {
		pot: Pot;
		editingPot: Pot | null;
		showForm: boolean;
		formData: CreatePotData & { id?: string };
		loading: boolean;
		resetFormData: () => void;
	}

	let {
		pot,
		editingPot = $bindable(),
		showForm = $bindable(),
		formData = $bindable(),
		loading = $bindable(),
		resetFormData
	}: PotCardProps = $props();

	let themes: ColorTheme[] = getContext('themes');
	let user: () => User = getContext('user');
	let showContextMenu = $state(false);
	let showPotControls = $state(false);
	let addMoney = $state(false);
	function getProgressPercentage(pot: Pot): number {
		return pot.target > 0 ? Math.min((pot.total / pot.target) * 100, 100) : 0;
	}
	function editPot(pot: Pot) {
		editingPot = pot;
		formData = {
			id: pot.id,
			name: pot.name,
			target: pot.target,
			total: pot.total,
			theme_id: pot.theme_id
		};
		showForm = true;
		showContextMenu = false;
	}
	function clickOutside(e: CustomEvent<MouseEvent>) {
		e.stopPropagation();
		showContextMenu = false;
	}
	const enhanceDeleteForm: SubmitFunction = async ({ action, formData, cancel }) => {
		if (action.search.includes('deletePot') || action.pathname.includes('deletePot')) {
			const confirmed = confirm('Are you sure you want to delete this budget?');
			if (!confirmed) {
				cancel();
				return;
			}
		}
		loading = true;
		return async ({ result, update }) => {
			console.log(result, update);
			if (result.type === 'success') {
				await invalidate('app:budgets');
				loading = false;
				resetFormData();
			} else {
				await update();
				loading = false;
			}
		};
	};
	function add() {
		showPotControls = true;
		addMoney = true;
	}
	function withdraw() {
		showPotControls = true;
		addMoney = false;
	}
</script>

<div class="pot-card">
	<div class="pot-card__header">
		<h3 class="header-title" style:--data-color={getThemeById(themes, pot.theme_id)?.theme}>
			{pot.name}
		</h3>
		<div class="context-menu">
			<BlankButton
				onclick={(e: MouseEvent) => {
					e.stopPropagation();
					showContextMenu = !showContextMenu;
				}}>{@html Dots}</BlankButton
			>
			{#if showContextMenu}
				<ul class="context-menu__actions" use:clickoutside onclickoutside={clickOutside}>
					<li class="action">
						<BlankButton onclick={() => editPot(pot)}>Edit pot</BlankButton>
					</li>
					<li class="action action_delete">
						<form method="POST" action="?/deletePot" use:enhance={enhanceDeleteForm}>
							<input type="hidden" name="id" value={pot.id} />
							<BlankButton type="submit">Delete pot</BlankButton>
						</form>
					</li>
				</ul>
			{/if}
		</div>
	</div>

	<div class="pot-amount">
		<span class="label">Total</span>
		<span class="value">${pot.total.toFixed(2)}</span>
	</div>

	<div class="progress-container">
		<div class="progress-bar">
			<div
				class="progress-fill"
				style="width: {getProgressPercentage(pot)}%; background-color: {getThemeById(
					themes,
					pot.theme_id
				)?.theme}"
			></div>
		</div>
		<div class="progress-data">
			<span class="progress-amount">
				{getProgressPercentage(pot).toFixed(1)}%
			</span>
			<span class="progress-target">Target of ${pot.target}</span>
		</div>
		<div class="actions">
			<button class="action-button" onclick={add}>+ Add Money</button>
			<button class="action-button" onclick={withdraw}>Withdraw</button>
		</div>
	</div>
</div>
{#if showPotControls}
	<PotMoneyControls {pot} bind:loading bind:showPotControls bind:addMoney />
{/if}

<style lang="scss">
	.pot-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.context-menu {
		position: relative;
		display: flex;

		align-items: center;
		justify-content: center;
		color: var(--color-grey-300);
		fill: currentColor;
	}

	.context-menu__actions {
		background: white;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 130px;
		z-index: 3;
		border-radius: 0.75rem;
		box-shadow: 0rem 0.75rem 1.5rem 0rem hsl(from black h s l / 0.25);
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.75rem;
		font-weight: bolder;
		color: var(--color-grey-900);
		&:before {
			content: ' ';
			width: 0.75rem;
			height: 0.75rem;
			border-radius: 50%;
			background: var(--data-color);
		}
	}
	.pot-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: white;
		border-radius: 0.75rem;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
		}
	}
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: var(--color-beige-100);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}
	.progress-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	.progress-data {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.progress-amount {
		font-size: 0.875rem;
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.progress-target {
		font-size: 0.75rem;
		color: var(--color-grey-500);
	}

	.pot-amount {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.label {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}

	.value {
		color: var(--color-grey-900);
		font-size: 2rem;
		line-height: 1.2;
		font-weight: bolder;
	}
	.action {
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid var(--color-grey-100);
		color: var(--color-grey-900);
		font-size: 0.875rem;
		&:last-child {
			border-bottom: none;
		}
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.action_delete {
		color: var(--color-red);
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}
	.action-button {
		flex: 1;
		border-radius: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--color-beige-100);
		background: var(--color-beige-100);
		color: var(--color-grey-900);
		font-weight: bolder;
		&:hover {
			border: 1px solid var(--color-grey-900);
			background: white;
		}
	}
</style>
