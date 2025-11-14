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
	.form-error {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: var(--gap-m);
		padding:var(--padding-m);
		color: var(--color-grey-900);
		background: white;
		border-radius: var(--radius-s);
		@media screen and (max-width: 1023px) {
			width: var(--full-container-width);
		}
		@media screen and (min-width: 1024px) {
			width: calc(50% - 0.75rem);
		}
	}
	.form-error__message {
		width: var(--full-container-width);
		padding: var(--padding-m);
		background: var(--color-beige-100);
		border-radius: var(--radius-s);
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
