<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	interface SuccesfulSubmitProps {
		size?: string | number;
		message?: string;
	}

	let { size = '3rem', message = 'submitted succesfully' }: SuccesfulSubmitProps = $props();
	let active = $state(false);
	let animationTimeout: NodeJS.Timeout;
	onMount(() => {
		animationTimeout = setTimeout(() => (active = true));
	});
	onDestroy(() => clearTimeout(animationTimeout));
</script>

<section class="succesful-submit" style:--mark-size={size}>
	<div class="succesful-submit__mark" style:--mark-size={size}>
		<div class="mark__circle" class:mark__circle_active={active} style:--mark-size={size}>
			<div class="mark__check" class:mark__check_active={active} style:--mark-size={size}></div>
		</div>
	</div>
	<h2 class="succesful-submit__title">{message}</h2>
</section>

<style lang="scss">
	$animationDuration: 0.33s;
	:root {
		--mark-border-radius: calc(var(--mark-size) / 2);
		--mark-transform: scale(0);
		--mark-transform-active: scale(1);

		--mark-check-width: calc(var(--mark-size) / 4);
		--mark-check-height: calc(var(--mark-size) / 2);
		--mark-check-border: var(--no-border).5rem solid white;
		--mark-check-transform: scale(0) rotate(45deg);
		--mark-check-transform-active: scale(1) rotate(45deg);
		--mark-border-radius: var(--radius-round);
	}

	.succesful-submit {
		min-height: var(--mark-size);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--gap-l);
		background: inherit; 
		color: inherit;
        @media screen and (max-width: 899px) {
            flex-direction: column;
        }
	}
	.succesful-submit__mark {
		width: var(--mark-size);
		height: var(--mark-size);
	}
	.mark__circle {
		display: flex;
		justify-content: center;
		align-items: center;
		width: inherit;
		height: inherit;
		background: var(--color-grey-900);;
		border-radius: var(--mark-border-radius);
		transform: var(--mark-transform);
		transition: transform $animationDuration ease;
	}
	.mark__circle_active {
		transform: var(--mark-transform-active);
	}
	.mark__check {
		width: calc(var(--mark-size) / 4);
		height: calc(var(--mark-size) / 2);
		border-bottom: calc(var(--mark-size) / 10) solid white;
		border-right: calc(var(--mark-size) / 10) solid white;
		transform: var(--mark-check-transform);
		transform-origin: center;
		transition: transform calc($animationDuration * 2) cubic-bezier(0.165, 0.84, 0.44, 1);
	}
	.mark__check_active {
		transform: var(--mark-check-transform-active);
	}
	.succesful-submit__title {
		color: inherit;
		font-size: var(--text-2xl);
        text-wrap: wrap;
	}
</style>
