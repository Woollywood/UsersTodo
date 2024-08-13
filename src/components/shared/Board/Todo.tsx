import { Todo as TodoType } from './KanbanBoard';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props extends TodoType {
	onDelete: (id: TodoType['id']) => void;
}

export default function Todo({ id, content, onDelete }: Props) {
	return (
		<div className='group relative bg-slate-100 shadow-md px-3 py-4 rounded-lg max-h-80 min-h-16'>
			<h2>{content}</h2>
			<div className='opacity-0 transition-opacity group-hover:opacity-100 absolute right-3 top-2'>
				<IconButton aria-label='delete' onClick={() => onDelete(id)}>
					<DeleteIcon />
				</IconButton>
			</div>
		</div>
	);
}
