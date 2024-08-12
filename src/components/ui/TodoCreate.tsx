import IconButton from '@mui/material/IconButton';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

interface Props {
	onCreate: () => void;
}

export default function TodoCreate({ onCreate }: Props) {
	return (
		<div className='flex items-center justify-center'>
			<IconButton aria-label='create' onClick={() => onCreate()}>
				<ControlPointIcon />
			</IconButton>
		</div>
	);
}
