<script lang="ts">
	import { BlankButton, PortalDropdown } from '$lib/components/utility';
	import type { CreatePotData, Pot } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoadingDots } from '$lib/components';
	import { Dots } from '$lib/assets/images';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

	interface Props {
		showContextMenu: boolean;
		showForm: boolean;
		pot: Pot;
		editingPot: Pot | null;
		formData: CreatePotData & { id?: string };
		loading: boolean;
		resetFormData: () => void;
	}

	let {
		showContextMenu = $bindable(),
		showForm = $bindable(),
		pot = $bindable(),
		editingPot = $bindable(),
		formData = $bindable(),
		loading = $bindable(),
		resetFormData
	}: Props = $props();

	function editPot(pot: Pot) {
		editingPot = pot;
		formData = {
			id: pot.id,
			name: pot.name,
			target: pot.target,
			total: pot.total,
			theme_id: pot.theme_id
		};
		showForm = true;
		showContextMenu = false;
	}

	const enhanceDeleteForm: SubmitFunction = async ({ action, formData, cancel }) => {
		if (action.search.includes('deletePot') || action.pathname.includes('deletePot')) {
			const confirmed = confirm('Are you sure you want to delete this budget?');
			if (!confirmed) {
				cancel();
				return;
			}
		}
		loading = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:budgets');
				loading = false;
				resetFormData();
			} else {
				await update();
				loading = false;
				showContextMenu = false;
			}
		};
	};
</script>

<PortalDropdown bind:opened={showContextMenu}>
	{#snippet trigger()}
		<div>
			{@html Dots}
		</div>
	{/snippet}

	<ul class="context-menu__actions">
		<li class="action">
			<BlankButton onclick={() => editPot(pot)} fullWidth={true} flexStart>Edit pot</BlankButton>
		</li>
		<li class="action action_delete">
			<form method="POST" action="?/deletePot" use:enhance={enhanceDeleteForm}>
				<input type="hidden" name="id" value={pot.id} />
				<BlankButton type="submit" fullWidth flexStart
					>{#if loading}
						<LoadingDots dotColor="var(--color-red)" />
					{:else}Delete pot{/if}</BlankButton
				>
			</form>
		</li>
	</ul>
</PortalDropdown>

<style>
	.context-menu__actions {
		background: white;
		display: flex;
		flex-direction: column;
		gap: var(--space-m);
		min-width: 130px;
		z-index: 3;
		border-radius: var(--radius-m);
		box-shadow: var(--box-shadow);
	}
	.action {
		padding: var(--space-m) var(--space-s);
		border-bottom: var(--border-thin) solid var(--color-grey-100);
		color: var(--color-grey-900);
		font-size: var(--font-size-s);
		&:last-child {
			border-bottom: none;
		}
		&:hover {
			background: var(--color-grey-300);
		}
	}
	.action_delete {
		color: var(--color-red);
	}
</style>
