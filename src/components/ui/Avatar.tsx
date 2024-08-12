import Avatar, { type AvatarOwnProps } from '@mui/material/Avatar';
import { useAvatar } from './hooks';

interface Props extends AvatarOwnProps {
	className?: string;
}

export default function AvatarWrapper({ src, ...other }: Props) {
	const { avatarUrl } = useAvatar(src!);

	return <Avatar src={avatarUrl} {...other} />;
}
