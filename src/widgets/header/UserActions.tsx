import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { type Store, type StoreDispatch } from '@/store';
import { signout } from '@/entities/user/store';
import { supabase } from '@/services/supabaseClient';
import { useSnackbar } from 'notistack';

const settings = [{ label: 'Profile', path: '/profile' }];

function Unauthorized() {
	return (
		<div className='flex items-center gap-4'>
			<Link to='/login'>
				<Button variant='contained'>Login</Button>
			</Link>
			<Link to='/register'>
				<Button variant='contained'>Register</Button>
			</Link>
		</div>
	);
}

export default function UserActions() {
	const { enqueueSnackbar } = useSnackbar();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { user, status } = useSelector((state: Store) => state.user);
	const [avatarUrl, setAvatarUrl] = useState('');
	const dispatch: StoreDispatch = useDispatch();

	useEffect(() => {
		async function getAvatarUrl() {
			const { data, error } = await supabase
				.from('profiles')
				.select('avatar_url')
				.eq('id', user?.id || '')
				.single();

			if (error) {
				enqueueSnackbar(error.message, { variant: 'error' });
				return;
			}

			return data.avatar_url;
		}
		async function downloadImage() {
			const avatarUrl = await getAvatarUrl();
			try {
				const { data, error } = await supabase.storage.from('avatars').download(avatarUrl!);
				if (error) {
					throw error;
				}
				const url = URL.createObjectURL(data);
				setAvatarUrl(url);
			} catch (error) {
				const message = (error as Error).message;
				enqueueSnackbar(message, { variant: 'error' });
			}
		}
		if (user) {
			downloadImage();
		}
	}, [user, enqueueSnackbar]);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleSignout = async () => {
		dispatch(signout());
		handleCloseUserMenu();
	};

	return (
		<>
			{status === 'idle' && <Skeleton variant='circular' width={40} height={40} />}
			{status === 'completed' &&
				(user ? (
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title='Open settings'>
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt='avatar' src={avatarUrl} />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id='menu-appbar'
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}>
							{settings.map((setting) => (
								<MenuItem key={setting.path} onClick={handleCloseUserMenu}>
									<Link to={setting.path}>
										<Typography textAlign='center'>{setting.label}</Typography>
									</Link>
								</MenuItem>
							))}
							<MenuItem onClick={handleSignout}>Logout</MenuItem>
						</Menu>
					</Box>
				) : (
					<Unauthorized />
				))}
			{status === 'rejected' && <Unauthorized />}
		</>
	);
}
