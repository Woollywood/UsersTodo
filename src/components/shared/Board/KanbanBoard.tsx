import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ColumnContainer from './ColumnContainer';
import Todo from './Todo';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useDragEnd, useDragOver, useDragStart, useKanbanColumns, useKanbanTodo } from './hooks';
import { useSnackbar } from 'notistack';

export type ID = number;
export type ColumnRequiredFields = {
	id: ID;
	title: string;
};
export type TodoRequiredFields = {
	id: ID;
	column_id: ID | null;
	content: string;
};

interface Props {
	columns: Required<ColumnRequiredFields[]>;
	todos: Required<TodoRequiredFields[]>;
	onCreateColumn: () => Promise<ColumnRequiredFields>;
	onDeleteColumn: (column: ColumnRequiredFields) => Promise<void>;
}

export default function KanbanBoard(props: Props) {
	const { enqueueSnackbar } = useSnackbar();

	const { columns, setColumns, activeColumn, setActiveColumn, columnsIds, onCreateColumn, onUpdateColumn } =
		useKanbanColumns(props.columns);
	const { todos, setTodos, activeTodo, setActiveTodo, onCreateTodo, onDeleteTodo, onUpdateTodo } = useKanbanTodo(
		props.todos
	);

	function onDeleteColumn(column: ColumnRequiredFields) {
		setColumns([...columns.filter((col) => col.id !== column.id)]);
		setTodos(todos.filter((t) => t.column_id !== column.id));
	}

	async function onDeleteColumnHandler(column: ColumnRequiredFields) {
		try {
			await props.onDeleteColumn(column);
			onDeleteColumn(column);
		} catch (error) {
			const errorMsg = (error as Error).message;
			enqueueSnackbar(errorMsg, { variant: 'error' });
		}
	}

	async function onCreateColumnHandler() {
		try {
			const payload = await props.onCreateColumn();
			onCreateColumn({ ...payload });
		} catch (error) {
			const errorMsg = (error as Error).message;
			enqueueSnackbar(errorMsg, { variant: 'error' });
		}
	}

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

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
									todos={todos.filter((todo) => todo.column_id === column.id)}
									column={column}
									onDeleteColumn={onDeleteColumnHandler}
									onUpdateColumn={onUpdateColumn}
									onCreateTodo={onCreateTodo}
									onDeleteTodo={onDeleteTodo}
									onUpdateTodo={onUpdateTodo}
								/>
							))}
						</SortableContext>
					</div>
					<div className='flex items-center justify-center h-[68px]'>
						<Button variant='contained' startIcon={<ControlPointIcon />} onClick={onCreateColumnHandler}>
							Add Column
						</Button>
					</div>
					{createPortal(
						<DragOverlay>
							{activeColumn && (
								<ColumnContainer
									column={activeColumn}
									todos={todos.filter((todo) => todo.column_id === activeColumn.id)}
									onDeleteColumn={onDeleteColumnHandler}
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
