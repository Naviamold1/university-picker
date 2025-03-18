<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	let {
		isSelected,
		isSomeSubRowsSelected
	}: { isSelected: Writable<boolean>; isSomeSubRowsSelected: Readable<boolean> } = $props();
</script>

<input type="checkbox" bind:checked={$isSelected} indeterminate={$isSomeSubRowsSelected} />
