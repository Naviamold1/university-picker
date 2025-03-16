<script lang="ts">
	type filterComponentProps = {
		filterValue: any;
		values: any;
		preFilteredValues: any;
		tag: 'უნივერსიტეტის' | 'კოდის' | 'ფაკულტეტის';
		tabIndex: number;
	};

	let { filterValue, values, preFilteredValues, tag, tabIndex }: filterComponentProps = $props();
</script>

<input
	data-umami-event={`filter-${tag}`}
	data-umami-event-value={$filterValue}
	class="input w-full rounded border p-2"
	type="text"
	bind:value={$filterValue}
	placeholder={`${tag} ძიება...`}
	tabindex={tabIndex}
/>
<label class="label-text" for="filter-input">
	{$values.length} out of {$preFilteredValues.length}
</label>
