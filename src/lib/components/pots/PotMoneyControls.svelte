<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Close } from '$lib/assets/images';
	import type { Pot } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import CustomInput from '../CustomInput.svelte';

	interface PotMoneyControlsProps {
		pot: Pot;
		loading: boolean;
		showPotControls: boolean;
		addMoney: boolean;
	}

	let {
		pot,
		loading = $bindable(),
		showPotControls = $bindable(),
		addMoney = $bindable()
	}: PotMoneyControlsProps = $props();
	let amount = $state(0);

	let newAmount = $derived.by(() => {
		if (addMoney) {
			return pot.total + amount > pot.target ? pot.target : pot.total + amount;
		} else {
			return pot.total - amount < 0 ? 0 : pot.total - amount;
		}
	});
	let newPercentage = $derived(pot.target > 0 ? Math.min((newAmount / pot.target) * 100, 100) : 0);

	const enhanceControlsForm: SubmitFunction = async ({ formData, cancel }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:pots');
				loading = false;
				showPotControls = false;
				addMoney = false;
			} else {
				await update();
				loading = false;
			}
		};
	};
	function closeControls() {
		showPotControls = false;
		addMoney = false;
	}
	function getProgressPercentage(total: number): number {
		return pot.target > 0 ? Math.min((total / pot.target) * 100, 100) : 0;
	}
	function getWithdrawProgressPercentage(total: number): number {
		let amount = total > pot.total ? pot.total : total;
		return pot.target > 0 ? Math.min((amount / pot.total) * 100, 100) : 0;
	}
	function getRequiredToFillPercentage() {
		return Math.min(((pot.target - pot.total) / pot.target) * 100, 100);
	}
</script>

<div class="pot-controls-wrapper">
	<div class="form-container">
		<form class="pot-form" method="POST" action="?/updatePot" use:enhance={enhanceControlsForm}>
			<header class="form-header">
				<h2 class="title">
					{addMoney ? `Add to '${pot.name}'` : `Withdraw from '${pot.name}'`}
				</h2>

				<button class="close" type="button" onclick={closeControls}>{@html Close}</button>
			</header>
			<p class="description">
				{addMoney
					? 'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.'
					: 'Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.'}
			</p>
			<input type="hidden" name="id" value={pot.id} />
			<input type="hidden" name="name" value={pot.name} />
			<input type="hidden" name="target" value={pot.target} />
			<div class="pot-amount">
				<span class="label">Total</span>
				<span class="value">${newAmount > pot.target ? pot.target : newAmount.toFixed(2)}</span>
			</div>
			<div class="progress-bar">
				<div
					class="progress-fill"
					class:progress-fill_withdraw={!addMoney}
					style:width={`${getProgressPercentage(pot.total)}%`}
					style:background-color="var(--color-grey-900)"
				>
					{#if !addMoney}
						<div
							class="progress-new-amount"
							class:progress-new-amount_withdraw={!addMoney}
							style:width={`${getWithdrawProgressPercentage(amount)}%`}
							style:background-color="var(--color-red)"
						></div>
					{/if}
				</div>
				{#if addMoney}
					<div
						class="progress-new-amount"
						style:width={newAmount > pot.target
							? `${getRequiredToFillPercentage()}%`
							: `${getProgressPercentage(amount)}%`}
						style:background-color={pot.theme}
					></div>
				{/if}
			</div>
			<div class="progress-data">
				<span class="progress-amount">
					{newPercentage.toFixed(2)}%
				</span>
				<span class="progress-target">Target of ${pot.target}</span>
			</div>
			<CustomInput
				type="number"
				symbol="$"
				id="amount"
				label={addMoney ? 'Amount to Add' : 'Amount to Withdraw'}
				bind:value={amount}
				placeholder="e.g. 300"
			/>
			<input type="hidden" name="total" value={newAmount} />
			<button type="submit" class="button">
				{loading ? 'Saving...' : addMoney ? 'Confirm Addition' : 'Confirm Withdraw'}
			</button>
		</form>
	</div>
</div>

<style lang="scss">
	.progress-bar {
		display: flex;
		width: 100%;
		height: 8px;
		background-color: var(--color-beige-100);
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	.progress-fill_withdraw {
		position: relative;
	}

	.progress-new-amount {
		height: 100%;
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	.progress-new-amount_withdraw {
		position: absolute;
		right: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-left: 1px solid white;
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
	.button {
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		&:hover,
		&:active,
		&:focus {
			cursor: pointer;
			opacity: 50%;
		}
	}
	.title {
		font-size: 1.25rem;
		line-height: 1.2;
		color: var(--color-grey-900);
		font-weight: bolder;
	}
	.description {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.pot-controls-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		width: 100dvw;
		height: 100dvh;
		background: rgba(0, 0, 0, 0.25);
	}
	.form-container {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		max-width: 45vw;
		min-width: 45vw;
	}
	.pot-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.pot-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.form-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.close {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 0;
		outline: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		&:hover {
			background: var(--color-grey-300);
		}
	}
</style>
