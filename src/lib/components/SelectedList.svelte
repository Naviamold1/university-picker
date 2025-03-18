<script lang="ts">
	import MyTable from '$lib/components/MyTable/MyTable.svelte';
	import { Dialog } from 'bits-ui';
	import { Grip, Plus, Trash, X } from 'lucide-svelte';
	import { reorder, useSortable } from '$lib/components/sortableJS.svelte';
	import { faculties } from '$lib/faculties';
	import type { Readable, Writable } from 'svelte/store';
	import { page } from '$app/state';
	import { copy } from 'svelte-copy';

	let sortable = $state<HTMLElement | null>(null);

	let { savedList }: { savedList: Writable<string[]> | Readable<string[]> } = $props();

	useSortable(() => sortable, {
		animation: 200,
		handle: '.my-handle',
		ghostClass: 'opacity-0',
		onEnd(evt) {
			$savedList = reorder($savedList, evt);
		}
	});
</script>

<div class="flex items-center justify-center py-16">
	<table class="min-w-full divide-y">
		<thead class="">
			<tr>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">კოდი</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"
					>უნივერსიტეტი</th
				>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">ფაკულტეტი</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">ფასი</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">ფინანსდება</th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
				<th class="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase"></th>
			</tr>
		</thead>
		<tbody class="divide-y" bind:this={sortable}>
			{#each $savedList as item}
				<tr class="">
					<td class="my-handle cursor-move px-4 py-3">
						<Grip />
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].code}
						</div>
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].university}
						</div>
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].faculty}
						</div>
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].cost}
						</div>
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].financed}
						</div>
					</td>
					<td class="px-4 py-3">
						<button
							type="button"
							onclick={() => ($savedList = $savedList.filter((i) => i !== item))}
						>
							<Trash color="red" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Dialog.Root>
	<div class="flex items-center justify-center">
		<Dialog.Trigger
			class="btn-icon preset-filled inline-flex items-center justify-center rounded-full p-2  transition-colors  focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
		>
			<Plus class="h-5 w-5" />
		</Dialog.Trigger>
	</div>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 backdrop-blur-2xl transition-opacity dark:bg-black/50" />
		<Dialog.Content
			class="fixed top-1/2 left-1/2 max-h-[85vh] max-w-full -translate-x-1/2 -translate-y-1/2 flex-wrap overflow-y-auto rounded-lg  border border-gray-200 p-6 shadow-xl focus:outline-none"
		>
			<div class="mb-4 flex items-center justify-between">
				<Dialog.Title class="text-lg font-medium ">Selected Universities</Dialog.Title>
				<Dialog.Close class="rounded-full p-1 focus:outline-none">
					<X class="h-4 w-4" />
				</Dialog.Close>
			</div>
			<MyTable />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<div class="w-full max-w-[19rem]">
	<label for="clipboard" class="label py-1 pl-1 font-bold">Share</label>
	<div class="relative" id="clipboard">
		<input
			type="text"
			class="col-span-6 inline-block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			value={`${page.url}view?key=${$savedList.join(',')}`}
			disabled
			readonly
		/>
		<button
			aria-label="copy-link"
			use:copy={`${page.url}view?key=${$savedList.join(',')}`}
			class="absolute end-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
		>
			<span id="default-icon">
				<svg
					class="h-3.5 w-3.5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 18 20"
				>
					<path
						d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"
					/>
				</svg>
			</span>
		</button>
	</div>
</div>
