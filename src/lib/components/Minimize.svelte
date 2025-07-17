<script lang="ts">
	import { Arrow } from '$lib/assets/images';
	import type { BooleanContextValue } from '$lib/types';
	import { getContext } from 'svelte';
	import { BlankButton } from './utility';

	let minimize: BooleanContextValue = getContext('minimize');
</script>

<BlankButton onclick={() => (minimize.value = !minimize.value)}
	><div class="minimize" class:minimize__minimized={minimize.value}>
		<div class="minimize__icon" class:minimize__icon_rotated={minimize.value}>{@html Arrow}</div>
		<span>Minimize</span>
	</div></BlankButton
>

<style lang="scss">
	.minimize {
		padding: 1rem;
		display: flex;
		justify-content: flex-start;
		color: var(--color-grey-300);
		align-items: center;
		gap: 0.5rem;
		&:hover,
		&:focus,
		&:active {
			color: white;
		}
		@media (min-width: 0px) and (max-width: 1023px) {
			height: 100%;
		}
		@media screen and (min-width: 1024px) {
			width: 10rem;
			height: 3rem;
		}
		* {
			color: currentColor;
			fill: currentColor;
		}
	}
    .minimize__icon {
        transition: transform 0.3s ease;
    }
    .minimize__icon_rotated {
        transform: rotate(180deg);
    }
	.minimize__minimized {
		width: 5rem;
		justify-content: center;
		span {
			display: none;
		}
	}
</style>
