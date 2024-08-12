import { useState } from 'react';
import { type User } from '@supabase/supabase-js';
import { type Database } from '@/services/supabase';
import Todo from './Todo';
import Avatar from './Avatar';
import TodoActions from './TodoActions';
import NewTodo from './NewTodo';
import { type SubmitType } from './NewTodo';
import { useSnackbar } from 'notistack';

type Todo = Database['public']['Tables']['todos']['Row'];
interface Props {
	todos: Todo[];
	profile?: Database['public']['Tables']['profiles']['Row'];
	user?: User;
	onCreate?: (data: SubmitType) => Promise<unknown>;
}

type TodoStatus = Database['public']['Enums']['TODO_STATUS'];
type ColumnState = {
	status: TodoStatus;
	items: Todo[];
	creating: boolean;
};

export default function TodoList({ todos, profile, user, onCreate }: Props) {
	const [creatingState, setCreatingState] = useState<TodoStatus[] | null>(null);

	const columns: ColumnState[] = [
		{
			status: 'TODO',
			items: todos.filter((todo) => todo.status === 'TODO'),
			creating: false,
		},
		{
			status: 'IN_PROGRESS',
			items: todos.filter((todo) => todo.status === 'IN_PROGRESS'),
			creating: false,
		},
		{
			status: 'COMPLETED',
			items: todos.filter((todo) => todo.status === 'COMPLETED'),
			creating: false,
		},
	];

	function onCreating(status: TodoStatus) {
		const creatingItem = creatingState?.find((stateStatusItem) => stateStatusItem === status);
		if (creatingItem) {
			setCreatingState(creatingState?.filter((item) => item !== creatingItem) || []);
		} else {
			if (creatingState !== null) {
				setCreatingState([...creatingState, status]);
			} else {
				setCreatingState([status]);
			}
		}
	}

	function onSubmit({ data, status }: SubmitType) {
		onCreate!({ data, status }).then(() => onCancel(status));
	}

	function onCancel(status: TodoStatus) {
		setCreatingState(creatingState?.filter((item) => item !== status) || []);
	}

	return (
		<div className='grid grid-cols-3 gap-12'>
			{profile && (
				<div className='mb-4'>
					<Avatar src={profile.avatar_url || ''} />
				</div>
			)}
			{columns.map((column) => (
				<div key={column.status}>
					<div className='py-6 grid grid-cols-[1fr_auto] items-center gap-4'>
						<h2>{column.status}</h2>
						{user && <TodoActions onCreate={() => onCreating(column.status)} />}
					</div>
					<div className='flex flex-col gap-2'>
						{column.items.map((todo) => (
							<Todo key={todo.id} {...todo} />
						))}
						{creatingState?.find((status) => column.status === status) && (
							<NewTodo
								status={column.status}
								onSubmit={onSubmit}
								onCancel={(status) => onCancel(status)}
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
