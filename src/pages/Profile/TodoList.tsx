import { useSelector } from 'react-redux';
import TodoList from '@/components/ui/TodoList';
import { useTodosWithUserId } from '@/entities/todo/hooks';
import { type Store } from '@/store';
import { type SubmitType } from '@/components/ui/NewTodo';
import { supabase } from '@/services/supabaseClient';
import { useSnackbar } from 'notistack';

export default function TodoListWrapper() {
	const { enqueueSnackbar } = useSnackbar();
	const { user, profile } = useSelector((state: Store) => state.user);
	const { todos, refetch } = useTodosWithUserId(profile?.id || '');

	async function onCreate({ data: { title, body }, status }: SubmitType) {
		try {
			const { data, error } = await supabase
				.from('todos')
				.insert([{ status, title, body, user_id: profile?.id || '' }])
				.select();

			if (error) {
				throw error;
			}

			refetch();
			return data;
		} catch (error) {
			const errorMessage = (error as Error).message;
			enqueueSnackbar(errorMessage, { variant: 'error' });
			return error;
		}
	}

	return <TodoList todos={todos} user={user!} onCreate={onCreate} />;
}
