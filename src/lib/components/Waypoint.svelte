<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const defaultBoundingClientRect = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 0,
		height: 0
	};

	export let offset = 0;
	export let throttle = 250;
	export let c = '';
	export let style = '';
	export let once = true;
	export let threshold = 1.0;
	export let disabled = false;

	let className = '';
	export { className as class };

	let visible = disabled;
	let wasVisible = false;
	let intersecting = false;
	let removeHandlers: SvelteActionReturnType;

	function throttleFn(fn: () => void, time: number) {
		let last: number;
		let deferTimer: NodeJS.Timeout;

		return () => {
			const now = +new Date();

			if (last && now < last + time) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn();
				}, time);
			} else {
				last = now;
				fn();
			}
		};
	}

	function callEvents(wasVisible: boolean) {
		if (visible && !wasVisible) {
			dispatch('enter');
			return;
		}

		if (wasVisible && !intersecting) {
			dispatch('leave');
		}

		if (once && wasVisible && !intersecting) {
			removeHandlers?.destroy!();
		}
	}

	function waypoint(node: HTMLElement) {
		if (!window || disabled) return;

		if (window.IntersectionObserver && window.IntersectionObserverEntry) {
			const observer = new IntersectionObserver(
				([{ isIntersecting }]) => {
					wasVisible = visible;

					intersecting = isIntersecting;

					if (wasVisible && once && !isIntersecting) {
						callEvents(wasVisible);
						return;
					}

					visible = isIntersecting;

					callEvents(wasVisible);
				},
				{
					rootMargin: offset + 'px',
					threshold
				}
			);

			observer.observe(node);

			let removeHandlers = {
				destroy: () => observer.unobserve(node)
			};

			return removeHandlers;
		}

		function checkIsVisible() {
			// Kudos https://github.com/twobin/react-lazyload/blob/master/src/index.jsx#L93
			if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return;

			let top;
			let height;

			try {
				({ top, height } = node.getBoundingClientRect());
			} catch (e) {
				({ top, height } = defaultBoundingClientRect);
			}

			const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;

			wasVisible = visible;
			intersecting = top - offset <= windowInnerHeight && top + height + offset >= 0;

			if (wasVisible && once && !intersecting) {
				callEvents(wasVisible);
				return;
			}

			visible = intersecting;

			callEvents(wasVisible);
		}

		checkIsVisible();

		const throttled = throttleFn(checkIsVisible, throttle);

		window.addEventListener('scroll', throttled);
		window.addEventListener('resize', throttled);

		let removeHandlers = {
			destroy: () => {
				window.removeEventListener('scroll', throttled);
				window.removeEventListener('resize', throttled);
			}
		};

		return removeHandlers;
	}
</script>

<div class="wrapper {className} {c}" {style} use:waypoint>
	{#if visible}
		<slot />
	{/if}
</div>

<style>
	.wrapper {
		display: inline-block;
	}
</style>
