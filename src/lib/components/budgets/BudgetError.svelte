<script lang="ts">
	import { Close } from '$lib/assets/images';
	import type { BudgetError } from '$lib/types';

	interface BudgetErrorProps {
		form?: BudgetError | null;
		clearForm: () => void;
	}

	let { form, clearForm }: BudgetErrorProps = $props();
</script>

{#if form && Object.keys(form).length > 0}
	<section class="form-error">
		<h2 class="form-error__message">{form.message}</h2>
		<button class="close" onclick={clearForm}>{@html Close}</button>
	</section>
{/if}

<style lang="scss">
	$containerPadding: 0.75rem;
	$containerBorderRadius: 0.5rem;
	.form-error {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 0.75rem;
		padding: $containerPadding;
		color: var(--color-grey-900);
		background: white;
		/* border-radius: calc(($containerBorderRadius + $containerPadding)); */
		border-radius: $containerBorderRadius;
		@media screen and (max-width: 1023px) {
			width: 100%;
		}
		@media screen and (min-width: 1024px) {
			width: calc(50% - 0.75rem);
		}
	}
	.form-error__message {
		width: 100%;
		padding: 0.75rem;
		background: var(--color-beige-100);
		border-radius: $containerBorderRadius;
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
