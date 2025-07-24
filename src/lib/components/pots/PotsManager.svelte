<script lang="ts">
	import type { CreatePotData, Pot, StateWrapper } from '$lib/types';
	import type { User, SupabaseClient } from '@supabase/supabase-js';
	import { getContext, onMount } from 'svelte';

	// Types

	let user: StateWrapper<User | null> = getContext('user');
	let supabase: StateWrapper<SupabaseClient> = getContext('supabase');
	let pots: StateWrapper<Pot[]> = getContext('pots');
	$inspect('pots: ', pots)

	// Reactive state
	let loading = $state(false);
	let error = $state<string | null>(null);
	let showCreateForm = $state(false);
	let editingPot = $state<Pot | null>(null);

	// Form state
	let formData = $state<CreatePotData>({
		name: '',
		target: 0,
		total: 0,
		theme: '#277C78'
	});

	// Predefined theme colors
	const themeColors = [
		'#277C78',
		'#82C9D7',
		'#F2CDAC',
		'#626070',
		'#C94736',
		'#854DFF',
		'#AF81BA',
		'#597C7C'
	];

	// CRUD Operations
	async function createPot() {
		try {
			error = null;

			const { data, error: createError } = await supabase.value
				.from('pots')
				.insert([
					{
						...formData,
						user_id: user.value?.id
					}
				])
				.select();

			if (createError) throw createError;

			if (data && data[0]) {
				pots.value = [data[0], ...pots.value];
			}

			resetForm();
			showCreateForm = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to create pot';
			console.error('Error creating pot:', err);
		}
	}

	async function updatePot(id: string, updates: Partial<CreatePotData>) {
		try {
			error = null;

			const { data, error: updateError } = await supabase.value
				.from('pots')
				.update(updates)
				.eq('id', id)
				.select();

			if (updateError) throw updateError;

			if (data && data[0]) {
				const index = pots.value.findIndex((pot) => pot.id === id);
				if (index !== -1) {
					pots.value[index] = { ...pots.value[index], ...data[0] };
				}
			}

			editingPot = null;
			resetForm();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to update pot';
			console.error('Error updating pot:', err);
		}
	}

	async function deletePot(id: string) {
		if (!confirm('Are you sure you want to delete this pot?')) return;

		try {
			error = null;

			const { error: deleteError } = await supabase.value.from('pots').delete().eq('id', id);

			if (deleteError) throw deleteError;

			pots.value = pots.value.filter((pot) => pot.id !== id);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to delete pot';
			console.error('Error deleting pot:', err);
		}
	}

	// Helper functions
	function resetForm() {
		formData = {
			name: '',
			target: 0,
			total: 0,
			theme: '#277C78'
		};
	}

	function startEditing(pot: Pot) {
		editingPot = pot;
		formData = {
			name: pot.name,
			target: pot.target,
			total: pot.total,
			theme: pot.theme
		};
		showCreateForm = true;
	}

	function cancelEdit() {
		editingPot = null;
		resetForm();
		showCreateForm = false;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (editingPot) {
			updatePot(editingPot.id, formData);
		} else {
			createPot();
		}
	}

	function getProgressPercentage(pot: Pot): number {
		return pot.target > 0 ? Math.min((pot.total / pot.target) * 100, 100) : 0;
	}
