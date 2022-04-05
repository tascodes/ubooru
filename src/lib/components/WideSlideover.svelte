<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let title = '';

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch('close');
	};

	const onKeydown = (e: KeyboardEvent) => {
		const key = e.key;

		if (key === 'Escape' && open) {
			onClose();
		}
	};
</script>

<svelte:window on:keydown={onKeydown} />

{#if open}
	<div
		class="z-20 fixed inset-0 overflow-hidden"
		aria-labelledby="slide-over-title"
		role="dialog"
		aria-modal="true"
	>
		<div class="absolute inset-0 overflow-hidden">
			<!-- Background overlay, show/hide based on slide-over state. -->

			<div
				on:click={(e) => {
					e.stopPropagation();
					onClose();
				}}
				class="absolute inset-0"
				aria-hidden="true"
			/>

			<div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
				<!--
        Slide-over panel, show/hide based on slide-over state.

        Entering: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-full"
          To: "translate-x-0"
        Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
          From: "translate-x-0"
          To: "translate-x-full"
      -->
				<div class="pointer-events-auto w-screen max-w-2xl">
					<div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
						<div class="px-4 sm:px-6">
							<div class="flex items-start justify-between">
								<h2 class="text-lg font-medium text-gray-900" id="slide-over-title">{title}</h2>
								<div class="ml-3 flex h-7 items-center">
									<button
										on:click={onClose}
										type="button"
										class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									>
										<span class="sr-only">Close panel</span>
										<!-- Heroicon name: outline/x -->
										<svg
											class="h-6 w-6"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
						<div class="relative mt-6 flex-1 px-4 sm:px-6">
							<slot />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
