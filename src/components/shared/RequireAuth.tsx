import { type ReactNode } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type Store } from '@/store';

interface Props {
	children: ReactNode;
}

export default function RequireAuth({ children }: Props) {
	const location = useLocation();
	const { session } = useSelector((state: Store) => state.user);

	if (!session) {
		return <Navigate to='/login' replace state={{ from: location }} />;
	}

	return <>{children}</>;
}
