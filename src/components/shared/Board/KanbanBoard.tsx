import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ColumnContainer from './ColumnContainer';
import Todo from './Todo';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useDragEnd, useDragOver, useDragStart, useKanbanColumns, useKanbanTodo } from './hooks';

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
	const { columns, setColumns, activeColumn, setActiveColumn, columnsIds, onCreateColumn, onUpdateColumn } =
		useKanbanColumns();
	const { todos, setTodos, activeTodo, setActiveTodo, onCreateTodo, onDeleteTodo, onUpdateTodo } = useKanbanTodo();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

	function onDeleteColumn(column: Column) {
		setColumns([...columns.filter((col) => col.id !== column.id)]);
		setTodos(todos.filter((t) => t.columnId !== column.id));
	}

	const onDragStart = useDragStart({ setActiveColumn, setActiveTodo });
	const onDragEnd = useDragEnd({ setActiveColumn, setActiveTodo, setColumns });
	const onDragOver = useDragOver({ setTodos });

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
									onDeleteColumn={onDeleteColumn}
									onUpdateColumn={onUpdateColumn}
									onCreateTodo={onCreateTodo}
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
									onDeleteColumn={onDeleteColumn}
									onUpdateColumn={onUpdateColumn}
									onCreateTodo={onCreateTodo}
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
