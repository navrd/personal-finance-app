<script lang="ts">
	import { PortalDropdown } from '$lib/components/utility';
	import type { ContextOption } from '$lib/types';

	interface ContextMenuProps {
		disabled: boolean;
		options: ContextOption[];
		ellipsisSize?: number;
		placement?: 'top' | 'bottom' | 'left' | 'right';
		align?: 'start' | 'end';
		offset?: number;
	}

	let {
		disabled,
		options,
		ellipsisSize = 16,
		placement = 'bottom',
		align = 'end',
		offset = 8
	}: ContextMenuProps = $props();

	let showContextMenu = $state(false);
</script>

<PortalDropdown
	bind:opened={showContextMenu}
	{options}
	iconSize={ellipsisSize}
	{placement}
	{align}
	{offset}
	{disabled}
/>