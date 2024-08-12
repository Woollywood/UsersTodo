import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RequireAuth from '@/components/shared/RequireAuth';
import Avatar from '@/components/ui/Avatar';
import Button from '@mui/material/Button';
import TodoList from './TodoList';
import { type Store } from '@/store';

export function Component() {
	const { isComplete, profile } = useSelector((state: Store) => state.user);

	return (
		<RequireAuth>
			{!isComplete ? (
				<div className='space-y-4'>
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
				</div>
			) : (
				<div className='space-y-8'>
					<div className='flex gap-2'>
						<Avatar alt='Avatar' src={profile?.avatar_url || ''} className='!w-32 !h-32' />
						<div>
							<h2 className='text-4xl font-medium mb-4'>{profile?.full_name}</h2>
							<h3 className='text-2xl'>{profile?.username}</h3>
						</div>
						<Link to='/profile/edit' className='ml-4 flex items-center'>
							<Button variant='contained'>Edit</Button>
						</Link>
					</div>
					<TodoList />
				</div>
			)}
		</RequireAuth>
	);
}
