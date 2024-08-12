import { ChangeEvent, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import AvatarWrapper from '@/components/ui/Avatar';
import Skeleton from '@mui/material/Skeleton';

interface Props {
	className?: string;
	url: string;
	onChange: (avatarUrl: string) => void;
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export default function Avatar({ className, url, onChange }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const [uploading, setUploading] = useState(false);

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
		<>
			{url.length === 0 ? (
				<div className={[className, 'inline-flex flex-col items-center'].join(' ')}>
					<Skeleton variant='circular' width={40} height={40} />
				</div>
			) : (
				<div className={[className, 'inline-flex flex-col items-center'].join(' ')}>
					<div className='flex h-32 aspect-square mb-4'>
						<AvatarWrapper src={url} className='!w-full !h-full' />
					</div>
					<Button
						component='label'
						variant='contained'
						tabIndex={-1}
						startIcon={<CloudUploadIcon />}
						disabled={uploading}>
						{uploading ? 'Uploading' : 'Upload file'}
						<VisuallyHiddenInput type='file' onChange={uploadAvatar} />
					</Button>
				</div>
			)}
		</>
	);
}
