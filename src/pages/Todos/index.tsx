import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { type Database } from '@/services/supabase';
import { useSnackbar } from 'notistack';
import Skeleton from '@mui/material/Skeleton';

export function Component() {
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setLoading] = useState(true);
	const [todos, seTtodos] = useState<Database['public']['Tables']['todos']['Row'][]>([]);

	useEffect(() => {
		async function getTodos() {
			const { data, error } = await supabase.from('todos').select('*');
			if (error) {
				throw error;
			}
			seTtodos(data);
		}
		getTodos()
			.catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<>
			{isLoading ? (
				<div className='space-y-4'>
					<Skeleton variant='rounded' className='w-full !h-24' />
					<Skeleton variant='rounded' className='w-full !h-24' />
					<Skeleton variant='rounded' className='w-full !h-24' />
					<Skeleton variant='rounded' className='w-full !h-24' />
					<Skeleton variant='rounded' className='w-full !h-24' />
					<Skeleton variant='rounded' className='w-full !h-24' />
				</div>
			) : (
				<div className='space-y-4'>
					{todos.map((todo) => (
						<div key={todo.id}>
							<h2>{todo.title}</h2>
							<p>{todo.body}</p>
						</div>
					))}
				</div>
			)}
		</>
	);
}
