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
		gap: var(--space-xxl);
	}
	.balance-entry {
		flex: var(--fill-propotionally);
		border-radius: var(--radius-m);
		padding: var(--space-xxl);
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		background: white;
		color: var(--color-grey-900);
	}
	.balance-entry_current {
		background: var(--color-grey-900);
		color: white;
	}
	.balance-entry__title {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
        text-transform: capitalize;
	}
	.balance-entry__value {
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: normal;
		font-weight: bolder;
	}
</style>
