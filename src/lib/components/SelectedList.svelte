<script lang="ts">
	import MyTable from '$lib/components/MyTable/MyTable.svelte';
	import { Dialog } from 'bits-ui';
	import { Grip, Plus, Trash, X } from 'lucide-svelte';
	import { reorder, useSortable } from '$lib/components/sortableJS.svelte';
	import { faculties } from '$lib/faculties';
	import type { Readable, Writable } from 'svelte/store';
	import { page } from '$app/state';
	import { copy } from 'svelte-copy';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

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

	const columns = [
		{ id: 'code', label: 'კოდი' },
		{ id: 'university', label: 'უნივერსიტეტი' },
		{ id: 'faculty', label: 'ფაკულტეტი' },
		{ id: 'cost', label: 'ფასი' },
		{ id: 'financed', label: 'ფინანსდება' }
	];
</script>

<div class="container mx-auto px-4 py-8">
	<!-- Table Section -->
	<div class="mb-8 overflow-x-auto rounded-xl bg-white shadow-lg dark:bg-gray-800">
		{#if !isMobile}
			<!-- Desktop/Tablet View: Original Table -->
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-700">
					<tr>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
						></th>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
							>კოდი</th
						>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
							>უნივერსიტეტი</th
						>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
							>ფაკულტეტი</th
						>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
							>ფასი</th
						>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
							>ფინანსდება</th
						>
						<th
							class="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300"
						></th>
					</tr>
				</thead>
				<tbody
					class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
					bind:this={sortable}
				>
					{#each $savedList as item}
						<tr class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="my-handle cursor-move px-4 py-4 text-gray-400">
								<Grip class="h-5 w-5" />
							</td>
							<td class="px-4 py-4">
								<div
									class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
								>
									{faculties[parseInt(item)].code}
								</div>
							</td>
							<td class="px-4 py-4">
								<div
									class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
								>
									{faculties[parseInt(item)].university}
								</div>
							</td>
							<td class="px-4 py-4">
								<div
									class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
								>
									{faculties[parseInt(item)].faculty}
								</div>
							</td>
							<td class="px-4 py-4">
								<div
									class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
								>
									{faculties[parseInt(item)].cost}
								</div>
							</td>
							<td class="px-4 py-4">
								<div
									class="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-blue-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:ring-blue-500"
								>
									{faculties[parseInt(item)].financed}
								</div>
							</td>
							<td class="px-4 py-4">
								<button
									type="button"
									title="წაშლა"
									class="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none dark:hover:bg-red-900/20"
									onclick={() => ($savedList = $savedList.filter((i) => i !== item))}
								>
									<Trash class="h-5 w-5" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<!-- Mobile View: Cards -->
			<div class="grid gap-4 p-4" bind:this={sortable}>
				{#each $savedList as item}
					<div
						in:fade={{ duration: 150 }}
						out:fade={{ duration: 150 }}
						class="relative rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600"
					>
						<!-- Grip handle for mobile -->
						<div class="my-handle absolute top-2 right-2 cursor-move text-gray-400">
							<Grip class="h-5 w-5" />
						</div>

						<!-- Content -->
						<div class="grid gap-3">
							{#each columns as column}
								<div class="flex flex-col border-b border-gray-100 pb-2 dark:border-gray-600">
									<span class="text-sm font-medium text-gray-500 dark:text-gray-400">
										{column.label}
									</span>
									<div
										class="mt-1 rounded-md bg-white p-2 shadow-sm ring-1 ring-gray-200 dark:bg-gray-700 dark:ring-gray-600"
									>
										{(faculties[parseInt(item)] as any)[column.id]}
									</div>
								</div>
							{/each}
						</div>

						<!-- Delete button -->
						<div class="mt-4 flex justify-end">
							<button
								type="button"
								title="წაშლა"
								class="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none dark:hover:bg-red-900/20"
								onclick={() => ($savedList = $savedList.filter((i) => i !== item))}
							>
								<Trash class="h-5 w-5" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Add University Button and Dialog -->
	<Dialog.Root>
		<div class="mb-8 flex items-center justify-center">
			<Dialog.Trigger
				title="უნივერსიტეტის დამატება"
				class="inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-md transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
			>
				<Plus class="h-6 w-6" />
				<span class="ml-2 font-medium">დამატება</span>
			</Dialog.Trigger>
		</div>
		<Dialog.Portal>
			<Dialog.Overlay
				class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity dark:bg-black/60"
			/>
			<Dialog.Content
				class="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-full -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-2xl focus:outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-white"
			>
				<div class="mb-6 flex items-center justify-between">
					<Dialog.Title class="text-xl font-semibold text-gray-900 dark:text-white"
						>Selected Universities</Dialog.Title
					>
					<Dialog.Close
						class="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
					>
						<X class="h-5 w-5" />
					</Dialog.Close>
				</div>
				<MyTable />
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<!-- Share Section -->
	<div class="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
		<label for="clipboard" class="mb-2 block font-bold text-gray-700 dark:text-gray-300"
			>Share</label
		>
		<div class="relative" id="clipboard">
			<input
				title="ლინკი გაზიარებისათვის"
				placeholder="loading..."
				type="text"
				class="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pr-12 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				value={`${page.url}view?key=${$savedList.join(',')}`}
				disabled
				readonly
			/>
			<button
				type="button"
				aria-label="copy-link"
				title="ლინკის კოპირება"
				use:copy={`${page.url}view?key=${$savedList.join(',')}`}
				class="absolute end-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
			>
				<span id="default-icon">
					<svg
						class="h-4 w-4"
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
</div>
