import { supabase } from '@/services/supabaseClient';
import { type Store } from '@/store';

export async function getProfile(user: Store['user']['user']) {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user?.id || '')
		.single();

	return { data, error };
}
