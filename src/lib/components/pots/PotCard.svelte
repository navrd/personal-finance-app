<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import type { CreatePotData, Pot } from '$lib/types';

	interface PotCardProps {
		pot: Pot;
		editingPot: Pot | null;
		showCreateForm: boolean;
		formData: CreatePotData & { id?: string };
		loading: boolean;
	}

	let {
		pot,
		editingPot = $bindable(),
		showCreateForm = $bindable(),
		formData = $bindable(),
		loading = $bindable()
	}: PotCardProps = $props();

	function getProgressPercentage(pot: Pot): number {
		return pot.target > 0 ? Math.min((pot.total / pot.target) * 100, 100) : 0;
	}
	function startEditing(pot: Pot) {
		editingPot = pot;
		formData = {
			id: pot.id,
			name: pot.name,
			target: pot.target,
			total: pot.total,
			theme: pot.theme
		};
		showCreateForm = true;
	}
</script>

<div class="pot-card" style="border-left: 4px solid {pot.theme}">
	<div class="pot-header">
		<h3>{pot.name}</h3>
		<div class="pot-actions">
			<button class="btn-icon" onclick={() => startEditing(pot)} aria-label="Edit {pot.name}">
				✏️
			</button>
			<form
				method="POST"
				action="?/deletePot"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (!confirm('Are you sure you want to delete this budget?')) return;
						loading = true;
						if (result.type === 'success') {
							// Only reload pots data, not everything
							await invalidate('app:pots');
							loading = false;
						} else {
							await update(); // Handle errors normally
							loading = false;
						}
					};
				}}
			>
				<input type="hidden" name="id" value={pot.id} />
				<button type="submit" class="btn-icon delete" aria-label="Delete {pot.name}"> 🗑️ </button>
			</form>
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

<style lang="scss">
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
</style>
