/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { group as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
// eslint-disable-next-line no-unused-vars
import save from './save';
const { name } = metadata;
export { metadata, name };

export const settings = {
	title: __( 'Widget Group' ),
	description: __( 'A widget container.' ),
	icon,
	__experimentalLabel: ( { name: label } ) => label,
	edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				__experimentalConvert( blocks ) {
					// Avoid transforming existing `widget-group` blocks.
					const blocksContainWidgetGroup = !! blocks.filter(
						( block ) => block.name === 'core/widget-group'
					)?.length;

					if ( blocksContainWidgetGroup ) {
						return;
					}

					// Put the selected blocks inside the new Widget Group's innerBlocks.
					let innerBlocks = [
						...blocks.map( ( block ) => {
							return createBlock(
								block.name,
								block.attributes,
								block.innerBlocks
							);
						} ),
					];

					// If the first block is a heading then assume this is intended
					// to be the Widget's "title".
					const firstHeadingBlock =
						innerBlocks[ 0 ].name === 'core/heading'
							? innerBlocks[ 0 ]
							: null;

					// Remove the first heading block as we're copying
					// it's content into the Widget Group's title attribute.
					innerBlocks = innerBlocks.filter(
						( block ) => block !== firstHeadingBlock
					);

					return createBlock(
						'core/widget-group',
						{
							...( firstHeadingBlock && {
								title: firstHeadingBlock.attributes.content,
							} ),
						},
						innerBlocks
					);
				},
			},
		],
	},
};
