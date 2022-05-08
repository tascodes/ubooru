/**
 * Represents a single section to show in the TagSlideover component.
 * This can optionally feature a title, a preset list of tags to render as checkboxes, and a free tag entry text area.
 */
export interface TagSection {
	id: string;
	title?: string;
	presets?: string[];
	textEntry?: boolean;
}

/**
 * Edit-Me: Edit the TagSections property to define your tag presets and sections.
 * This contains some defaults but this could be a great place to add presets for:
 * - Common character names
 * - Maturity ratings (ex: rating:safe, rating:mature, rating:explicit)
 * - Artist or commisioner names
 * - Common content descriptors
 * - Any tags you find yourself using frequently
 */
export const TagSections: TagSection[] = [
	{
		id: 'gender',
		presets: ['male', 'female', 'nonbinary', 'transgender', 'intersex', 'ambiguous_gender']
	},
	{
		id: 'count',
		presets: ['solo', 'duo', 'group', 'zero_pictured']
	},
	{
		id: 'character',
		title: 'Character tags',
		textEntry: true
	},
	{
		id: 'bodyType',
		presets: ['anthro', 'feral', 'humanoid', 'human', 'taur']
	},
	{
		id: 'species',
		title: 'Species Tags',
		textEntry: true
	},
	{
		id: 'other',
		title: 'Other Tags',
		textEntry: true
	}
];
