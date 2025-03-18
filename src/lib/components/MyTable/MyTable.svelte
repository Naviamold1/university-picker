<script lang="ts">
	import { faculties } from '$lib/faculties';
	import { reorder, useSortable } from '$lib/components/sortableJS.svelte';
	import { createRender, createTable, Render, Subscribe } from '@humanspeak/svelte-headless-table';
	import {
		addColumnFilters,
		addPagination,
		addResizedColumns,
		addSelectedRows,
		addSortBy,
		textPrefixFilter
	} from '@humanspeak/svelte-headless-table/plugins';
	import { ArrowUpDown, Grip } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import type { Details } from '$lib/faculties';
	import { fade } from 'svelte/transition';
	import TextFilter from '$lib/components/ui/textFilter.svelte';
	import { textFussyFilter } from '$lib/fussyFilter';
	import SelectIndicator from '$lib/components/SelectIndicator.svelte';
	import { selectedUnis } from '.';

	const data = writable<Details[]>(faculties);

	const table = createTable(data, {
		sort: addSortBy(),
		page: addPagination({ initialPageSize: 100 }),
		filter: addColumnFilters(),
		select: addSelectedRows(),
		resize: addResizedColumns()
	});

	const columns = table.createColumns([
		table.display({
			id: 'selected',
			header: '',
			cell: ({ row }, { pluginStates }) => {
				const { isSomeSubRowsSelected, isSelected } = pluginStates.select.getRowState(row);
				return createRender(SelectIndicator, {
					isSelected,
					isSomeSubRowsSelected
				});
			}
		}),
		table.column({
			header: 'კოდი',
			accessor: 'code',
			plugins: {
				filter: {
					fn: textPrefixFilter,
					initialFilterValue: '',
					render: ({ filterValue, values, preFilteredValues }) =>
						createRender(TextFilter, {
							filterValue,
							values,
							preFilteredValues,
							tag: 'კოდის',
							tabIndex: 1
						})
				}
			}
		}),
		table.column({
			header: 'უნივერსიტეტი',
			accessor: 'university',
			plugins: {
				filter: {
					fn: textFussyFilter,
					initialFilterValue: '',
					render: ({ filterValue, values, preFilteredValues }) =>
						createRender(TextFilter, {
							filterValue,
							values,
							preFilteredValues,
							tag: 'უნივერსიტეტის',
							tabIndex: 2
						})
				}
			}
		}),
		table.column({
			header: 'ფაკულტეტი',
			accessor: 'faculty',
			plugins: {
				filter: {
					fn: textFussyFilter,
					initialFilterValue: '',
					render: ({ filterValue, values, preFilteredValues }) =>
						createRender(TextFilter, {
							filterValue,
							values,
							preFilteredValues,
							tag: 'ფაკულტეტის',
							tabIndex: 3
						})
				}
			}
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

	const { selectedDataIds } = pluginStates.select;

	function updateSelectedUnis() {
		$selectedUnis = Object.keys($selectedDataIds);
	}

	$effect(() => {
		if ($selectedDataIds) {
			updateSelectedUnis();
		}
	});

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	let sortable = $state<HTMLElement | null>(null);

	useSortable(() => sortable, {
		animation: 200,
		group: 'shared',
		ghostClass: 'opacity-0',
		handle: '.drag-handle',
		onEnd(evt: any) {
			$data = reorder($data, evt);
		}
	});
</script>

<div class="z-[100] flex size-[59%] flex-col p-4">
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
									<button
										class="flex items-center"
										data-umami-event={`sort-${cell.id} button`}
										type="button"
										onclick={props.sort.toggle}
									>
										<Render of={cell.render()} />
										<!-- {#if cell.id !== 'selected' || cell.id === 'selected-end'} -->
										<ArrowUpDown size={16} class="ml-2" />
										<!-- {/if} -->
									</button>
									{#if props.filter?.render}
										<div>
											<Render of={props.filter.render} />
										</div>
									{/if}
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
						class="z-40 rounded-lg p-3 shadow-sm ring-1 ring-gray-200
							transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-200"
						{...rowAttrs}
						data-row={row.id}
						class:selected={rowProps.select.selected}
					>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<!-- {#if cell.id === 'selected'}{/if} -->
								<td class="relative border-1 p-2 text-left" {...attrs}>
									{#if cell.id === 'selected' || cell.id === 'selected-end'}
										<div class="drag-handle absolute inset-2 flex cursor-move items-center">
											<Render of={cell.render()} />
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
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
