<script lang="ts">
	import type { Transaction } from '$lib/types';
	import { ArrowRight } from '$lib/assets/images';
	import TransactionsList from './TransactionsList.svelte';
	interface TransactionsOverviewProps {
		transactions: Transaction[];
	}
	let { transactions }: TransactionsOverviewProps = $props();
</script>

<section class="transactions-overview">
	<div class="transactions-overview__header">
		<h2 class="transactions-overview__title">Transactions</h2>
		<a class="details" href="/app/transactions"><span>See Details</span> {@html ArrowRight}</a>
	</div>
	<TransactionsList {transactions} overview />
</section>

<style lang="scss">
	.transactions-overview {
		background: white;
		padding: 20px;
		display: flex;
		flex-direction: column;
		max-width: 100%;
		border-radius: 0.75rem;
		@media screen and (min-width: 1024px) {
			height: 100%;
		}
	}
	.transactions-overview__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.details {
		text-decoration: none;
		display: flex;
		gap: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
		align-items: center;
		justify-content: center;
		font-weight: 350;
		font-style: normal;
		* {
			color: currentColor;
			fill: currentColor;
		}
		&:hover {
			color: var(--color-grey-900);
			* {
				color: currentColor;
				fill: currentColor;
			}
		}
	}
</style>
