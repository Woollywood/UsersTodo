import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router';
import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { reset, getProfile, setSession } from '@/entities/user/store';
import { type StoreDispatch } from '@/store';

function App() {
	const dispatch = useDispatch<StoreDispatch>();

	useEffect(() => {
		supabase.auth.onAuthStateChange((_event, session) => {
			if (session) {
				dispatch(setSession({ user: session.user, session }));
				dispatch(getProfile({ user: session.user, session }));
			} else {
				dispatch(reset());
			}
		});
	}, [dispatch]);

	return <RouterProvider router={router} />;
}

export default App;
