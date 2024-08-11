import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router';
import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { setAll, reset } from '@/entities/user/store';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				dispatch(setAll({ user: session.user, session }));
			} else {
				dispatch(reset());
			}
		});
	}, [dispatch]);

	return <RouterProvider router={router} />;
}

export default App;
