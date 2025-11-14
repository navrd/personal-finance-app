<script lang="ts">
	import { ArrowRight } from '$lib/assets/images';
	import type { PaginationData, Transaction } from '$lib/types';

	interface TransactionsPaginationProps {
		paginationData: PaginationData<Transaction>;
		nextPage: () => void;
		prevPage: () => void;
		goToPage: (page: number) => void;
	}

	let { paginationData, nextPage, prevPage, goToPage }: TransactionsPaginationProps = $props();
</script>

<div class="pagination-controls">
	<button class="pagination-controls__button pagination-controls__button_prev" onclick={prevPage}
		>{@html ArrowRight}</button
	>
	<div class="pagination-controls__pages">
		{#each Array.from({ length: paginationData.totalPages }, (_, i) => i + 1) as page}
			<button
				class="pagination-controls__button"
				class:pagination-controls__button_active={page === paginationData.currentPage}
				onclick={() => goToPage(page)}>{page}</button
			>
		{/each}
	</div>

	<button class="pagination-controls__button" onclick={nextPage}>{@html ArrowRight}</button>
</div>

<style lang="scss">
	.pagination-controls {
		display: flex;
		justify-content: space-between;
		gap: var(--gap-m);
		align-items: center;
	}
	.pagination-controls__pages {
		display: flex;
		gap: var(--gap-m);
		align-items: center;
	}
	.pagination-controls__button {
		min-width: 2.5rem;
		max-width: 2.5rem;
		min-height: 2.5rem;
		max-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border: var(--thin-border-beige-500);
		border-radius: var(--radius-s);
		font-size: var(--font-size-s);
		line-height: var(--line-height);
		background: transparent;
		&:hover {
			cursor: pointer;
			background-color: var(--color-grey-900);
			color: var(--color-white);
			opacity: 50%;
		}
	}
	.pagination-controls__button_prev {
		transform: rotate(180deg);
	}
	.pagination-controls__button_active {
		background-color: var(--color-grey-900);
		color: var(--color-white);
	}
</style>