</script>

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
		<form class="pot-form" onsubmit={handleSubmit}>
			<h3>{editingPot ? 'Edit Pot' : 'Create New Pot'}</h3>

			<div class="form-group">
				<label for="name">Name</label>
				<input
					id="name"
					type="text"
					bind:value={formData.name}
					placeholder="e.g., Vacation Fund"
					required
				/>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="target">Target Amount</label>
					<input
						id="target"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.target}
						placeholder="2000.00"
						required
					/>
				</div>

				<div class="form-group">
					<label for="total">Current Total</label>
					<input
						id="total"
						type="number"
						step="0.01"
						min="0"
						bind:value={formData.total}
						placeholder="159.00"
					/>
				</div>
			</div>

			<div class="form-group">
				<label for="theme-color">Theme Color</label>
				<div class="color-picker" id="theme-color">
					{#each themeColors as color}
						<button
							type="button"
							class="color-option {formData.theme === color ? 'active' : ''}"
							style="background-color: {color}"
							onclick={() => (formData.theme = color)}
							aria-label="Select color {color}"
						></button>
					{/each}
				</div>
			</div>

			<div class="form-actions">
				<button type="button" class="btn btn-secondary" onclick={cancelEdit}> Cancel </button>
				<button type="submit" class="btn btn-primary">
					{editingPot ? 'Update Pot' : 'Create Pot'}
				</button>
			</div>
		</form>
	{/if}

	{#if loading}
		<div class="loading">Loading pots...</div>
	{:else if pots.value.length === 0}
		<div class="empty-state">
			<p>No pots created yet. Start saving by creating your first pot!</p>
		</div>
	{:else}
		<div class="pots-grid">
			{#each pots.value as pot (pot.id)}
				<div class="pot-card" style="border-left: 4px solid {pot.theme}">
					<div class="pot-header">
						<h3>{pot.name}</h3>
						<div class="pot-actions">
							<button
								class="btn-icon"
								onclick={() => startEditing(pot)}
								aria-label="Edit {pot.name}"
							>
								✏️
							</button>
							<button
								class="btn-icon delete"
								onclick={() => deletePot(pot.id)}
								aria-label="Delete {pot.name}"
							>
								🗑️
							</button>
						</div>
					</div>

					<div class="pot-amounts">
						<div class="amount">
							<span class="label">Total</span>
							<span class="value">${pot.total.toFixed(2)}</span>
						</div>
						<div class="amount">
							<span class="label">Target</span>
							<span class="value">${pot.target.toFixed(2)}</span>
						</div>
					</div>

					<div class="progress-container">
						<div class="progress-bar">
							<div
								class="progress-fill"
								style="width: {getProgressPercentage(pot)}%; background-color: {pot.theme}"
							></div>
						</div>
						<span class="progress-text">
							{getProgressPercentage(pot).toFixed(1)}% complete
						</span>
					</div>
				</div>
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

		&.btn-secondary {
			background-color: #f5f5f5;
			color: #666;

			&:hover {
				background-color: #e0e0e0;
			}
		}
	}

	.btn-icon {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #f0f0f0;
		}

		&.delete:hover {
			background-color: #fee;
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

	.pot-form {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

		h3 {
			margin: 0 0 1.5rem 0;
			color: #1a1a1a;
		}

		.form-group {
			margin-bottom: 1.5rem;

			label {
				display: block;
				margin-bottom: 0.5rem;
				font-weight: 600;
				color: #333;
			}

			input {
				width: 100%;
				padding: 0.75rem;
				border: 2px solid #e0e0e0;
				border-radius: 8px;
				font-size: 1rem;
				transition: border-color 0.2s ease;

				&:focus {
					outline: none;
					border-color: #277c78;
				}
			}
		}

		.form-row {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 1rem;
		}

		.color-picker {
			display: flex;
			gap: 0.5rem;
			flex-wrap: wrap;

			.color-option {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				border: 3px solid transparent;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					transform: scale(1.1);
				}

				&.active {
					border-color: #1a1a1a;
					transform: scale(1.15);
				}
			}
		}

		.form-actions {
			display: flex;
			gap: 1rem;
			justify-content: flex-end;
			margin-top: 2rem;
		}
	}

	.pots-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.pot-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
		}

		.pot-header {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			margin-bottom: 1rem;

			h3 {
				margin: 0;
				color: #1a1a1a;
				font-size: 1.2rem;
			}

			.pot-actions {
				display: flex;
				gap: 0.25rem;
			}
		}

		.pot-amounts {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1.5rem;

			.amount {
				text-align: center;

				.label {
					display: block;
					font-size: 0.875rem;
					color: #666;
					margin-bottom: 0.25rem;
				}

				.value {
					display: block;
					font-size: 1.25rem;
					font-weight: 700;
					color: #1a1a1a;
				}
			}
		}

		.progress-container {
			.progress-bar {
				width: 100%;
				height: 8px;
				background-color: #e0e0e0;
				border-radius: 4px;
				overflow: hidden;
				margin-bottom: 0.5rem;

				.progress-fill {
					height: 100%;
					border-radius: 4px;
					transition: width 0.3s ease;
				}
			}

			.progress-text {
				font-size: 0.875rem;
				color: #666;
			}
		}
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

		.pot-form .form-row {
			grid-template-columns: 1fr;
		}

		.pots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
