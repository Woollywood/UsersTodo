import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '@/services/supabaseClient';
import { type Database } from '@/services/supabase';
import { getProfile as getProfileApi } from './api';

export interface InitialState {
	user: User | null;
	session: Session | null;
	profile: Database['public']['Tables']['profiles']['Row'] | null;
	isComplete: boolean;
	error: string | null;
}

const initialState: InitialState = {
	user: null,
	session: null,
	profile: null,
	isComplete: false,
	error: null,
};

interface ProfileParams {
	user: User;
	session: Session;
}
export const getProfile = createAsyncThunk('@@user/getProfile', async (params: ProfileParams, { rejectWithValue }) => {
	const { user, session } = params;
	const { data: profile, error } = await getProfileApi(user);
	if (error) {
		return rejectWithValue(error.message);
	} else {
		return { profile, user, session };
	}
});

export const signin = createAsyncThunk(
	'@@user/signin',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
		if (userError) {
			return rejectWithValue(userError.message);
		}

		const { data: profileData, error: profileError } = await getProfileApi(userData.user);
		if (profileError) {
			return rejectWithValue(profileError.message);
		}

		return { user: userData, profile: profileData };
	}
);

export const signup = createAsyncThunk(
	'@@user/signup',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		const { data: userData, error: userError } = await supabase.auth.signUp({
			email,
			password,
		});
		if (userError) {
			return rejectWithValue(userError.message);
		}

		const { data: profileData, error: profileError } = await getProfileApi(userData.user);
		if (profileError) {
			return rejectWithValue(profileError.message);
		}

		return { user: userData, profile: profileData };
	}
);

export const signout = createAsyncThunk('@@user/signout', async () => {
	await supabase.auth.signOut();
});

export const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setProfile: (state, { payload }: PayloadAction<Database['public']['Tables']['profiles']['Row']>) => {
			state.profile = payload;
		},
		setSession: (state, { payload: { user, session } }: PayloadAction<{ user: User; session: Session }>) => {
			state.user = user;
			state.session = session;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		reset: () => ({ ...initialState, status: 'completed' }),
	},
	extraReducers: (builder) => {
		builder
			.addCase(signin.rejected, (state, { payload }) => {
				state.error = payload as string;
				state.isComplete = true;
			})
			.addCase(signin.fulfilled, (state, { payload }) => {
				state.session = payload.user.session;
				state.user = payload.user.user;
				state.profile = payload.profile;
				state.isComplete = true;
			})
			.addCase(signup.rejected, (state, { payload }) => {
				state.error = payload as string;
				state.isComplete = true;
			})
			.addCase(signup.fulfilled, (state, { payload }) => {
				state.session = payload.user.session;
				state.user = payload.user.user;
				state.profile = payload.profile;
				state.isComplete = true;
			})
			.addCase(signout.fulfilled, () => ({
				...initialState,
				isComplete: true,
			}))
			.addCase(getProfile.rejected, (state, { payload }) => {
				state.error = payload as string;
				state.isComplete = true;
			})
			.addCase(getProfile.fulfilled, (state, { payload: { profile, user, session } }) => {
				state.profile = profile;
				state.user = user;
				state.session = session;
				state.isComplete = true;
			});
	},
});

export const { reset, setProfile, setSession } = slice.actions;
export const reducer = slice.reducer;
