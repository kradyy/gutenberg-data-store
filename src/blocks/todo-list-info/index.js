import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import settings from './block.json';

registerBlockType(settings.name, {
	edit: () => {
		const data = useSelect((select) => {
			const store = select('blocks-course/todos');

			if (!store) return null;

			return {
				total: store.getTodosNumber(),
				finished: store.getDoneTodos(),
				unfinished: store.getUnDoneTodos(),
			};
		});

		return (
			<div {...useBlockProps()}>
				{__('Hello from todo-list-info')}

				{data ? (
					<p>{`We have a total of ${data.total} todos whereas ${data.finished} is finished and ${data.unfinished} is unfinished.`}</p>
				) : (
					<p>
						{__(
							'Could not fetch todos data, please try again later'
						)}
					</p>
				)}
			</div>
		);
		console.log('data :>> ', data);
	},
	save: () => {
		return '.. can go a far way!';
	},
	...settings,
});
