<script lang="ts">
	import { ReccuringWhite } from '$lib/assets/images';
	interface ReccuringBillsTotalsProps {
		totalBills: number;
	}
	let { totalBills }: ReccuringBillsTotalsProps = $props();
</script>

<section class="section bills-totals">
	{@html ReccuringWhite}
	<p class="label">Total Bills</p>
	<h2 class="sum">{totalBills.toString().replace('-', '$')}</h2>
</section>

<style lang="scss">
	.section {
		background: white;
		border-radius: var(--radius-m);
	}
	.bills-totals {
		display: flex;
		flex-direction: column;
		gap: var(--space-xxl);
		padding: var(--space-xl);
		background: var(--color-grey-900);
		color: white;
		@media screen and (max-width: 1023px) {
			flex: var(--fill-evenly);
		}
	}
	.label {
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		font-weight: bolder;
	}
	.sum {
		font-size: var(--font-size-xxxl);
		line-height: var(--line-height-s);
		font-weight: bolder;
	}
</style>
