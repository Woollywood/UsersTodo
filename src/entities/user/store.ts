import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';

export type Status = 'idle' | 'rejected' | 'completed';

export interface InitialState {
	user: User | null;
	session: Session | null;
	status: Status;
	error: string | null;
}

const initialState: InitialState = {
	user: null,
	session: null,
	status: 'idle',
	error: null,
};

export const signin = createAsyncThunk(
	'@@user/signin',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			return rejectWithValue(error.message);
		} else {
			return data;
		}
	}
);

export const signup = createAsyncThunk(
	'@@user/signup',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			return rejectWithValue(error.message);
		} else {
			return data;
		}
	}
);

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
			.addCase(signin.rejected, (state, { payload }) => {
				state.status = 'rejected';
				state.error = payload as string;
			})
			.addCase(signin.fulfilled, (state, { payload }) => {
				state.status = 'completed';
				state.session = payload?.session || null;
				state.user = payload?.user || null;
			})
			.addCase(signup.rejected, (state, { payload }) => {
				state.status = 'rejected';
				state.error = payload as string;
			})
			.addCase(signup.fulfilled, (state, { payload }) => {
				state.status = 'completed';
				state.session = payload?.session || null;
				state.user = payload?.user || null;
			})
			.addCase(signout.fulfilled, () => ({
				...initialState,
				status: 'completed',
			}));
	},
});

export const { setUser, setSession, setAll, reset, setStatus } = slice.actions;
export const reducer = slice.reducer;
