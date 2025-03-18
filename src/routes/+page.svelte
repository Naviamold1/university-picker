<script lang="ts">
	import { selectedUnis } from '$lib/components/MyTable';
	import SelectedList from '$lib/components/SelectedList.svelte';
</script>

<SelectedList savedList={selectedUnis} />
