<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { CreatePotData, Pot } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';

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

	interface PotFormProps {
		editingPot: Pot | null;
		formData: CreatePotData & { id?: string };
		loading: boolean;
		showCreateForm: boolean;
	}

	let {
		editingPot = $bindable(),
		formData,
		loading = $bindable(),
		showCreateForm = $bindable()
	}: PotFormProps = $props();

	function resetForm() {
		formData = {
			name: '',
			target: 0,
			total: 0,
			theme: '#277C78'
		};
	}

	function cancelEdit() {
		editingPot = null;
		resetForm();
		showCreateForm = false;
	}

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:pots');
				loading = false;
				showCreateForm = false;
				resetForm();
			} else {
				await update();
				loading = false;
			}
		};
	};
</script>

<form
	class="pot-form"
	method="POST"
	action={editingPot ? '?/updatePot' : '?/createPot'}
	use:enhance={enhanceForm}
>
	<h3>{editingPot ? 'Edit Pot' : 'Create New Pot'}</h3>
	{#if editingPot}
		<input type="hidden" name="id" value={formData.id} />
	{/if}
	<div class="form-group">
		<label for="name">Name</label>
		<input
			id="name"
			name="name"
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
				name="target"
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
				name="total"
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
			<input type="hidden" name="theme" bind:value={formData.theme} />
		</div>
	</div>

	<div class="form-actions">
		<button type="button" class="btn btn-secondary" onclick={cancelEdit}> Cancel </button>
		<button type="submit" class="btn btn-primary">
			{loading ? 'Saving...' : editingPot ? 'Update Budget' : 'Create Budget'}
		</button>
	</div>
</form>

<style lang="scss">
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
	.pot-form .form-row {
		grid-template-columns: 1fr;
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
</style>
