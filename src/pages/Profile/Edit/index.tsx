import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type Store, type StoreDispatch } from '@/store';
import { supabase } from '@/services/supabaseClient';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import Avatar from './Avatar';
import { useSnackbar } from 'notistack';
import RequireAuth from '@/components/shared/RequireAuth';
import Skeleton from '@mui/material/Skeleton';
import { setProfile } from '@/entities/user/store';

type FormData = {
	email: string;
	username: string;
	fullName: string;
	website: string;
};

export function Component() {
	const { enqueueSnackbar } = useSnackbar();
	const dispatch = useDispatch<StoreDispatch>();
	const { user, isComplete, profile } = useSelector((state: Store) => state.user);
	const [isUpdating, setUpdating] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState('');
	const { register, setValue, handleSubmit } = useForm<FormData>();

	useEffect(() => {
		if (isComplete) {
			setAvatarUrl(profile?.avatar_url || '');
		}
	}, [isComplete, profile]);

	useEffect(() => {
		setValue('email', user?.email || '');
		setValue('username', profile?.username || '');
		setValue('fullName', profile?.full_name || '');
		setValue('website', profile?.website || '');
	}, [profile, user, setValue]);

	const onSubmit = handleSubmit(async ({ username, fullName, website }) => {
		setUpdating(true);
		try {
			const updatedAt = new Date().toLocaleDateString();
			const { data, error } = await supabase
				.from('profiles')
				.upsert({
					id: profile?.id || '',
					username,
					full_name: fullName,
					website,
					updated_at: updatedAt,
					avatar_url: avatarUrl,
				})
				.select()
				.single();

			if (error) {
				throw error;
			}

			dispatch(setProfile(data));
		} catch (error) {
			const errorMessage = (error as Error).message;
			enqueueSnackbar(errorMessage, { variant: 'error' });
		} finally {
			setUpdating(false);
		}
	});

	return (
		<RequireAuth>
			{!isComplete ? (
				<div className='space-y-4'>
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
				</div>
			) : (
				<>
					<Avatar
						className='mb-8'
						url={avatarUrl!}
						onChange={(avatarUrl) => {
							setAvatarUrl(avatarUrl);
						}}
					/>
					<form onSubmit={onSubmit} className='flex flex-col gap-4'>
						<TextField label='Email' variant='standard' disabled {...register('email')} />
						<TextField label='Username' variant='standard' {...register('username')} />
						<TextField label='Full Name' variant='standard' {...register('fullName')} />
						<TextField label='Website' variant='standard' {...register('website')} />
						<Button variant='contained' disabled={isUpdating} type='submit'>
							Update
						</Button>
					</form>
				</>
			)}
		</RequireAuth>
	);
}
