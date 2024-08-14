import { useState, useMemo, SetStateAction } from 'react';
import { ColumnRequiredFields, TodoRequiredFields } from './KanbanBoard';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function useKanbanColumns(initialColumns: Required<ColumnRequiredFields[]>) {
	const [columns, setColumns] = useState<ColumnRequiredFields[]>(initialColumns);
	const [activeColumn, setActiveColumn] = useState<ColumnRequiredFields | null>(null);
	const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

	function onCreateColumn({ id, title }: { id: number; title: string }) {
		const columnToAdd: ColumnRequiredFields = {
			id,
			title,
		};
		setColumns([...columns, columnToAdd]);
	}

	function onUpdateColumn(column: ColumnRequiredFields, title: string) {
		setColumns(
			columns.map((col) => {
				if (col.id !== column.id) {
					return col;
				}
				return { ...col, title };
			})
		);
	}

	return { columns, setColumns, activeColumn, setActiveColumn, columnsIds, onCreateColumn, onUpdateColumn };
}

export function useKanbanTodo(initialTodos: Required<TodoRequiredFields[]>) {
	const [todos, setTodos] = useState<TodoRequiredFields[]>(initialTodos);
	const [activeTodo, setActiveTodo] = useState<TodoRequiredFields | null>(null);

	function onCreateTodo({ columnId, todo }: { columnId: number; todo: TodoRequiredFields }) {
		setTodos([...todos, { ...todo, column_id: columnId }]);
	}

	function onDeleteTodo(id: TodoRequiredFields['id']) {
		setTodos([...todos.filter((todo) => todo.id !== id)]);
	}

	function onUpdateTodo(id: TodoRequiredFields['id'], value: string) {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, content: value } : todo)));
	}

	return { todos, setTodos, activeTodo, setActiveTodo, onCreateTodo, onDeleteTodo, onUpdateTodo };
}

export function useDragStart({
	setActiveColumn,
	setActiveTodo,
}: {
	setActiveColumn: (value: SetStateAction<ColumnRequiredFields | null>) => void;
	setActiveTodo: (value: React.SetStateAction<TodoRequiredFields | null>) => void;
}) {
	function onDragStart(event: DragStartEvent) {
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column);
			return;
		}

		if (event.active.data.current?.type === 'Todo') {
			setActiveTodo(event.active.data.current.todo);
			return;
		}
	}

	return onDragStart;
}

export function useDragEnd({
	setActiveColumn,
	setActiveTodo,
	setColumns,
}: {
	setActiveColumn: (value: React.SetStateAction<ColumnRequiredFields | null>) => void;
	setActiveTodo: (value: React.SetStateAction<TodoRequiredFields | null>) => void;
	setColumns: (value: React.SetStateAction<ColumnRequiredFields[]>) => void;
}) {
	function onDragEnd({ active, over }: DragEndEvent) {
		setActiveColumn(null);
		setActiveTodo(null);

		if (!over) {
			return;
		}

		const activeColumnId = active.id;
		const overColumnId = over.id;

		if (activeColumnId === overColumnId) {
			return;
		}

		setColumns((columns) => {
			const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
			const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

			return arrayMove(columns, activeColumnIndex, overColumnIndex);
		});
	}

	return onDragEnd;
}

export function useDragOver({ setTodos }: { setTodos: (value: React.SetStateAction<TodoRequiredFields[]>) => void }) {
	function onDragOver({ active, over }: DragOverEvent) {
		if (!over) {
			return;
		}

		const activeTodoId = active.id;
		const overTodoId = over.id;

		if (activeTodoId === overTodoId) {
			return;
		}

		const isActiveTodo = active.data.current?.type === 'Todo';
		const isOverTodo = over.data.current?.type === 'Todo';

		if (!isActiveTodo) {
			return;
		}

		if (isActiveTodo && isOverTodo) {
			setTodos((todos) => {
				const activeIndex = todos.findIndex((t) => t.id === activeTodoId);
				const overIndex = todos.findIndex((t) => t.id === overTodoId);
				todos[activeIndex].column_id = todos[overIndex].column_id;
				return arrayMove(todos, activeIndex, overIndex);
			});
		}

		const isOverAColumn = over.data.current?.type === 'Column';

		if (isActiveTodo && isOverAColumn) {
			setTodos((todos) => {
				const activeIndex = todos.findIndex((t) => t.id === activeTodoId);
				todos[activeIndex].column_id = overTodoId as number;
				return arrayMove(todos, activeIndex, activeIndex);
			});
		}
	}

	return onDragOver;
}

export function useColumn(column: ColumnRequiredFields, todos: TodoRequiredFields[]) {
	const [editMode, setEditMode] = useState(false);
	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id: column.id,
		data: {
			type: 'Column',
			column,
		},
		disabled: editMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const todosIds = useMemo(() => todos.map((todo) => todo.id), [todos]);

	function onSubmit() {
		setEditMode(false);
	}

	return { editMode, setEditMode, setNodeRef, attributes, listeners, isDragging, style, todosIds, onSubmit };
}

export function useTodo(todo: TodoRequiredFields) {
	const { id } = todo;
	const [isMouseOver, setMouseOver] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
		id,
		data: {
			type: 'Todo',
			todo,
		},
		disabled: editMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	function toggleEditMode() {
		setEditMode((prev) => !prev);
		setMouseOver(false);
	}

	function onSubmit() {
		toggleEditMode();
	}

	return {
		editMode,
		toggleEditMode,
		isMouseOver,
		setMouseOver,
		setNodeRef,
		attributes,
		listeners,
		isDragging,
		style,
		onSubmit,
	};
}
