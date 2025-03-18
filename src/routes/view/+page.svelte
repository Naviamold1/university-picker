<script lang="ts">
	import { page } from '$app/state';
	import { readable } from 'svelte/store';
	import SelectedList from '$lib/components/SelectedList.svelte';

	let savedList = readable(page.url.searchParams.get('key')?.split(','));
</script>

<SelectedList {savedList} />
