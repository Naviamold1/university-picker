<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
	let { children } = $props();
</script>

<main>
	<Header />
	{@render children()}
</main>
