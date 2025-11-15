<script lang="ts">
	import { PotsOutline } from '$lib/assets/images';
	import { getById } from '$lib/helpers';
	import type { ColorTheme, Pot } from '$lib/types';
	import { getContext } from 'svelte';

	interface PotsOverviewProps {
		totalSavings: number;
		pots: Pot[];
	}

	let { totalSavings, pots }: PotsOverviewProps = $props();

	let themes:() => ColorTheme[] = getContext('themes');
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
			<div class="pot" style:--data-color={getById(themes(), pot.theme_id)?.theme}>
				<h3 class="pot__label">{pot.name}</h3>
				<p class="pot__sum">${pot.total}</p>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.segment__data {
		gap: var(--gap-m);
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
		padding: var(--padding-m);
		gap: var(--gap-m);
		background: var(--color-beige-100);
		min-width: 20rem;
		border-radius: var(--radius-m);
	}
	.total-savings__icon {
		min-width: 3rem;
	}
	.total-savings__label {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		color: var(--color-grey-500);
		text-transform: capitalize;
	}
	.total-savings__sum {
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: bolder;
	}
	.segment__summary {
		display: flex;
		gap: var(--gap-m);
		flex-wrap: wrap;
	}
	.pot {
		padding: 0 var(--padding-xxl);
		position: relative;
		flex-basis: calc(50% - 0.75rem);

		&:before {
			position: absolute;
			left: 0;
			top: 0;
			height: var(--full-container-height);
			width: 4px;
			content: '';
			background: var(--data-color);
		}
	}
	.pot__label {
		font-size: var(--font-size-xs);
		line-height: var(--line-height);
		color: var(--color-grey-500);
	}
	.pot__sum {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		font-weight: bolder;
	}
</style>
