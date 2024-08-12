import { type Database } from '@/services/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];
interface Props extends Todo {}

export default function Todo({ title, body }: Props) {
	return (
		<div className='p-4 bg-slate-50 ring-blue-500 rounded-lg shadow-2xl'>
			<h1 className='text-lg text-black font-medium mb-4'>{title}</h1>
			<div className='pl-4'>
				<p className='text-base'>{body}</p>
			</div>
		</div>
	);
}
