import { useState, KeyboardEvent, useMemo } from 'react';
import { Column, Todo as TodoType } from './KanbanBoard';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextField from '@mui/material/TextField';
import Todo from './Todo';

interface Props {
	column: Column;
	todos: TodoType[];
	onDeleteColumn: (column: Column) => void;
	onCreateColumn: (column: Column) => void;
	onUpdateColumn: (column: Column, title: string) => void;
	onDeleteTodo: (id: TodoType['id']) => void;
	onUpdateTodo: (id: TodoType['id'], value: string) => void;
}

export default function ColumnContainer({
	column,
	todos,
	onDeleteColumn,
	onCreateColumn,
	onUpdateColumn,
	onDeleteTodo,
	onUpdateTodo,
}: Props) {
	const [editMode, setEditMode] = useState(false);
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		},
		disabled: editMode,
	});
	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};
	const todosIds = useMemo(() => todos.map((todo) => todo.id), [todos]);

	if (isDragging) {
		return (
			<div
				className='grid grid-rows-[auto_1fr_auto] bg-slate-300 shadow-lg rounded-lg w-80 p-2'
				ref={setNodeRef}
				{...style}></div>
		);
	}

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.key !== 'Enter') {
			return;
		}

		setEditMode(false);
	}

	return (
		<div
			className='grid grid-rows-[auto_1fr] gap-2 bg-slate-50 shadow-lg rounded-lg w-80 p-2'
			ref={setNodeRef}
			style={style}>
			<div
				className='flex items-center gap-2 text-lg px-3 py-2 h-[60px] cursor-grab rounded-md rounded-b-none bg-slate-200'
				{...attributes}
				{...listeners}>
				<div
					className={[
						'w-full px-1 py-0.5 cursor-pointer transition-colors rounded-lg flex items-center gap-2 flex-grow',
						!editMode && 'hover:bg-slate-300',
					].join(' ')}
					onClick={() => setEditMode(true)}>
					<Chip label='1' size='small' />
					{editMode ? (
						<div>
							<TextField
								variant='outlined'
								size='small'
								autoFocus
								defaultValue={column.title}
								onChange={(e) => onUpdateColumn(column, e.target.value)}
								onBlur={() => setEditMode(false)}
								onKeyDown={onKeyDown}
							/>
						</div>
					) : (
						<h2>{column.title}</h2>
					)}
				</div>
				<div className='flex items-center'>
					<IconButton aria-label='create' onClick={() => onCreateColumn(column)}>
						<AddCircleOutlineIcon />
					</IconButton>
					<IconButton aria-label='delete' onClick={() => onDeleteColumn(column)}>
						<DeleteIcon />
					</IconButton>
				</div>
			</div>
			<div className='space-y-2'>
				<SortableContext items={todosIds}>
					{todos.map((todo) => (
						<Todo
							key={todo.id}
							todo={todo}
							onDelete={() => onDeleteTodo(todo.id)}
							onUpdate={onUpdateTodo}
						/>
					))}
				</SortableContext>
			</div>
		</div>
	);
}
