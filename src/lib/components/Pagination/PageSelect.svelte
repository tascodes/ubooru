<script lang="ts">
	import { buildUrl } from '$lib/util/urlBuilder';
	import { isNumber } from 'lodash';

	import { getPageOptions } from './pagination';

	export let totalCount: number;
	export let pageSize: number;
	export let pageNumber: number;
	export let siblings = 1;

	export let baseUrl: string;
	export let urlSearchParams: URLSearchParams | null = null;

	export let bottom = true;

	$: visibleMin = (pageNumber - 1) * pageSize + 1;
	$: visibleMax = Math.min(visibleMin + pageSize - 1, totalCount);

	$: pageOptions = getPageOptions({
		totalCount,
		pageSize,
		siblingCount: siblings,
		currentPage: pageNumber
	});

	$: existingParams = !!urlSearchParams
		? Array.from(urlSearchParams.entries()).reduce<any>((acc, [key, value]) => {
				return { ...acc, [key]: value };
		  }, {})
		: {};

	$: pageUrls = pageOptions.map((option): string => {
		if (!isNumber(option)) {
			return '#';
		}

		return buildUrl(baseUrl, { queryParams: { ...existingParams, page: option } });
	});

	$: maxPage = Math.ceil(totalCount / pageSize);

	console.log(Math.ceil(totalCount / pageSize));
	$: previousUrl = buildUrl(baseUrl, { queryParams: { ...existingParams, page: pageNumber - 1 } });
	$: nextUrl = buildUrl(baseUrl, { queryParams: { ...existingParams, page: pageNumber + 1 } });
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div
	class:border-t={bottom}
	class:border-b={!bottom}
	class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
>
	<div class="flex-1 flex justify-between sm:hidden">
		{#if pageNumber > 1}
			<a
				href={previousUrl}
				class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
			>
				Previous
			</a>
		{:else}
			<span
				class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-300 cursor-not-allowed"
			>
				Previous
			</span>
		{/if}
		{#if pageNumber < maxPage}
			<a
				href={nextUrl}
				class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
			>
				Next
			</a>
		{:else}
			<span
				href={nextUrl}
				class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-300 cursor-not-allowed"
			>
				Next
			</span>
		{/if}
	</div>
	<div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
		<div>
			<p class="text-sm text-gray-700">
				Showing
				<span class="font-medium">{visibleMin}</span>
				to
				<span class="font-medium">{visibleMax}</span>
				of
				<span class="font-medium">{totalCount}</span>
				posts
			</p>
		</div>
		<div>
			<nav
				class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
				aria-label="Pagination"
			>
				{#if pageNumber > 1}
					<a
						href={previousUrl}
						class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
					>
						<span class="sr-only">Previous</span>
						<!-- Heroicon name: solid/chevron-left -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{:else}
					<span
						class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-gray-300 cursor-not-allowed text-sm font-medium text-gray-500"
					>
						<span class="sr-only">Previous</span>
						<!-- Heroicon name: solid/chevron-left -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				{/if}
				{#each pageOptions as pageOption, idx}
					{#if pageOption === '...'}
						<span
							class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
						>
							...
						</span>
					{:else}
						<a
							href={pageUrls[idx]}
							aria-current={pageNumber === pageOption}
							class:z-10={pageNumber === pageOption}
							class:bg-indigo-50={pageNumber === pageOption}
							class:border-indigo-500={pageNumber === pageOption}
							class:text-indigo-600={pageNumber === pageOption}
							class:bg-white={pageNumber !== pageOption}
							class:border-gray-300={pageNumber !== pageOption}
							class:text-gray-500={pageNumber !== pageOption}
							class:hover:bg-gray-50={pageNumber !== pageOption}
							class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
						>
							{pageOption}
						</a>
					{/if}
				{/each}
				<!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->

				{#if pageNumber < maxPage}
					<a
						href={nextUrl}
						class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
					>
						<span class="sr-only">Next</span>
						<!-- Heroicon name: solid/chevron-right -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{:else}
					<span
						class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-gray-200 cursor-not-allowed text-sm font-medium text-gray-500"
					>
						<span class="sr-only">Next</span>
						<!-- Heroicon name: solid/chevron-right -->
						<svg
							class="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
				{/if}
			</nav>
		</div>
	</div>
</div>
