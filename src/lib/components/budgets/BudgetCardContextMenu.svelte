<script lang="ts">
	import { enhance } from '$app/forms';
	import { Dots } from '$lib/assets/images';
	import { BlankButton, PortalDropdown } from '$lib/components/utility';
	import { LoadingDots } from '$lib/components/';
	import type { Budget, BudgetFormData } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidate } from '$app/navigation';

	interface Props {
		showContextMenu: boolean;
		showForm: boolean;
		budget: Budget;
		editingBudget: Budget | null;
		formData: BudgetFormData & { id?: string };
		loading: boolean;
		resetFormData: () => void;
	}

	let { showContextMenu = $bindable(), showForm = $bindable(), budget = $bindable(), editingBudget = $bindable(), formData = $bindable(), loading = $bindable(), resetFormData }: Props = $props();

	function editBudget(budget: Budget) {
		editingBudget = budget;
		formData = {
			category_id: budget.category_id,
			maximum: budget.maximum.toString(),
			theme_id: budget.theme_id,
			id: budget.id
		};
		showForm = true;
		showContextMenu = false;
	}

	const enhanceDeleteForm: SubmitFunction = async ({ action, formData, cancel }) => {
		if (action.search.includes('deleteBudget') || action.pathname.includes('deleteBudget')) {
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
			<BlankButton onclick={() => editBudget(budget)} fullWidth={true} flexStart
				>Edit budget</BlankButton
			>
		</li>
		<li class="action action_delete">
			<form method="POST" action="?/deleteBudget" use:enhance={enhanceDeleteForm}>
				<input type="hidden" name="id" value={budget.id} />
				<BlankButton type="submit" fullWidth flexStart
					>{#if loading}
						<LoadingDots dotColor="var(--color-red)" />
					{:else}Delete budget{/if}</BlankButton
				>
			</form>
		</li>
	</ul>
</PortalDropdown>

<style>
</style>
