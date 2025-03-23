<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { Moon, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<div
	class="sticky z-10 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm md:top-0 dark:border-gray-800 dark:bg-gray-900/95"
>
	<header class="container mx-auto flex items-center justify-between px-4 py-4 sm:py-5">
		<a href="/" class="group transition-colors hover:text-blue-600 dark:hover:text-blue-400">
			<h1 class="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
				<span class="inline-block transition-transform group-hover:-translate-y-0.5"
					>უნივერსიტეტების</span
				>
				<span
					class="inline-block text-red-400 transition-transform group-hover:translate-y-1 dark:text-red-400"
					>ჩამონათვალი</span
				>
			</h1>
		</a>

		<div class="flex items-center gap-4">
			<!-- GitHub Link -->
			<a
				href={`https://github.com/Naviamold1/university-picker`}
				target="_blank"
				rel="noopener noreferrer"
				class="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-blue-400"
				aria-label="View source on GitHub"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-github"
					><path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
				>
			</a>

			<!-- Theme Toggle Button -->
			<Button
				onclick={toggleMode}
				variant="outline"
				size="icon"
				class="h-9 w-9 rounded-full border-gray-200 shadow-sm hover:bg-gray-100 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-blue-400"
			>
				<Sun
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</header>
</div>

<style>
	/* Optional: Add a subtle animation for the header on scroll */
	@keyframes slideDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	/* Apply the animation when scrolling down */
	:global(html.scrolled) .sticky {
		animation: slideDown 0.3s ease-in-out;
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}
</style>
