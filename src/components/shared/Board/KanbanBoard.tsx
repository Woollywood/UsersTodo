import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ColumnContainer from './ColumnContainer';
import Todo from './Todo';
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

export type ID = string | number;
export type Column = {
	id: ID;
	title: string;
};
export type Todo = {
	id: ID;
	columnId: ID;
	content: string;
};

export default function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const columnsIds = useMemo(() => columns.map((col) => col.id), [columns]);

	const [todos, setTodos] = useState<Todo[]>([]);
	const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

	function generateID() {
		return Math.floor(Math.random() * 10001);
	}

	function onCreateColumn() {
		const columnToAdd: Column = {
			id: generateID(),
			title: `Column ${columns.length + 1}`,
		};
		setColumns([...columns, columnToAdd]);
	}

	function onDelete(column: Column) {
		setColumns([...columns.filter((col) => col.id !== column.id)]);
		setTodos(todos.filter((t) => t.columnId !== column.id));
	}

	function onUpdate(column: Column, title: string) {
		setColumns(
			columns.map((col) => {
				if (col.id !== column.id) {
					return col;
				}
				return { ...col, title };
			})
		);
	}

	function onCreateTodo(column: Column) {
		setTodos([...todos, { id: generateID(), columnId: column.id, content: `Todo Content ${todos.length}` }]);
	}

	function onDeleteTodo(id: Todo['id']) {
		setTodos([...todos.filter((todo) => todo.id !== id)]);
	}

	function onUpdateTodo(id: Todo['id'], value: string) {
		setTodos(todos.map((todo) => (todo.id === id ? { ...todo, content: value } : todo)));
	}

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

	return (
		<div className='m-auto flex w-full h-full overflow-x-auto overflow-y-hidden'>
			<div className='flex items-start gap-4'>
				<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
					<div className='flex gap-4 h-full'>
						<SortableContext items={columnsIds}>
							{columns.map((column) => (
								<ColumnContainer
									key={column.id}
									todos={todos.filter((todo) => todo.columnId === column.id)}
									column={column}
									onDelete={onDelete}
									onCreate={onCreateTodo}
									onUpdate={onUpdate}
									onDeleteTodo={onDeleteTodo}
									onUpdateTodo={onUpdateTodo}
								/>
							))}
						</SortableContext>
					</div>
					<div className='flex items-center justify-center h-[68px]'>
						<Button variant='contained' startIcon={<ControlPointIcon />} onClick={onCreateColumn}>
							Add Column
						</Button>
					</div>
					{createPortal(
						<DragOverlay>
							{activeColumn && (
								<ColumnContainer
									column={activeColumn}
									todos={todos.filter((todo) => todo.columnId === activeColumn.id)}
									onDelete={onDelete}
									onCreate={onCreateTodo}
									onUpdate={onUpdate}
									onDeleteTodo={onDeleteTodo}
									onUpdateTodo={onUpdateTodo}
								/>
							)}
							{activeTodo && (
								<Todo
									todo={activeTodo}
									onDelete={() => onDeleteTodo(activeTodo.id)}
									onUpdate={onUpdateTodo}
								/>
							)}
						</DragOverlay>,
						document.body
					)}
				</DndContext>
			</div>
		</div>
	);
}
