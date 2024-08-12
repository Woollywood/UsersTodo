import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Database } from '@/services/supabase';
import { supabase } from '@/services/supabaseClient';

export interface InitialState {
	todos: Database['public']['Tables']['todos']['Row'][];
}

const initialState: InitialState = {
	todos: [],
};

export const getTodosFromUserId = createAsyncThunk('@@todo/get', async (userId: string, { rejectWithValue }) => {
	const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId);
	if (error) {
		return rejectWithValue(error.message);
	}
	return data;
});

export const slice = createSlice({
	name: 'todo',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getTodosFromUserId.fulfilled, (state, { payload }) => {
			state.todos = payload;
		});
	},
});

export const reducer = slice.reducer;
