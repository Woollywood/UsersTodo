import { ColumnRequiredFields, TodoRequiredFields as TodoType } from './KanbanBoard';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { SortableContext } from '@dnd-kit/sortable';
import TextField from '@mui/material/TextField';
import Todo from './Todo';
import { useColumn } from './hooks';
import { useForm } from 'react-hook-form';

type FormData = {
	title: string;
};

interface Props {
	column: ColumnRequiredFields;
	todos: TodoType[];
	onDeleteColumn: (column: ColumnRequiredFields) => void;
	onUpdateColumn: (column: ColumnRequiredFields, title: string) => void;
	onCreateTodo: (column: ColumnRequiredFields) => void;
	onDeleteTodo: (id: TodoType['id']) => void;
	onUpdateTodo: (id: TodoType['id'], value: string) => void;
}

export default function ColumnContainer({
	column,
	todos,
	onDeleteColumn,
	onUpdateColumn,
	onCreateTodo,
	onDeleteTodo,
	onUpdateTodo,
}: Props) {
	const { editMode, setEditMode, setNodeRef, attributes, listeners, isDragging, style, todosIds, onSubmit } =
		useColumn(column, todos);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmitHandler = handleSubmit((data) => {
		onSubmit();
		onUpdateColumn(column, data.title);
	});

	if (isDragging) {
		return (
			<div
				className='grid grid-rows-[auto_1fr_auto] bg-slate-300 shadow-lg rounded-lg w-80 p-2'
				ref={setNodeRef}
				{...style}></div>
		);
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
						<form onSubmit={onSubmitHandler}>
							<TextField
								error={!!errors.title}
								variant='outlined'
								size='small'
								autoFocus
								defaultValue={column.title}
								{...register('title', { required: true })}
								onBlur={() => setEditMode(false)}
							/>
						</form>
					) : (
						<h2>{column.title}</h2>
					)}
				</div>
				<div className='flex items-center'>
					<IconButton aria-label='create' onClick={() => onCreateTodo(column)}>
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
