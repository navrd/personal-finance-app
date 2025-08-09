<script lang="ts">
	import { Search } from '$lib/assets/images';

	interface SearchInputProps {
		value: string;
	}

	let { value = $bindable() }: SearchInputProps = $props();
</script>

<div class="search-container">
	<div class="search-icon">
		{@html Search}
	</div>
	<input class="search-input" type="text" placeholder="Search..." bind:value />
</div>

<style lang="scss">
	.search-container {
		min-width: 150px;
		position: relative;
		display: inline-block;
		color: var(--color-grey-500);
		border: 1px solid var(--color-beige-500);
		border-radius: 0.75rem;
	}

	.search-input {
		border-radius: inherit;
		width: 100%;
		padding: 1.25rem 0.75rem;
		border: 1px solid #ccc;
		border: 0;
		outline: none;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.search-icon {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
		height: 1rem;
		pointer-events: none;
	}
</style>
