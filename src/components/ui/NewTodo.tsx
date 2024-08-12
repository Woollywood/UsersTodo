import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { type Database } from '@/services/supabase';

type TodoStatus = Database['public']['Enums']['TODO_STATUS'];
export type FormData = {
	title: string;
	body: string;
};

interface Props {
	status: TodoStatus;
	onSubmit: (data: SubmitType) => void;
	onCancel: (status: TodoStatus) => void;
}

export type SubmitType = {
	data: FormData;
	status: TodoStatus;
};

export default function NewTodo({ status, onSubmit, onCancel }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmitForm = handleSubmit((data) => {
		onSubmit({ data, status });
	});

	return (
		<form className='p-4 bg-slate-50 ring-blue-500 rounded-lg shadow-2xl' onSubmit={onSubmitForm}>
			<div className='pb-8 space-y-4'>
				<TextField
					label='Title'
					variant='standard'
					size='small'
					className='w-full'
					error={!!errors.title}
					{...register('title', { required: true })}
				/>
				<TextField
					label='Body'
					variant='standard'
					size='small'
					className='w-full'
					error={!!errors.body}
					{...register('body', { required: true })}
				/>
			</div>
			<div className='flex items-center justify-center gap-4'>
				<Button variant='contained' size='small' type='submit'>
					Create
				</Button>
				<Button variant='contained' size='small' onClick={() => onCancel(status)}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
