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
		border: var(--thin-border-beige-500);
		border-radius: var(--radius-m);
	}

	.search-input {
		border-radius: inherit;
		width: var(--full-container-width);
		padding: var(--padding-xl) var(--padding-m);
		border: 1px solid #ccc;
		border: var(--no-border);
		outline: none;
		font-size: var(--font-size-s);
		line-height: var(--line-height);
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
