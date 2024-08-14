import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Database } from '@/services/supabase';
import { supabase } from '@/services/supabaseClient';

type ColumnBase = Database['public']['Tables']['columns']['Row'];
type TodoBase = Database['public']['Tables']['todos']['Row'];
export interface Column extends ColumnBase {
	todos: TodoBase[];
}
interface InitialState {
	columns: Column[];
	todos: TodoBase[];
}

const initialState: InitialState = {
	columns: [],
	todos: [],
};

export const deleteColumnFromColumnId = createAsyncThunk(
	'@@/todos/deleteColumn',
	async (columnId: string, { rejectWithValue }) => {
		const { data, error } = await supabase.from('columns').delete().eq('id', columnId).select().single();
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

export const createColumnFromUserId = createAsyncThunk(
	'@@todos/createColumn',
	async (userId: string, { rejectWithValue }) => {
		const { data, error } = await supabase
			.from('columns')
			.insert([{ user_id: userId, title: 'Title' }])
			.select()
			.single();
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

export const getColumnsFromUserId = createAsyncThunk(
	'@@todo/getColumns',
	async (usedId: string, { rejectWithValue }) => {
		const { data, error } = await supabase.from('columns').select('*, todos ( * )').eq('user_id', usedId);
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

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
		builder
			.addCase(getTodosFromUserId.fulfilled, (state, { payload }) => {
				state.todos = payload;
			})
			.addCase(getColumnsFromUserId.fulfilled, (state, { payload }) => {
				state.columns = payload;
			})
			.addCase(createColumnFromUserId.fulfilled, (state, { payload }) => {
				state.columns.push({ ...payload, todos: [] });
			})
			.addCase(deleteColumnFromColumnId.fulfilled, (state, { payload }) => ({
				columns: state.columns.filter((column) => column.id !== payload.id),
				todos: state.todos.filter((todo) => todo.column_id !== payload.id),
			}));
	},
});

export const reducer = slice.reducer;
