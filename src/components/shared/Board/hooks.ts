import { useState, useMemo, SetStateAction } from 'react';
import { Column, Todo } from './KanbanBoard';
import { generateID } from './utils';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function useKanbanColumns() {
	const [columns, setColumns] = useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

	function onCreateColumn() {
		const columnToAdd: Column = {
			id: generateID(),
			title: `Column ${columns.length + 1}`,
		};
		setColumns([...columns, columnToAdd]);
	}

	function onUpdateColumn(column: Column, title: string) {
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

export function useKanbanTodo() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

	function onCreateTodo(column: Column) {
		setTodos([...todos, { id: generateID(), columnId: column.id, content: `Todo Content ${todos.length}` }]);
	}

	function onDeleteTodo(id: Todo['id']) {
		setTodos([...todos.filter((todo) => todo.id !== id)]);
	}

	function onUpdateTodo(id: Todo['id'], value: string) {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, content: value } : todo)));
	}

	return { todos, setTodos, activeTodo, setActiveTodo, onCreateTodo, onDeleteTodo, onUpdateTodo };
}

export function useDragStart({
	setActiveColumn,
	setActiveTodo,
}: {
	setActiveColumn: (value: SetStateAction<Column | null>) => void;
	setActiveTodo: (value: React.SetStateAction<Todo | null>) => void;
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
	setActiveColumn: (value: React.SetStateAction<Column | null>) => void;
	setActiveTodo: (value: React.SetStateAction<Todo | null>) => void;
	setColumns: (value: React.SetStateAction<Column[]>) => void;
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

export function useDragOver({ setTodos }: { setTodos: (value: React.SetStateAction<Todo[]>) => void }) {
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
				todos[activeIndex].columnId = todos[overIndex].columnId;
				return arrayMove(todos, activeIndex, overIndex);
			});
		}

		const isOverAColumn = over.data.current?.type === 'Column';

		if (isActiveTodo && isOverAColumn) {
			setTodos((todos) => {
				const activeIndex = todos.findIndex((t) => t.id === activeTodoId);
				todos[activeIndex].columnId = overTodoId;
				return arrayMove(todos, activeIndex, activeIndex);
			});
		}
	}

	return onDragOver;
}
