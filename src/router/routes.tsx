import { type RouteObject } from 'react-router-dom';
import Layout from '@/layouts/Default';
import NotFound from '@/components/shared/NotFound';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <Layout />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				lazy: () => import('@/pages/Home'),
			},
			{
				path: 'login',
				lazy: () => import('@/pages/Login'),
			},
			{
				path: 'register',
				lazy: () => import('@/pages/Register'),
			},
			{
				path: 'profile',
				lazy: () => import('@/pages/Profile'),
			},
			{
				path: 'profile/edit',
				lazy: () => import('@/pages/Profile/Edit'),
			},
			{
				path: 'todos',
				lazy: () => import('@/pages/Todos'),
			},
		],
	},
];
