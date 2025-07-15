<script lang="ts">
	import { page } from '$app/state';
	import { BlankLink } from '$lib/components';
	import { titleToIcon, type NavLinkProps } from '$lib/types';

	let active = $derived.by(() => {
		return page.url.pathname.includes(title);
	});

	let { href, minimize, title }: NavLinkProps = $props();
</script>

<li class="sidebar__navlink" class:sidebar__navlink_minimized={minimize}>
	<BlankLink {href}>
		<div class="navlink__content" class:navlink__content_active={active}>
			<div class="navlink__underlay" class:navlink__underlay_active={active}></div>
			<div
				class="navlink__overlay"
				class:navlink__overlay_active={active}
				class:navlink__overlay_minimized={minimize}
			>
				<div class="navlink__icon">{@html titleToIcon[title]}</div>
				<span class="navlink__title" class:navlink__title_hidden={minimize}>{title}</span>
			</div>
		</div>
	</BlankLink>
</li>

<style lang="scss">
	.sidebar__navlink {
		width: 10rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.5rem;
		@media (min-width: 325px) and (max-width: 1023px) {
			height: 100%;
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
		@media (min-width: 325px) and (max-width: 1023px) {
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
		background: white;
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
		@media (min-width: 325px) and (max-width: 1023px) {
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
		justify-content: flex-start;
		gap: 0.5rem;
		z-index: 2;
		@media (min-width: 325px) and (max-width: 1023px) {
			flex-direction: column;
		}
		@media (min-width: 1024px) {
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
		* {
			color: currentColor;
			fill: currentColor;
		}
	}
	.navlink__title {
		display: flex;
	}
	.navlink__title_hidden {
		display: none;
	}
</style>
