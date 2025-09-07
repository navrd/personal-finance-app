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
		border-radius: 0.75rem;
	}
	.bills-totals {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.25rem;
		background: var(--color-grey-900);
		color: white;
		@media screen and (max-width: 1023px) {
			flex: 1;
		}
	}
	.label {
		font-size: 0.875rem;
		line-height: 1.5;
		font-weight: bolder;
	}
	.sum {
		font-size: 2rem;
		line-height: 1.2;
		font-weight: bolder;
	}
</style>
