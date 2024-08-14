import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import KanbanBoard from '@/components/shared/Board';
import { Store, StoreDispatch } from '@/store';
import {
	getColumnsFromUserId,
	createColumnFromUserId,
	deleteColumnFromColumnId,
	updateColumnFromColumnId,
	createTodo,
	deleteTodo,
	updateTodo,
	type Column,
	Todo,
} from '@/entities/todo/store';
import { TodoRequiredFields, type ColumnRequiredFields } from '@/components/shared/Board/KanbanBoard';

function isRejected(actionType: string) {
	return actionType.includes('rejected');
}

export default function TodoList() {
	const [isLoading, setLoading] = useState(true);
	const { user } = useSelector((state: Store) => state.user);
	const { columns, todos } = useSelector((state: Store) => state.todo);
	const dispatch = useDispatch<StoreDispatch>();

	async function onCreateColumn() {
		const { payload } = await dispatch(createColumnFromUserId(user?.id || ''));
		return payload as unknown as ColumnRequiredFields;
	}

	async function onDeleteColumn(column: ColumnRequiredFields) {
		const response = await dispatch(deleteColumnFromColumnId(column.id.toString()));
		if (isRejected(response.type)) {
			throw new Error(response.payload as string);
		}
	}

	async function onUpdateColumn(column: ColumnRequiredFields, title: string) {
		const response = await dispatch(updateColumnFromColumnId({ ...column, title } as Column));
		if (isRejected(response.type)) {
			throw new Error(response.payload as string);
		}
	}

	async function onCreateTodo(columnId: number) {
		const { payload } = await dispatch(createTodo({ columnId, userId: user?.id || '' }));
		return payload as unknown as TodoRequiredFields;
	}

	async function onDeleteTodo(todoId: TodoRequiredFields['id']) {
		const { payload } = await dispatch(deleteTodo(todoId));
		return payload as unknown as TodoRequiredFields;
	}

	async function onUpdateTodo(todo: TodoRequiredFields, content: string) {
		const response = await dispatch(updateTodo({ ...todo, content } as Todo));
		if (isRejected(response.type)) {
			throw new Error(response.payload as string);
		}
		return response.payload as Todo;
	}

	useEffect(() => {
		async function getColumns() {
			await dispatch(getColumnsFromUserId(user?.id || ''));
			setLoading(false);
		}
		getColumns();
	}, []);

	return (
		<>
			{isLoading ? (
				<h2 className='text-4xl font-medium text-center'>Loading...</h2>
			) : (
				<KanbanBoard
					columns={columns}
					todos={todos}
					onCreateColumn={onCreateColumn}
					onDeleteColumn={onDeleteColumn}
					onUpdateColumn={onUpdateColumn}
					onCreateTodo={onCreateTodo}
					onDeleteTodo={onDeleteTodo}
					onUpdateTodo={onUpdateTodo}
				/>
			)}
		</>
	);
}
