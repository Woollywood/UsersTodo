import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodosFromUserId } from './store';
import { type Store, type StoreDispatch } from '@/store';

export function useTodosWithUserId(userId: string) {
	const [isLoading, setLoading] = useState(true);
	const { todos } = useSelector((state: Store) => state.todo);
	const dispatch = useDispatch<StoreDispatch>();

	async function refetch() {
		await dispatch(getTodosFromUserId(userId));
	}

	useEffect(() => {
		dispatch(getTodosFromUserId(userId))
			.unwrap()
			.finally(() => setLoading(false));
	}, [dispatch, userId]);

	return { todos, refetch, isLoading };
}
