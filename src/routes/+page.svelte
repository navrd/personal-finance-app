<script lang="ts">
	import PieChart from "$lib/components/pieChart/PieChart.svelte";

    let {children} = $props();
</script>

<PieChart />

{@render children?.()}
