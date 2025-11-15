<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Close } from '$lib/assets/images';
	import type { Balance, ColorTheme, Pot } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { CustomInput, CustomButton, LoadingDots } from '$lib/components';
	import { getContext } from 'svelte';
	import { getById } from '$lib/helpers';

	interface PotMoneyControlsProps {
		pot: Pot;
		editingPot: Pot | null;
		loading: boolean;
		showPotControls: boolean;
		addMoney: boolean;
	}

	let {
		pot,
		editingPot = $bindable(),
		loading = $bindable(),
		showPotControls = $bindable(),
		addMoney = $bindable()
	}: PotMoneyControlsProps = $props();
	let amount = $state(0);
	let themes:() => ColorTheme[] = getContext('themes');
	let balance: () => Balance = getContext('balance');

	let newAmount = $derived.by(() => {
		if (addMoney) {
			return pot.total + amount > pot.target ? pot.target : pot.total + amount;
		} else {
			return pot.total - amount < 0 ? 0 : pot.total - amount;
		}
	});
	let amountToAdd = $derived.by(() => {
		if (addMoney) {
			return pot.target >= pot.total + amount ? amount : pot.target - pot.total;
		} else {
			return pot.total - amount < 0 ? pot.total : amount;
		}
	});
	let newPercentage = $derived(pot.target > 0 ? Math.min((newAmount / pot.target) * 100, 100) : 0);

	const enhanceControlsForm: SubmitFunction = async ({ formData, cancel }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:balance');
				await invalidate('app:pots');
				loading = false;
				showPotControls = false;
				addMoney = false;
				editingPot = null;
			} else {
				await update();
				loading = false;
			}
		};
	};
	function closeControls() {
		showPotControls = false;
		addMoney = false;
		editingPot = null;
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
	function validateAmount(value: string | number): string | null {
		if (String(value).trim().length < 1) return 'Amount could not be empty';
		if (Number(value) <= 0) return 'Amount should be positive';
		if (addMoney) {
			if (Number(value) > balance().current)
				return `Amount should not exceed current balance($${balance().current})`;
		}
		if (!addMoney) {
			if (Number(value) > pot.total) return 'Amount of withdrawal should not exceed total pot sum';
		}
		return null;
	}
	let isFormValid = $derived.by(() => {
		return validateAmount(amount) === null && !loading;
	});
</script>

<div class="pot-controls-wrapper">
	<div class="form-container">
		<form
			class="pot-form"
			method="POST"
			action={addMoney ? '?/addToPot' : '?/withdrawFromPot'}
			use:enhance={enhanceControlsForm}
		>
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
						style:width={newAmount >= pot.target
							? `${getRequiredToFillPercentage()}%`
							: `${getProgressPercentage(amount)}%`}
						style:background-color={getById(themes(), pot.theme_id)?.theme}
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
				validator={validateAmount}
			/>
			<input type="hidden" name="amount" value={amountToAdd} />
			<CustomButton type="submit" disabled={!isFormValid}>
				{#if loading}
					<LoadingDots />
				{:else}{addMoney ? 'Confirm Addition' : 'Confirm Withdraw'}{/if}
			</CustomButton>
		</form>
	</div>
</div>

<style lang="scss">
	.progress-bar {
		display: flex;
		width: var(--full-container-width);
		height: 8px;
		background-color: var(--color-beige-100);
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-fill {
		height: var(--full-container-height);
		border-radius: 4px;
		transition: width 0.3s ease;
	}
	.progress-fill_withdraw {
		position: relative;
	}

	.progress-new-amount {
		height: var(--full-container-height);
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
	.title {
		font-size: var(--font-size-xl);
		line-height: var(--line-height-s);
		color: var(--color-grey-900);
		font-weight: bolder;
	}
	.description {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
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
		width: var(--full-container-width);
		height: var(--full-screen-height);
		background: rgba(0, 0, 0, 0.25);
	}
	.form-container {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

		@media screen and (max-width: 1023px) {
			max-width: calc(100% - 2rem);
		}
		@media screen and (min-width: 1024px) {
			max-width: 45vw;
			min-width: 45vw;
		}
	}
	.pot-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-m);
	}
	.pot-form {
		display: flex;
		flex-direction: column;
		gap: var(--gap-m);
	}
	.form-header {
		width: var(--full-container-width);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.close {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--radius-round);
		border: var(--no-border);
		outline: var(--no-outline);
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		&:hover {
			background: var(--color-grey-300);
		}
	}
</style>
