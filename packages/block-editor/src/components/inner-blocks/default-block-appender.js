/**
 * External dependencies
 */
import { last } from 'lodash';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BaseDefaultBlockAppender from '../default-block-appender';
import withClientId from './with-client-id';
import { store as blockEditorStore } from '../../store';

export const DefaultBlockAppender = ( props ) => {
	return <BaseDefaultBlockAppender { ...props } />;
};

export default compose( [
	withClientId,
	withSelect( ( select, { clientId } ) => {
		const { getBlockOrder } = select( blockEditorStore );

		const blockClientIds = getBlockOrder( clientId );

		return {
			lastBlockClientId: last( blockClientIds ),
		};
	} ),
] )( DefaultBlockAppender );
