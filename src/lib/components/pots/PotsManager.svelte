<script lang="ts">
	import { applyAction } from '$app/forms';
	import type { CreatePotData, Pot, PotError } from '$lib/types';
	import { getContext } from 'svelte';
	import PotForm from './PotForm.svelte';
	import { PotCard, PotError as PotErrorForm } from '$lib/components';

	interface PotsManagerProps {
		form?: PotError | null;
		showForm: boolean;
	}

	let { form, showForm = $bindable() }: PotsManagerProps = $props();

	let pots: () => Pot[] = getContext('pots');

	// Reactive state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let editingPot = $state<Pot | null>(null);

	// Form state
	let formData = $state<CreatePotData & { id?: string }>({
		name: '',
		target: 0,
		total: 0,
		theme_id: ''
	});

	// Predefined theme colors

	// Helper functions
	function resetFormData() {
		formData = {
			name: '',
			target: 0,
			total: 0,
			theme_id: ''
		};
	}

	async function clearForm() {
		await applyAction({
			type: 'success',
			status: 200,
			data: {}
		});
	}
</script>

<PotErrorForm {form} {clearForm} />
<div class="pots-container">
	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	{#if showForm}
		<PotForm bind:editingPot bind:loading bind:formData bind:showForm />
	{/if}
	{#if pots().length === 0}
		<div class="empty-state">
			<p>No pots created yet. Start saving by creating your first pot!</p>
		</div>
	{:else}
		<div class="pots-grid">
			{#each pots() as pot (pot.id)}
				<PotCard bind:loading bind:showForm bind:formData bind:editingPot {pot} {resetFormData} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.pots-container {
		display: flex;
		flex-direction: column;
	}

	.error-message {
		background-color: #fee;
		color: #c53030;
		padding: var(--space-l);
		border-radius: var(--radius-s);
		margin-bottom: var(--space-l);
		border-left: 4px solid #c53030;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #666;

		p {
			font-size: var(--font-size-l);
		}
	}

	.pots-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-xxl);
	}
	.empty-state {
		text-align: center;
		padding: 40px;
		background: #f9fafb;
		border-radius: var(--radius-m);
		color: #6b7280;
	}

	@media screen and (max-width: 1024px) {
		.pots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
