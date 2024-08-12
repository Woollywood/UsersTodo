import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';

export function useAvatar(path: string) {
	const [avatarUrl, setAvatarUrl] = useState('');

	async function downloadImage(path: string) {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			setAvatarUrl(url);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		downloadImage(path);
	}, [path]);

	return { avatarUrl, setAvatarUrl };
}
