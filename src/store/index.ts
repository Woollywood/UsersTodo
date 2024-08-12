import { configureStore } from '@reduxjs/toolkit';

import { reducer as userReducer } from '@/entities/user/store';
import { reducer as todoReducer } from '@/entities/todo/store';

export const store = configureStore({
	reducer: {
		user: userReducer,
		todo: todoReducer,
	},
	devTools: true,
});

export type Store = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
