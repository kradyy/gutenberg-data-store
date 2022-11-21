import { __ } from '@wordpress/i18n';
import { createReduxStore, register, dispatch } from '@wordpress/data';
import {
	ADD_TODO,
	FETCH_TODOS,
	POPULATE_TODOS,
	CREATE_TODO,
	UPDATE_TODO,
	TOGGLE_TODO,
} from './types';

const DEFAULT_STATE = {
	items: [],
};

const popuLateTodosController = (todos) => {
	return {
		type: POPULATE_TODOS,
		todos,
	};
};

const fetchTodosController = () => {
	return {
		type: FETCH_TODOS,
	};
};

const createTodoController = (title) => {
	return {
		type: CREATE_TODO,
		title,
	};
};

const updateTodoController = (values) => {
	return {
		type: UPDATE_TODO,
		values,
	};
};

const toggleTodoController = (values) => {
	return {
		type: TOGGLE_TODO,
		values,
	};
};

const store = createReduxStore('blocks-course/todos', {
	reducer(state = DEFAULT_STATE, action) {
		const items = [...state.items];

		const findIndex =
			action.values && items.findIndex((e) => e.id === action.values.id);

		switch (action.type) {
			case ADD_TODO:
				return { ...state, items: [...state.items, action.todo] };
			case UPDATE_TODO:
				// Merge the two objects if we have a match (ID is vital)
				let updatedItems = [...items];

				if (findIndex !== -1) {
					updatedItems[findIndex] = {
						...items[findIndex],
						...action.values,
					};
				}

				return { items: updatedItems };
			case TOGGLE_TODO:
				if (findIndex !== -1) {
					items[findIndex] = {
						...items[findIndex],
						completed: action.values.completed,
					};
				}

				return { ...state, items };
			case POPULATE_TODOS:
				return { ...state, items: action.todos };
			default:
				return state;
		}
	},
	actions: {
		*addTodo(title) {
			try {
				const todo = yield createTodoController(title);

				return {
					type: ADD_TODO,
					todo,
				};
			} catch (error) {
				return dispatch('core/notices').createErrorNotice(
					error.message || __('Could not create todo.')
				);
			}
		},
		*toggleTodo(todo) {
			const { id, completed } = todo;

			try {
				//yield updateTodoController({ ...todo, loading: true });
				const values = yield toggleTodoController({ id, completed });
				//yield updateTodoController({ ...todo, loading: false });

				return {
					type: TOGGLE_TODO,
					values,
				};
			} catch (error) {
				console.error('error 2 b');
				return dispatch('core/notices').createErrorNotice(
					error.message || __('Could not toggle todo.')
				);
			}
		},
		*updateTodo(todo) {
			try {
				const values = yield updateTodoController(todo);

				console.log('values', values);
				return {
					type: UPDATE_TODO,
					values,
				};
			} catch (error) {
				console.error('error 1');
				return dispatch('core/notices').createErrorNotice(
					error.message || __('Could not update todo.')
				);
			}
		},
		popuLateTodosController,
	},
	selectors: {
		// Selectors should not have any side-effects (ie. fetch)
		getTodos(state) {
			return state.items;
		},
		getTodosNumber(state) {
			return state.items.length;
		},
		getDoneTodos(state) {
			return state.items.filter((e) => e.completed).length;
		},
		getUnDoneTodos(state) {
			return state.items.filter((e) => !e.completed).length;
		},
	},
	resolvers: {
		*getTodos() {
			try {
				const todos = yield fetchTodosController();
				return popuLateTodosController(todos);
			} catch (e) {
				console.error('error 3');
				return dispatch('core/notices').createErrorNotice(
					e.message || __('Could not fetch todos')
				);
			}
		},
	},
	controls: {
		TOGGLE_TODO({ values: { id, completed } }) {
			return window
				.fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
					method: 'PATCH',
					body: JSON.stringify({
						completed,
					}),
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
				})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Could not update todo with id ' + id);
					}
					return response.json();
				})
				.then((json) => {
					if (!json.id) {
						throw new Error(
							`A note with the id ${id} doesn't exist.`
						);
					}
					return json;
				});
			// .catch((error) => {
			// 	notices.createErrorNotice(error);
			// })
			// .finally(() => {
			// 	// all done
			// })
		},
		/**
		 * Newly created TODOs wont be editable since no real data
		 * is creted.
		 */
		CREATE_TODO({ title }) {
			return window
				.fetch('https://jsonplaceholder.typicode.com/todos', {
					method: 'POST',
					body: JSON.stringify({
						title,
						completed: false,
						userid: 1,
					}),
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
				})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Could not create todo.');
					}
					return response.json();
				})
				.then((json) => {
					if (!json.id) {
						throw new Error('Could not create todo.');
					}

					json.userCreated = 1;
					return json;
				});
			// .catch((error) => {
			// 	notices.createErrorNotice(error);
			// })
			// .finally(() => {
			// 	// all done
			// })
		},
		FETCH_TODOS() {
			//dispatch('core/notices').removeNotice();
			return window
				.fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
				.then((response) => {
					if (response.ok) {
						return response.json();
					}

					throw new Error('Could not fetch todos');
				});
		},
	},
});

register(store);
