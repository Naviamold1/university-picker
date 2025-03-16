<script>
	export let isSelected;
	export let isSomeSubRowsSelected;
</script>

<input type="checkbox" class='checkbox' bind:checked={$isSelected} indeterminate={$isSomeSubRowsSelected} />
