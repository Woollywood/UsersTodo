import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { signin } from '@/entities/user/store';
import { type StoreDispatch } from '@/store';
import { useSnackbar } from 'notistack';

type FormData = {
	email: string;
	password: string;
};

export function Component() {
	const { enqueueSnackbar } = useSnackbar();
	const location = useLocation();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();
	const [loading, setLoading] = useState(false);
	const dispatch: StoreDispatch = useDispatch();

	const handleLogin = handleSubmit(async ({ email, password }) => {
		setLoading(true);
		dispatch(signin({ email, password }))
			.unwrap()
			.then(() => {
				const redirectUrl = location.state?.from || '/';
				navigate(redirectUrl, { replace: true });
			})
			.catch((err) => enqueueSnackbar(err, { variant: 'error' }))
			.finally(() => {
				setLoading(false);
			});
	});

	return (
		<div className='flex flex-col items-center justify-center gap-4 h-full'>
			<div className='space-y-6'>
				<p className='text-4xl font-medium text-center mb-12'>Login</p>
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
							error={!!errors.password}
							className='w-full'
							type='password'
							placeholder='Password'
							{...register('password', {
								required: true,
							})}
							size='small'
						/>
					</div>
					<div>
						<Button variant='contained' className={'button block'} disabled={loading} type='submit'>
							{loading ? <span>Loading</span> : <span>Login</span>}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
