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
		theme: '#277C78'
	});

	// Predefined theme colors

	// Helper functions
	function resetFormData() {
		formData = {
			name: '',
			target: 0,
			total: 0,
			theme: '#277C78'
		};
	}

	function cancelEdit() {
		editingPot = null;
		resetFormData();
		showForm = false;
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
		<PotForm bind:editingPot bind:loading {formData} bind:showForm />
	{/if}

	{#if loading}
		<div class="loading">Loading pots...</div>
	{:else if pots().length === 0}
		<div class="empty-state">
			<p>No pots created yet. Start saving by creating your first pot!</p>
		</div>
	{:else}
		<div class="pots-grid">
			{#each pots() as pot (pot.id)}
				<PotCard bind:loading bind:showForm bind:formData bind:editingPot {pot} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.pots-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.error-message {
		background-color: #fee;
		color: #c53030;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		border-left: 4px solid #c53030;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #666;

		p {
			font-size: 1.1rem;
		}
	}

	.pots-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 768px) {
		.pots-container {
			padding: 1rem;
		}

		.pots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
