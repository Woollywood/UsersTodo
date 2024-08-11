import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { signup } from '@/entities/user/store';
import { type StoreDispatch } from '@/store';
import { useSnackbar } from 'notistack';

type FormData = {
	email: string;
	password: string;
	confirmPassword: string;
};

export function Component() {
	const { enqueueSnackbar } = useSnackbar();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormData>();
	const [loading, setLoading] = useState(false);
	const dispatch: StoreDispatch = useDispatch();

	const handleLogin = handleSubmit(async ({ email, password, confirmPassword }) => {
		if (password !== confirmPassword) {
			setError('confirmPassword', { message: 'Passwords do not match' });
			return;
		}

		setLoading(true);
		dispatch(signup({ email, password }))
			.unwrap()
			.catch((err) => {
				enqueueSnackbar(err, { variant: 'error' });
			})
			.finally(() => {
				setLoading(false);
			});
	});

	return (
		<div className='flex flex-col items-center justify-center gap-4 h-full'>
			<div className='space-y-6'>
				<p className='text-4xl font-medium text-center mb-12'>Register</p>
				<form className='flex flex-col items-center gap-8' onSubmit={handleLogin}>
					<div className='w-full space-y-4'>
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
						<TextField
							error={!!errors.password || !!errors.confirmPassword}
							className='w-full'
							type='password'
							placeholder='Password'
							{...register('password', {
								required: true,
							})}
							size='small'
						/>
						<TextField
							error={!!errors.confirmPassword}
							className='w-full'
							type='password'
							placeholder='Confirm password'
							{...register('confirmPassword', {
								required: true,
							})}
							size='small'
						/>
						{errors.confirmPassword && (
							<span className='text-red-700 font-medium text-sm'>{errors.confirmPassword.message}</span>
						)}
					</div>
					<div>
						<Button variant='contained' className={'button block'} disabled={loading} type='submit'>
							{loading ? <span>Loading</span> : <span>Register</span>}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
