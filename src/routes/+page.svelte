<script lang="ts">
	import { getAuthContext } from '$lib/auth/context.svelte';

	let auth = getAuthContext();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button onclick={auth.signOut}>Sign out</button>
<h1>layout</h1>
<a href="/budgets">budgets</a>
<a href="/transactions">transactions</a>
<a href="/reccuring">reccuring</a>
<a href="/pots">pots</a>
<a href="/overview">overview</a>
