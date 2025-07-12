<script lang="ts">
    
	let { children } = $props();
</script>

<main>
	<h1>layout</h1>
	<a href="/budgets">budgets</a>
	<a href="/transactions">transactions</a>
	<a href="/reccuring">reccuring</a>
	<a href="/pots">pots</a>
	<a href="/overview">overview</a>
    {@render children()}
</main>
