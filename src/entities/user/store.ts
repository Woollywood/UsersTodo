import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';

export type Status = 'idle' | 'rejected' | 'completed';

export interface InitialState {
	user: User | null;
	session: Session | null;
	status: Status;
}

const initialState: InitialState = {
	user: null,
	session: null,
	status: 'idle',
};

export const signin = createAsyncThunk('@@user/signin', async ({ email }: { email: string }) => {
	const { data } = await supabase.auth.signInWithOtp({ email });
	return data;
});

export const signout = createAsyncThunk('@@user/signout', async () => {
	await supabase.auth.signOut();
});

export const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, { payload }: PayloadAction<User>) => {
			state.user = payload;
			state.status = 'completed';
		},
		setSession: (state, { payload }: PayloadAction<Session>) => {
			state.session = payload;
			state.status = 'completed';
		},
		setAll: (state, { payload }: PayloadAction<{ user: User; session: Session }>) => {
			state.user = payload.user;
			state.session = payload.session;
			state.status = 'completed';
		},
		setStatus: (state, { payload }: PayloadAction<Status>) => {
			state.status = payload;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		reset: (_) => ({ ...initialState, status: 'completed' }),
	},
	extraReducers: (builder) => {
		builder
			.addCase(signin.rejected, (state, { error }) => {
				console.log(error);
				state.status = 'rejected';
			})
			.addCase(signin.fulfilled, (state, { payload }) => {
				state.status = 'completed';
				state.session = payload.session;
				state.user = payload.user;
			})
			.addCase(signout.fulfilled, () => ({
				...initialState,
			}));
	},
});

export const { setUser, setSession, setAll, reset, setStatus } = slice.actions;
export const reducer = slice.reducer;
