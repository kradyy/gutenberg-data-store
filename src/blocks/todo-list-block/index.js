import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { CheckboxControl, TextControl, Button } from '@wordpress/components';
import settings from './block.json';

const Edit = () => {
	const todos = useSelect((select) => {
		const store = select('blocks-course/todos');
		return store && store.getTodos();
	}, []);

	const actions = useDispatch('blocks-course/todos');
	const notices = useDispatch('core/notices');

	const [todo, setTodo] = useState('');
	const [addingTodo, setAddingTodo] = useState(false);

	const addTodo = async (e) => {
		e.preventDefault();

		if (!todo) {
			return false;
		}

		setAddingTodo(true);
		await actions.addTodo(todo);
		setAddingTodo(false);
		setTodo('');
	};

	const toggleTodo = async (todo) => {
		const { id, completed } = todo;
		await actions.toggleTodo({ ...todo, completed: !completed });
	};

	return (
		<div {...useBlockProps()}>
			{!todos ? (
				<p>
					{__(
						'Please activate the data-store-demo plugin.',
						'data-store'
					)}
				</p>
			) : (
				<>
					<ul>
						{todos.map((e) => {
							return (
								<li
									key={e.id}
									className={
										e.completed ? 'completed' : false
									}
								>
									<CheckboxControl
										checked={e.completed}
										label={e.title}
										disabled={e.loading}
										onChange={() => toggleTodo(e)}
									/>
								</li>
							);
						})}
					</ul>
					<form
						className="addtodo-form"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<TextControl
							value={todo}
							onChange={(e) => setTodo(e)}
						/>
						<Button
							type="submit"
							value="test"
							onClick={addTodo}
							isPrimary
							disabled={!todo || addingTodo}
						>
							{__('Add todo')}
						</Button>
					</form>
				</>
			)}
		</div>
	);
};

const Save = () => {
	return '.. can go a far way!';
};

registerBlockType(settings.name, {
	edit: Edit,
	save: Save,
	...settings,
});
