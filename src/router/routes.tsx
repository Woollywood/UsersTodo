import { type RouteObject } from 'react-router-dom';
import Layout from '@/layouts/Default';

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				lazy: () => import('@/pages/Home'),
			},
			{
				path: '/login',
				lazy: () => import('@/pages/Login'),
			},
			{
				path: '/profile',
				lazy: () => import('@/pages/Profile'),
			},
		],
	},
];
