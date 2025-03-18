<script lang="ts">
	import { selectedUnis } from '$lib/components/MyTable';
	import MyTable from '$lib/components/MyTable/MyTable.svelte';
	import { Dialog } from 'bits-ui';
	import { Grip, Plus, Trash, X } from 'lucide-svelte';
	import { reorder, useSortable } from '$lib/components/sortableJS.svelte';
	import { faculties } from '$lib/faculties';

	let sortable = $state<HTMLElement | null>(null);

	let savedList = selectedUnis;

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
							{faculties[parseInt(item)].code}
						</div>
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
							{faculties[parseInt(item)].code}
						</div>
					</td>
					<td class="px-4 py-3">
						<div
							class="rounded-lg p-3 shadow-sm ring-1 transition-all duration-200 hover:shadow-md hover:ring-2"
						>
							{faculties[parseInt(item)].code}
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
