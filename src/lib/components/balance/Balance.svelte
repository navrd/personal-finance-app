<script lang="ts">
	import type { Balance as BalanceType } from '$lib/types';
	interface BalanceProps {
		balanceData: Pick<BalanceType, 'current' | 'expenses' | 'income'>;
	}
	let { balanceData }: BalanceProps = $props();
</script>

<div class="balance">
	{#each Object.entries(balanceData) as [key, value]}
		<div class="balance-entry" class:balance-entry_current={key === 'current'}>
			<h3 class="balance-entry__title">{key}</h3>
			<p class="balance-entry__value">${value.toFixed(2)}</p>
		</div>
	{/each}
</div>

<style lang="scss">
	.balance {
		display: flex;
        @media screen and (max-width: 670px){
            flex-direction: column;
        }
		gap: 1.5rem;
	}
	.balance-entry {
		flex: 1 1 auto;
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: white;
		color: var(--color-grey-900);
	}
	.balance-entry_current {
		background: var(--color-grey-900);
		color: white;
	}
	.balance-entry__title {
		font-size: 0.875rem;
		line-height: 1.5;
        text-transform: capitalize;
	}
	.balance-entry__value {
		font-size: 2rem;
		line-height: 1.2;
		font-weight: normal;
		font-weight: bolder;
	}
</style>
