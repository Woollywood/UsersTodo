import { type Database } from '@/services/supabase';
import { type User } from '@supabase/supabase-js';
import TodoActions from './TodoActions';

type Todo = Database['public']['Tables']['todos']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
interface Props extends Todo {
	user?: User;
	profile?: Profile;
	onDelete?: (id: number) => void;
}

export default function Todo({ id, title, body, user, onDelete }: Props) {
	function handleDelete() {
		onDelete!(id);
	}

	return (
		<div className='relative p-4 bg-slate-50 ring-blue-500 rounded-lg shadow-xl'>
			<h1 className='text-lg text-black font-medium mb-4'>{title}</h1>
			<div className='pl-4'>
				<p className='text-base'>{body}</p>
			</div>
			{user && (
				<div className='absolute top-2 right-2'>
					<TodoActions onDelete={handleDelete} />
				</div>
			)}
		</div>
	);
}
