<script>
	import { faculties } from '$lib/faculties';
	import { createTable, Render, Subscribe } from '@humanspeak/svelte-headless-table';
	import {
		addColumnFilters,
		addPagination,
		addResizedColumns,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from '@humanspeak/svelte-headless-table/plugins';
	import { ArrowUpDown } from 'lucide-svelte';
	import { readable } from 'svelte/store';

	const table = createTable(readable(faculties), {
		sort: addSortBy({}),
		page: addPagination({ initialPageSize: 100 }),
		filter: addTableFilter({}),
		select: addSelectedRows({}),
		resize: addResizedColumns({})
	});

	const columns = table.createColumns([
		table.column({
			header: 'კოდი',
			accessor: 'code'
		}),
		table.column({
			header: 'უნივერსიტეტი',
			accessor: 'university'
		}),
		table.column({
			header: 'ფაკულტეტი',
			accessor: 'faculty'
		}),
		table.column({
			header: 'ფასი',
			accessor: 'cost'
		}),
		table.column({
			header: 'ფინანსდება',
			accessor: 'financed'
		})
	]);

	const { headerRows, rows, tableAttrs, tableBodyAttrs, pageRows, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div class="p-4">
	<input
		class="input mb-4 w-full rounded border p-2"
		type="text"
		bind:value={$filterValue}
		placeholder="Search rows..."
	/>
	<table class="min-w-full border-collapse overflow-hidden rounded-lg shadow-md" {...$tableAttrs}>
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<td class="p-2 text-left">
									<button class="flex items-center" onclick={props.sort.toggle}>
										<Render of={cell.render()} />
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="ml-2 h-4 w-4"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m9-13.5L16.5 3m0 0L21 7.5M16.5 3v13.5"
											/>
										</svg>
									</button>
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr class="border-b" {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td class="p-2 text-left" {...attrs}>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
	<div class="flex items-center justify-end space-x-4 py-4">
		<button
			class="rounded border px-4 py-2 disabled:opacity-50"
			onclick={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>
			Previous
		</button>
		<button
			class="rounded border px-4 py-2 disabled:opacity-50"
			disabled={!$hasNextPage}
			onclick={() => ($pageIndex = $pageIndex + 1)}
		>
			Next
		</button>
	</div>
</div>
