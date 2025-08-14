<script lang="ts">
	import { PotsOutline } from '$lib/assets/images';
	import type { Pot } from '$lib/types';

	interface PotsOverviewProps {
		totalSavings: number;
		pots: Pot[];
	}

	let { totalSavings, pots }: PotsOverviewProps = $props();
</script>

<div class="segment__data">
	<div class="segment__total-savings">
		<div class="total-savings__icon">{@html PotsOutline}</div>
		<div class="total-savings__data">
			<p class="total-savings__label">total saved</p>
			<p class="total-savings__sum">${totalSavings.toFixed(2)}</p>
		</div>
	</div>

	<div class="segment__summary">
		{#each pots as pot}
			<div class="pot" style:--data-color={pot.theme}>
				<h3 class="pot__label">{pot.name}</h3>
				<p class="pot__sum">{pot.total}/{pot.target}</p>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.segment__data {
		gap: 0.75rem;
		display: flex;
		@media screen and (min-width: 0px) and (max-width: 670px) {
			flex-direction: column;
		}
		@media screen and (min-width: 671px) {
			flex-direction: row;
		}
	}
	.segment__total-savings {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.75rem;
		gap: 0.75rem;
		background: var(--color-beige-100);
		min-width: 20rem;
		border-radius: 0.75rem;
	}
	.total-savings__icon {
		min-width: 3rem;
	}
	.total-savings__label {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		text-transform: capitalize;
	}
	.total-savings__sum {
		font-size: 2rem;
		line-height: 1.2;
	}
	.segment__summary {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.pot {
		padding: 0 1.5rem;
		position: relative;
		flex-basis: calc(50% - 0.75rem);
		&:before {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 4px;
			content: '';
			background: var(--data-color);
		}
	}
	.pot__label {
		font-size: 0.75rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.pot__sum {
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>
