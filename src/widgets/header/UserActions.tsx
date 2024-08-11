import React, { useState } from 'react';
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

const settings = [{ label: 'Profile', path: '/profile' }];

export default function UserActions() {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { user, status } = useSelector((state: Store) => state.user);
	const dispatch: StoreDispatch = useDispatch();

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
								<Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
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
					<Link to='/login' className='block'>
						<Button variant='contained'>Login</Button>
					</Link>
				))}
		</>
	);
}
