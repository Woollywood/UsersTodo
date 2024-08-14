import { TodoRequiredFields, TodoRequiredFields as TodoType } from './KanbanBoard';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { useTodo } from './hooks';
import { useForm } from 'react-hook-form';

type FormData = {
	content: string;
};

interface Props {
	todo: TodoType;
	onDelete: (id: TodoType['id']) => void;
	onUpdate: (todo: TodoRequiredFields, value: string) => void;
}

export default function Todo({ todo, onDelete, onUpdate }: Props) {
	const { id, content } = todo;
	const {
		editMode,
		toggleEditMode,
		isMouseOver,
		setMouseOver,
		setNodeRef,
		attributes,
		listeners,
		isDragging,
		style,
		onSubmit,
	} = useTodo(todo);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const onSubmitHandler = handleSubmit((data) => {
		onSubmit();
		onUpdate(todo, data.content);
	});

	if (isDragging) {
		return (
			<div
				className='relative bg-slate-300 shadow-md px-3 py-4 pt-10 rounded-lg max-h-80 min-h-16 cursor-grab'
				ref={setNodeRef}
				style={style}></div>
		);
	}

	if (editMode) {
		return (
			<div
				className='relative bg-slate-100 shadow-md px-3 py-4 rounded-lg max-h-80 min-h-16'
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}>
				<form onSubmit={onSubmitHandler}>
					<TextField
						size='small'
						className='w-full'
						error={!!errors.content}
						multiline
						maxRows={6}
						autoFocus
						defaultValue={content}
						{...register('content', { required: true })}
						onBlur={() => onSubmitHandler()}
					/>
				</form>
				{isMouseOver && (
					<div className='absolute right-3 top-2'>
						<IconButton aria-label='delete' onClick={() => onDelete(id)}>
							<DeleteIcon />
						</IconButton>
					</div>
				)}
			</div>
		);
	}

	return (
		<div
			className='relative bg-slate-100 shadow-md px-3 py-4 pt-10 rounded-lg max-h-80 min-h-16 cursor-grab'
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onMouseEnter={() => setMouseOver(true)}
			onMouseLeave={() => setMouseOver(false)}
			onClick={toggleEditMode}>
			<p className='my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'>{content}</p>
			{isMouseOver && (
				<div className='absolute right-3 top-1'>
					<IconButton aria-label='delete' onClick={() => onDelete(id)}>
						<DeleteIcon />
					</IconButton>
				</div>
			)}
		</div>
	);
}
