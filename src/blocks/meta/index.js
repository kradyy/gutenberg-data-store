import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import settings from './block.json';

const Edit = () => {
	const title = useSelect((select) => {
		return select('core/editor').getEditedPostAttribute('title');
	}, []);

	// Getting meta, variation 1
	const metas = useSelect((select) => {
		return select('core/editor').getEditedPostAttribute('meta');
	}, []);

	const actions = dispatch('core/editor');

	const updatePostTitle = (value) => {
		actions.editPost({ title: value });
	};

	const postType = useSelect((select) => {
		return select('core/editor').getCurrentPostType();
	}, []);

	// Getting meta, variation 2 (PROPER)
	const [meta, setEntity] = useEntityProp('postType', postType, 'meta');

	useEffect(() => {
		if (!meta) return;

		setEntity({ ...meta, testfield: '12345' });
	}, []);

	return (
		<div {...useBlockProps()}>
			{__('This block will be visible on all pages as a template.')}
			<h2>
				{__('Current title:')} {title}
			</h2>
			<TextControl
				label={__('Post title')}
				onChange={(value) => updatePostTitle(value)}
				value={title}
			/>

			<p>{__('List of meta-fields:')}</p>

			<ul>
				{metas &&
					Object.entries(metas).map((meta) => {
						const [key, value] = meta;

						return (
							<li>
								<strong>{key}</strong>: {value}
							</li>
						);
					})}
			</ul>
		</div>
	);
};

registerBlockType(settings.name, {
	edit: Edit,
	save: () => {
		return null;
	},
	...settings,
});
