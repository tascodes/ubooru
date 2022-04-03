export function classes(node: HTMLElement, classes: { [key: string]: boolean }) {
	setCustomClasses(node, classes);

	return {
		update(classes: { [key: string]: boolean }) {
			setCustomClasses(node, classes);
		}
	};
}

/**
 *
 * @param {HTMLElement} node
 * @param {{[key: string]: string}} classes
 */
function setCustomClasses(node: HTMLElement, classes: { [key: string]: boolean }) {
	Object.entries(classes).forEach(([key, value]) => {
		if (value) {
			node.classList.add(key);
		} else {
			node.classList.remove(key);
		}
	});
	node.classList.add();
}
