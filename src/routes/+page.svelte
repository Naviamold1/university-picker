<script lang="ts">
	import { faculties } from '$lib/faculties';
	import { reorder, useSortable } from '$lib/components/sortableJS.svelte';
	import {
		Column,
		createRender,
		createTable,
		Render,
		Subscribe
	} from '@humanspeak/svelte-headless-table';
	import {
		addColumnFilters,
		addPagination,
		addResizedColumns,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from '@humanspeak/svelte-headless-table/plugins';
	import { ArrowUpDown } from 'lucide-svelte';
	import TableCheckbox from '$lib/components/ui/table-checkbox.svelte';
	import { readable, writable } from 'svelte/store';
	import type { Details } from '$lib/faculties';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

	const data = writable<Details[]>(faculties);

	const table = createTable(data, {
		sort: addSortBy({}),
		page: addPagination({ initialPageSize: 100 }),
		filter: addTableFilter({}),
		select: addSelectedRows({}),
		resize: addResizedColumns({})
	});

	const columns = table.createColumns([
		table.display({
			id: 'selected',
			header: '',
			cell: ({ row }, { pluginStates }) => {
				const { isSomeSubRowsSelected, isSelected } = pluginStates.select.getRowState(row);
				return createRender(TableCheckbox, {
					isSelected,
					isSomeSubRowsSelected
				});
			}
		}),
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
	const { columnWidths } = pluginStates.resize;
	const { selectedDataIds } = pluginStates.select;
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	let sortable = $state<HTMLElement | null>(null);
	let sortable2 = $state<HTMLElement | null>(null);
	let myList = $state([]);

	useSortable(() => sortable, {
		animation: 200,
		group: 'shared',
		ghostClass: 'opacity-0',
		onEnd(evt: any) {
			$data = reorder($data, evt);
		}
	});

	useSortable(() => sortable2, {
		animation: 200,
		group: 'shared',
		ghostClass: 'opacity-0',
		onEnd(evt: any) {
			myList = reorder(myList, evt);
		}
	});
</script>

<div class="flex">
	<div class="flex-1 border-1" bind:this={sortable2}></div>
	<div class="flex size-[59%] flex-col p-4">
		<input
			class="input mb-4 w-full rounded border p-2"
			type="text"
			bind:value={$filterValue}
			placeholder="ფაკულტეტის ძიება..."
		/>
		<table
			class="max-w-full border-collapse overflow-x-auto overflow-y-hidden rounded-lg shadow-md"
			{...$tableAttrs}
		>
			<thead>
				{#each $headerRows as headerRow (headerRow.id)}
					<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
						<tr {...rowAttrs}>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<th {...attrs} use:props.resize class="p-2">
										<button class="flex items-center" type="button" onclick={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown size={16} class="ml-2" />
										</button>
									</th>
								</Subscribe>
							{/each}
						</tr>
					</Subscribe>
				{/each}
			</thead>
			<tbody {...$tableBodyAttrs} bind:this={sortable}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
						<tr
							in:fade={{ duration: 150 }}
							out:fade={{ duration: 150 }}
							class="z-40 cursor-move rounded-lg p-3 shadow-sm ring-1 ring-gray-200
							transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-200"
							{...rowAttrs}
							data-row={row.id}
							class:selected={rowProps.select.selected}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<!-- {#if cell.id === 'selected'}{/if} -->
									<td class="border-1 p-2 text-left" {...attrs}>
										<div>
											<Render of={cell.render()} />
										</div>
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
				წინა
			</button>
			<button
				class="rounded border px-4 py-2 disabled:opacity-50"
				disabled={!$hasNextPage}
				onclick={() => ($pageIndex = $pageIndex + 1)}
			>
				შემდეგი
			</button>
		</div>
	</div>
</div>
