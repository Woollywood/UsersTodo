import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodosFromUserId } from './store';
import { type Store, type StoreDispatch } from '@/store';

export function useTodosWithUserId(userId: string) {
	const { todos } = useSelector((state: Store) => state.todo);
	const dispatch = useDispatch<StoreDispatch>();

	function refetch() {
		dispatch(getTodosFromUserId(userId));
	}

	useEffect(() => {
		dispatch(getTodosFromUserId(userId));
	}, [dispatch, userId]);

	return { todos, refetch };
}
