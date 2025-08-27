<script lang="ts">
	import { page } from '$app/state';
	import { BlankLink } from '$lib/components';
	import { titleToIcon, type NavLinkProps } from '$lib/types';

	let { href, minimize, title, icon }: NavLinkProps = $props();

	let iconHtml = $derived(titleToIcon[icon]);
	let active = $derived.by(() => {
		return page.url.pathname === `/app${href}`;
	});
</script>

<li class="sidebar__navlink" class:sidebar__navlink_minimized={minimize}>
	<BlankLink href="/app{href}">
		<div class="navlink__content" class:navlink__content_active={active}>
			<div class="navlink__underlay" class:navlink__underlay_active={active}></div>
			<div
				class="navlink__overlay"
				class:navlink__overlay_active={active}
				class:navlink__overlay_minimized={minimize}
			>
				<div class="navlink__icon">{@html iconHtml}</div>
				<span class="navlink__title" class:navlink__title_hidden={minimize}>{title}</span>
			</div>
		</div>
	</BlankLink>
</li>

<style lang="scss">
	.sidebar__navlink {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		@media (min-width: 0px) and (max-width: 1023px) {
			height: 100%;
		}
		@media screen and (min-width: 1024px) {
			width: 10rem;
			height: 3rem;
		}
	}
	.sidebar__navlink_minimized {
		position: relative;
		width: calc(100%);
		justify-content: center;
	}
	.navlink__underlay {
		position: absolute;
		left: 0;
		z-index: 1;
		@media (min-width: 0px) and (max-width: 1023px) {
			bottom: 0;
			width: 100%;
			height: 90%;
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
		}
		@media (min-width: 1024px) {
			top: 0;
			border-top-right-radius: 0.5rem;
			border-bottom-right-radius: 0.5rem;
			height: 100%;
			width: calc(100% - 1rem);
		}
	}
	.navlink__underlay_active {
		background: var(--color-beige-100);
	}
	.navlink__content {
		width: 100%;
		height: inherit;
		position: relative;
		display: flex;
		gap: 0.5rem;

		&:before {
			z-index: 2;
			position: absolute;
			left: 0;
			width: 0.25rem;
			height: 100%;
			content: '';
		}
		@media (min-width: 0px) and (max-width: 1023px) {
			&:before {
				bottom: 0;
				width: 100%;
				height: 0.25rem;
			}
		}
		@media (min-width: 1024px) {
			top: 0;
		}
	}
	.navlink__content_active {
		&:before {
			background: var(--color-green);
		}
	}
	.navlink__overlay {
		padding: 1rem;
		color: var(--color-grey-300);
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		z-index: 2;
		&:hover,
		&:focus,
		&:active {
			color: white;
		}
		@media (min-width: 0px) and (max-width: 1023px) {
			flex-direction: column;
			justify-content: center;
		}
		@media (min-width: 1024px) {
			justify-content: flex-start;
		}
		* {
			color: currentColor;
			fill: currentColor;
		}
	}
	.navlink__overlay_minimized {
		justify-content: center;
	}
	.navlink__overlay_active {
		color: var(--color-green);
		&:hover,
		&:focus,
		&:active {
			color: var(--color-green);
		}
		* {
			color: currentColor;
			fill: currentColor;
		}
	}
	.navlink__title {
		text-transform: capitalize;
		display: flex;
		
		@media (min-width: 0px) and (max-width: 599px) {
			display: none;
		}
		@media screen and (min-width: 600px) and (max-width: 1023px) {
			display: block;
		}
		@media (min-width: 1024px) {
			display: block;
		}
	}
	.navlink__title_hidden {
		@media (min-width: 0px) and (max-width: 599px) {
			display: none;
		}
		@media screen and (min-width: 600px) and (max-width: 1023px) {
			display: block;
		}
		@media (min-width: 1024px) {
			display: none;
		}
	}
</style>
