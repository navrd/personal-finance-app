<script lang="ts">
	import type { BooleanContextValue } from '$lib/types';
	import { getContext, type Snippet } from 'svelte';
	import { BlankButton } from './utility';

	interface SidebarActionProps {
		onclick?: (...args: any[]) => any;
		rotate?: boolean;
		text: string;
		children: Snippet;
		buttonType?: 'button' | 'submit' | 'reset' | null | undefined;
	}

	let {
		onclick,
		rotate = false,
		text,
		children,
		buttonType = 'button'
	}: SidebarActionProps = $props();

	let minimize: BooleanContextValue = getContext('minimize');
</script>

<BlankButton {onclick} type={buttonType}
	><div class="sidebar-action" class:sidebar-action__minimized={minimize.value}>
		<div class="sidebar-action__icon" class:sidebar-action__icon_rotated={minimize.value && rotate}>
			{@render children?.()}
		</div>
		<span>{text}</span>
	</div></BlankButton
>
