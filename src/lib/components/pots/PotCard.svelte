<script lang="ts">
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidate } from '$app/navigation';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { Dots } from '$lib/assets/images';
	import type { ColorTheme, CreatePotData, Pot } from '$lib/types';
	import { PotMoneyControls, LoadingDots, BlankButton } from '$lib/components';
	import { getById } from '$lib/helpers';

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

	let themes:() => ColorTheme[] = getContext('themes');
	let showContextMenu = $state(false);
	let showPotControls = $state(false);
	let addMoney = $state(false);

	let isLoading = $derived(loading && editingPot?.id === pot.id);

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
			if (result.type === 'success') {
				await invalidate('app:budgets');
				loading = false;
				resetFormData();
			} else {
				await update();
				loading = false;
				showContextMenu = false;
			}
		};
	};
	function add() {
		editingPot = pot;
		showPotControls = true;
		addMoney = true;
	}
	function withdraw() {
		editingPot = pot;
		showPotControls = true;
		addMoney = false;
	}
</script>

<div class="pot-card">
	<div class="pot-card__header">
		<h3
			class="header-title"
			class:loading={isLoading}
			style:--data-color={isLoading
				? 'var(--color-grey-300)'
				: getById(themes(), pot.theme_id)?.theme}
		>
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
							<BlankButton type="submit" fullWidth
								>{#if loading}
									<LoadingDots dotColor="var(--color-red)" />
								{:else}Delete pot{/if}</BlankButton
							>
						</form>
					</li>
				</ul>
			{/if}
		</div>
	</div>

	<div class="pot-amount">
		<span class="label" class:loading={isLoading}>Total</span>
		<span class="value" class:loading={isLoading}>${pot.total.toFixed(2)}</span>
	</div>

	<div class="progress-container">
		<div class="progress-bar" class:loading={isLoading}>
			<div
				class="progress-fill"
				style="width: {getProgressPercentage(pot)}%; background-color: {isLoading
					? 'var(--color-grey-300)'
					: getById(themes(), pot.theme_id)?.theme}"
				class:loading={isLoading}
			></div>
		</div>
		<div class="progress-data">
			<span class="progress-amount" class:loading={isLoading}>
				{getProgressPercentage(pot).toFixed(1)}%
			</span>
			<span class="progress-target" class:loading={isLoading}>Target of ${pot.target}</span>
		</div>
		<div class="actions">
			<button class="action-button" disabled={isLoading} onclick={add}
				>{#if isLoading}<LoadingDots dotColor="var(--color-grey-300)" />{:else}+ Add Money{/if}</button
			>
			<button class="action-button" disabled={isLoading} onclick={withdraw}
				>{#if isLoading}<LoadingDots dotColor="var(--color-grey-300)" />{:else}Withdraw{/if}</button
			>
		</div>
	</div>
</div>
{#if showPotControls}
	<PotMoneyControls {pot} bind:editingPot bind:loading bind:showPotControls bind:addMoney />
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
		gap: var(--gap-m);
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		min-width: 130px;
		z-index: 3;
		border-radius: var(--radius-m);
		box-shadow: 0rem 0.75rem 1.5rem 0rem hsl(from black h s l / 0.25);
	}

	.header-title {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: var(--gap-m);
		font-weight: bolder;
		color: var(--color-grey-900);
		&:before {
			content: ' ';
			width: 0.75rem;
			height: 0.75rem;
			border-radius: var(--radius-round);
			background: var(--data-color);
		}
	}
	.pot-card {
		display: flex;
		flex-direction: column;
		gap: var(--gap-m);
		background: white;
		border-radius: var(--radius-m);
		padding: var(--padding-xxl);
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
		gap: var(--gap-m);
	}
	.progress-bar {
		width: var(--full-container-width);
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
		font-size: var(--font-size-s);
		color: var(--color-grey-500);
		font-weight: bolder;
	}
	.progress-target {
		font-size: var(--font-size-xs);
		color: var(--color-grey-500);
	}

	.pot-amount {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: var(--full-container-width);
	}
	.label {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		color: var(--color-grey-500);
	}

	.value {
		color: var(--color-grey-900);
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: bolder;
	}
	.action {
		padding:  var(--padding-m)  var(--padding-s);
		border-bottom: 1px solid var(--color-grey-100);
		color: var(--color-grey-900);
		font-size: var(--font-size-s);
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
		gap: var(--gap-m);
	}
	.action-button {
		flex: 1;
		border-radius: var(--radius-m);
		padding: var(--padding-l);
		border: var(--thin-border-beige-100);
		background: var(--color-beige-100);
		color: var(--color-grey-900);
		font-weight: bolder;
		min-height: 3.5rem;
		&:hover {
			border: 1px solid var(--color-grey-900);
			background: white;
		}
		&:disabled {
			opacity: 0.5;
		}
	}
</style>
