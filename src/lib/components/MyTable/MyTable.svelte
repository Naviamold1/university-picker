<script lang="ts">
	import { faculties } from '$lib/faculties';
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
	import { onMount } from 'svelte';

	const data = writable<Details[]>(faculties);

	const table = createTable(data, {
		sort: addSortBy(),
		page: addPagination({ initialPageSize: 100 }),
		filter: addColumnFilters(),
		select: addSelectedRows({
			initialSelectedDataIds: $selectedUnis.reduce((obj, key) => {
				//@ts-ignore
				obj[key] = true;
				return obj;
			}, {})
		}),
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

	let isMobile = $state(false);

	// Check if we're on mobile
	onMount(() => {
		const checkIfMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);

		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	});

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div class="mb-8 overflow-x-auto rounded-xl bg-white shadow-lg dark:bg-gray-800">
	{#if !isMobile}
		<!-- Desktop/Tablet View: Original Table -->
		<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...$tableAttrs}>
			<thead class="bg-gray-50 dark:bg-gray-700">
				{#each $headerRows as headerRow (headerRow.id)}
					<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
						<tr {...rowAttrs}>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<th
										{...attrs}
										use:props.resize
										class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
									>
										<button
											class="flex items-center focus:ring-2 focus:ring-offset-1 focus:outline-none dark:focus:ring-offset-gray-800"
											data-umami-event={`sort-${cell.id} button`}
											type="button"
											onclick={props.sort.toggle}
										>
											<Render of={cell.render()} />
											<ArrowUpDown size={16} class="ml-2 text-gray-400" />
										</button>
										{#if props.filter?.render}
											<div class="mt-2">
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
			<tbody
				class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
				{...$tableBodyAttrs}
			>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
						<tr
							in:fade={{ duration: 150 }}
							out:fade={{ duration: 150 }}
							class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
							{...rowAttrs}
							data-row={row.id}
							class:selected={rowProps.select.selected}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<td class="px-6 py-4" {...attrs}>
										<Render of={cell.render()} />
									</td>
								</Subscribe>
							{/each}
						</tr>
					</Subscribe>
				{/each}
			</tbody>
		</table>
	{:else}
		<!-- Mobile View: Cards -->
		<div class="grid gap-4 p-4">
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
					<div
						in:fade={{ duration: 150 }}
						out:fade={{ duration: 150 }}
						class="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
						{...rowAttrs}
						data-row={row.id}
						class:selected={rowProps.select.selected}
					>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<!-- Get header cell for this column to display label -->
								{#if $headerRows.length > 0 && $headerRows[0].cells.length > 0}
									{#each $headerRows[0].cells as headerCell, i}
										{#if i === row.cells.indexOf(cell)}
											<div
												class="mb-3 flex flex-col border-b border-gray-100 pb-2 dark:border-gray-600"
											>
												<span class="text-sm font-medium text-gray-500 dark:text-gray-400">
													<Render of={headerCell.render()} />
												</span>
												<div class="mt-1">
													<Render of={cell.render()} />
												</div>
											</div>
										{/if}
									{/each}
								{:else}
									<!-- Fallback if header information is not available -->
									<div class="mb-3 border-b border-gray-100 pb-2 dark:border-gray-600">
										<Render of={cell.render()} />
									</div>
								{/if}
							</Subscribe>
						{/each}
					</div>
				</Subscribe>
			{/each}
		</div>
	{/if}
	<div class="mt-4 flex items-center justify-end space-x-4 py-2">
		<button
			class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			onclick={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}
		>
			წინა
		</button>
		<button
			class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			disabled={!$hasNextPage}
			onclick={() => ($pageIndex = $pageIndex + 1)}
		>
			შემდეგი
		</button>
	</div>
</div>
