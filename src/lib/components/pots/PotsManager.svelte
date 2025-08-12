<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { CreatePotData, Pot, PotError } from '$lib/types';
	import { getContext } from 'svelte';
	import PotForm from './PotForm.svelte';
	import { PotCard } from '.';
	import FormError from '../utility/FormError.svelte';

	interface PotsManagerProps {
		form?: PotError | null;
	}

	let { form }: PotsManagerProps = $props();

	let pots: () => Pot[] = getContext('pots');

	// Reactive state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let showCreateForm = $state(false);
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
		showCreateForm = false;
	}



	async function clearForm() {
		await applyAction({
			type: 'success',
			status: 200,
			data: {}
		});
	}
</script>
<FormError {form} {clearForm} />
<div class="pots-container">
	<header class="header">
		<h1>My Pots</h1>
		<button
			class="btn btn-primary"
						onclick={() => {
				showCreateForm = !showCreateForm;
				if (!showCreateForm) cancelEdit();
			}}
		>
			{showCreateForm ? 'Cancel' : '+ Add New Pot'}
		</button>
	</header>

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	{#if showCreateForm}
		<PotForm bind:editingPot bind:loading bind:showCreateForm {formData}/>
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
				<PotCard bind:loading bind:showCreateForm bind:formData bind:editingPot {pot}/>
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

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;

		h1 {
			margin: 0;
			color: #1a1a1a;
			font-size: 2rem;
			font-weight: 700;
		}
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;

		&.btn-primary {
			background-color: #277c78;
			color: white;

			&:hover {
				background-color: #1e5d5a;
				transform: translateY(-1px);
			}
		}
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

		.header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;

			h1 {
				font-size: 1.5rem;
			}
		}


		.pots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
