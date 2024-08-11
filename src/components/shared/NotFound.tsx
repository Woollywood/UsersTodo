import { useRouteError, Link } from 'react-router-dom';
import Button from '@mui/material/Button';

interface ErrorType {
	data: string;
	error: {
		message: string;
		stack: string;
	};
	internal: boolean;
	status: string;
	statusText: string;
}

export default function ErrorElement() {
	const error = useRouteError() as ErrorType;

	return (
		<div className='flex flex-col items-center justify-center gap-4 h-screen'>
			<h1 className='text-4xl font-medium mb-12'>Oops! Something went wrong</h1>
			<h2 className='text-xl font-medium'>Status {error.status}</h2>
			<h3 className='text-base'>{error.statusText}</h3>
			<Link to='/'>
				<Button variant='contained'>Back to home</Button>
			</Link>
		</div>
	);
}
