import { useState, KeyboardEvent } from 'react';
import { Todo as TodoType } from './KanbanBoard';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
	todo: TodoType;
	onDelete: (id: TodoType['id']) => void;
	onUpdate: (id: TodoType['id'], value: string) => void;
}

export default function Todo({ todo, onDelete, onUpdate }: Props) {
	const { id, content } = todo;
	const [isMouseOver, setMouseOver] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id,
		data: {
			type: 'Todo',
			todo,
		},
		disabled: editMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	function toggleEditMode() {
		setEditMode((prev) => !prev);
		setMouseOver(false);
	}

	function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Enter' && event.shiftKey) {
			return;
		}
		if (event.key === 'Enter') {
			toggleEditMode();
		}
	}

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
				<TextField
					size='small'
					className='w-full'
					multiline
					maxRows={6}
					value={content}
					autoFocus
					onBlur={toggleEditMode}
					onKeyDown={onKeyDown}
					onChange={(e) => onUpdate(id, e.target.value)}
				/>
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
