<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { Close } from '$lib/assets/images';
	import type { CreatePotData, Pot } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount, onDestroy } from 'svelte';
	import CustomInput from '../CustomInput.svelte';
	import CustomSelect from '../CustomSelect.svelte';

	const colorThemes = [
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
		showForm: boolean;
	}

	let {
		editingPot = $bindable(),
		formData,
		loading = $bindable(),
		showForm = $bindable()
	}: PotFormProps = $props();

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

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidate('app:pots');
				loading = false;
				showForm = false;
				resetFormData();
			} else {
				await update();
				loading = false;
			}
		};
	};

	function onColorSelect(color: string) {
		formData.theme = color;
	}

	onMount(() => {
		document.documentElement.classList.add('overflow-hidden');
	});
	onDestroy(() => {
		document.documentElement.classList.remove('overflow-hidden');
	});
</script>

<div class="pot-form-wrapper">
	<div class="form-container">
		<form
			class="pot-form"
			method="POST"
			action={editingPot ? '?/updatePot' : '?/createPot'}
			use:enhance={enhanceForm}
		>
			<header class="form-header">
				<h2 class="title">{editingPot ? 'Edit Pot' : 'Create New Pot'}</h2>

				<button class="close" type="button" onclick={cancelEdit}>{@html Close}</button>
			</header>
			<p class="description">
				{editingPot
					? 'If your saving targets change, feel free to update your pots.'
					: 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'}
			</p>
			{#if editingPot}
				<input type="hidden" name="id" value={formData.id} />
			{/if}
			<CustomInput
				id="name"
				name="name"
				label="Pot Name"
				placeholder="e.g., Vacation Fund"
				type="text"
				bind:value={formData.name}
			/>
			<CustomInput
				bind:value={formData.target}
				type="number"
				placeholder="e.g. 200"
				symbol="$"
				name="target"
				id="target"
				label="Target"
			/>
			<CustomSelect
				options={colorThemes}
				label="color"
				onOptionClick={onColorSelect}
				selectedOption={formData.theme}
				hiddenInput
				inputName="theme"
				bind:inputValue={formData.theme}
			>
				{#snippet children(color)}
					<p class="color-option" style:--data-color={color}>{color}</p>
				{/snippet}</CustomSelect
			>

				<button type="submit" class="button">
					{loading ? 'Saving...' : editingPot ? 'Update Budget' : 'Create Budget'}
				</button>
		</form>
	</div>
</div>

<style lang="scss">
	.pot-form-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		width: 100dvw;
		height: 100dvh;
		background: rgba(0, 0, 0, 0.25);
	}
	.form-container {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	.pot-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.description {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--color-grey-500);
	}
	.color-option {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		text-transform: capitalize;
		border: 1px solid transparent;
		color: var(--color-grey-900);
		&:before {
			content: ' ';
			height: 1rem;
			width: 1rem;
			border-radius: 50%;
			background: var(--data-color);
		}
	}
	.form-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
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
	.title {
		margin: 0;
	}
	.button {
		border: 0;
		color: var(--color-white);
		background-color: var(--color-grey-900);
		line-height: 1.5;
		padding-inline: 1rem;
		padding-block: 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		&:hover,
		&:active,
		&:focus {
			cursor: pointer;
			opacity: 50%;
		}
	}
</style>
