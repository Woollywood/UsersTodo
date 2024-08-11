import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { signin } from '@/entities/user/store';
import { type StoreDispatch } from '@/store';

type FormData = {
	email: string;
};

export function Component() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const [loading, setLoading] = useState(false);
	const dispatch: StoreDispatch = useDispatch();

	const handleLogin = handleSubmit(async ({ email }) => {
		setLoading(true);
		await dispatch(signin({ email }));
		setLoading(false);
	});

	return (
		<div className='flex flex-col items-center justify-center gap-4 h-full'>
			<div className='space-y-6'>
				<p className='text-4xl font-medium text-center mb-6'>Sign in via magic link with your email below</p>
				<form className='flex flex-col items-center gap-4' onSubmit={handleLogin}>
					<div className='w-full'>
						<TextField
							error={!!errors.email}
							className='w-full'
							type='text'
							placeholder='Your email'
							{...register('email', {
								required: true,
								pattern:
									/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							})}
							size='small'
						/>
					</div>
					<div>
						<Button variant='contained' className={'button block'} disabled={loading} type='submit'>
							{loading ? <span>Loading</span> : <span>Send magic link</span>}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
