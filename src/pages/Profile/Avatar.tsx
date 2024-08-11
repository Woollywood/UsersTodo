import { ChangeEvent, useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

interface Props {
	className?: string;
	url: string;
	onChange: (avatarUrl: string) => void;
}

export default function Avatar({ className, url, onChange }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (url) {
			downloadImage(url);
		}
	}, [url]);

	async function downloadImage(path: string) {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			setAvatarUrl(url);
		} catch (error) {
			const message = (error as Error).message;
			enqueueSnackbar(message, { variant: 'error' });
		}
	}

	async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
		try {
			setUploading(true);

			if (event.target.files?.length === 0) {
				throw new Error('You must select an image to upload');
			}

			const file = event.target.files![0];
			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random()}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

			if (uploadError) {
				throw uploadError;
			}

			onChange(filePath);
		} catch (error) {
			const message = (error as Error).message;
			enqueueSnackbar(message, { variant: 'error' });
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className={className}>
			<div className='flex h-32 aspect-square mb-4'>
				{avatarUrl ? (
					<img src={avatarUrl} alt='avatar' className='rounded-lg overflow-hidden' />
				) : (
					<div className='relative w-full h-full flex items-center justify-center'>
						<Skeleton variant='rounded' className='absolute left-0 top-0 !w-full !h-full' />
					</div>
				)}
			</div>
			<div>
				<label className='relative inline-block'>
					<Button className='relative z-0' variant='contained'>
						<span>{uploading ? 'Uploading' : 'Upload'}</span>
						<input
							className='opacity-0 absolute w-full h-full top-0 left-0 z-10'
							type='file'
							accept='image/*'
							onChange={uploadAvatar}
							disabled={uploading}
						/>
					</Button>
				</label>
			</div>
		</div>
	);
}
