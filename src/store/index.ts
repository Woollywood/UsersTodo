import { configureStore } from '@reduxjs/toolkit';

import { reducer as userReducer } from '@/entities/user/store';

export const store = configureStore({
	reducer: {
		user: userReducer,
	},
	devTools: true,
});

export type Store = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
