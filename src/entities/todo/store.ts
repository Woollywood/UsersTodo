import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { type Database } from '@/services/supabase';
import { supabase } from '@/services/supabaseClient';

export type Status = Database['public']['Enums']['TODO_STATUS'];
export type Column = Database['public']['Tables']['columns']['Row'];
export type Todo = Database['public']['Tables']['todos']['Row'];

interface InitialState {
	columns: Column[];
	todos: Todo[];
}

const initialState: InitialState = {
	columns: [],
	todos: [],
};

export const updateTodo = createAsyncThunk('@@todo/updateTodo', async (todo: Todo, { rejectWithValue }) => {
	const { data, error } = await supabase
		.from('todos')
		.update({ ...todo })
		.eq('id', todo.id)
		.select()
		.single();
	if (error) {
		return rejectWithValue(error.message);
	}
	return data;
});

export const deleteTodo = createAsyncThunk('@@todo/deleteTodo', async (todoId: number, { rejectWithValue }) => {
	const { data, error } = await supabase.from('todos').delete().eq('id', todoId).select().single();
	if (error) {
		return rejectWithValue(error.message);
	}
	return data;
});

export const createTodo = createAsyncThunk(
	'@@todo/createTodo',
	async ({ userId, columnId }: { userId: string; columnId: number }, { rejectWithValue }) => {
		const { data, error } = await supabase
			.from('todos')
			.insert([{ column_id: columnId, user_id: userId, status: 'TODO', content: 'Todo content' }])
			.select()
			.single();
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

export const updateColumnFromColumnId = createAsyncThunk(
	'@@todo/updateColumn',
	async (column: Column, { rejectWithValue }) => {
		const { data, error } = await supabase
			.from('columns')
			.update({ ...column })
			.eq('id', column.id)
			.select()
			.single();
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

export const deleteColumnFromColumnId = createAsyncThunk(
	'@@todo/deleteColumn',
	async (columnId: string, { rejectWithValue }) => {
		const { data, error } = await supabase.from('columns').delete().eq('id', columnId).select().single();
		if (error) {
			return rejectWithValue(error.message);
		}
		return data;
	}
);

export const createColumnFromUserId = createAsyncThunk(
	'@@todo/createColumn',
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
		const { data: columnsData, error: columnsError } = await supabase
			.from('columns')
			.select('*')
			.eq('user_id', usedId)
			.order('id');
		if (columnsError) {
			return rejectWithValue(columnsError.message);
		}

		const { data: todosData, error: todosError } = await supabase
			.from('todos')
			.select('*')
			.eq('user_id', usedId)
			.order('id');
		if (todosError) {
			return rejectWithValue(todosError.message);
		}

		return { columns: columnsData, todos: todosData };
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
				state.columns = payload.columns;
				state.todos = payload.todos;
			})
			.addCase(createColumnFromUserId.fulfilled, (state, { payload }) => {
				state.columns.push(payload);
			})
			.addCase(updateColumnFromColumnId.fulfilled, (state, { payload }) => ({
				columns: state.columns.map((column) => (column.id === payload.id ? payload : column)),
				todos: state.todos,
			}))
			.addCase(deleteColumnFromColumnId.fulfilled, (state, { payload }) => ({
				columns: state.columns.filter((column) => column.id !== payload.id),
				todos: state.todos.filter((todo) => todo.column_id !== payload.id),
			}))
			.addCase(createTodo.fulfilled, (state, { payload }) => {
				state.todos.push(payload);
			})
			.addCase(deleteTodo.fulfilled, (state, { payload }) => ({
				columns: state.columns,
				todos: state.todos.filter((todo) => todo.id !== payload.id),
			}))
			.addCase(updateTodo.fulfilled, (state, { payload }) => ({
				columns: state.columns,
				todos: state.todos.map((todo) => (todo.id === payload.id ? payload : todo)),
			}));
	},
});

export const reducer = slice.reducer;
