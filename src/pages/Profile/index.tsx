import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/services/supabaseClient';
import { type Store } from '@/store';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import Skeleton from '@mui/material/Skeleton';
import Avatar from './Avatar';

type FormData = {
	email: string;
	username: string;
	website: string;
};

export function Component() {
	const { enqueueSnackbar } = useSnackbar();
	const [isFormLoading, setFormLoading] = useState(true);
	const [isLoading, setLoading] = useState(true);
	const { user } = useSelector((state: Store) => state.user);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const { register, setValue, handleSubmit } = useForm<FormData>();

	useEffect(() => {
		async function getProfile() {
			setLoading(true);
			const { data, error } = await supabase
				.from('profiles')
				.select('username, website, avatar_url')
				.eq('id', user?.id || '')
				.single();
			setLoading(false);

			if (error) {
				enqueueSnackbar(error.message, { variant: 'error' });
				return;
			}

			setValue('email', user?.email || '');
			setValue('username', data?.username || '');
			setValue('website', data?.website || '');
			setAvatarUrl(data.avatar_url!);
		}
		getProfile().then(() => setFormLoading(false));
	}, []);

	const onSubmit = handleSubmit(async ({ username, website }) => {
		setLoading(true);
		const { error } = await supabase.from('profiles').upsert({
			id: user?.id || '',
			username,
			website,
			updated_at: new Date().toLocaleDateString(),
			avatar_url: avatarUrl,
		});
		setLoading(false);

		if (error) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	});

	return (
		<>
			{isFormLoading ? (
				<div className='space-y-4'>
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
					<Skeleton variant='text' sx={{ fontSize: '1rem' }} />
				</div>
			) : (
				<div>
					<Avatar className='mb-8' url={avatarUrl!} onChange={(avatarUrl) => setAvatarUrl(avatarUrl)} />
					<form onSubmit={onSubmit} className='flex flex-col gap-4'>
						<TextField label='Email' variant='standard' disabled {...register('email')} />
						<TextField label='Username' variant='standard' {...register('username')} />
						<TextField label='Website' variant='standard' {...register('website')} />
						<Button variant='contained' disabled={isLoading} type='submit'>
							Update
						</Button>
					</form>
				</div>
			)}
		</>
	);
}
