<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<main class='dark:bg-gray-900'>
	<Header />
	{@render children()}
</main>
