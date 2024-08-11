import { Outlet } from 'react-router-dom';
import { Header } from '@/widgets/header';

export default function Default() {
	return (
		<div className='grid grid-rows-[auto_1fr] min-h-screen'>
			<Header />
			<main className='py-6'>
				<div className='container h-full'>
					<Outlet />
				</div>
			</main>
		</div>
	);
}
