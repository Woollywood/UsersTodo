import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ColumnContainer from './ColumnContainer';
import {
	DndContext,
	DragEndEvent,
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
export type Task = {
	id: ID;
	columnID: ID;
	content: string;
};

export default function KanbanBoard() {
	const [columns, setColumns] = useState<Column[]>([]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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

	function onCreate() {
		const columnToAdd: Column = {
			id: generateID(),
			title: `Column ${columns.length + 1}`,
		};
		setColumns([...columns, columnToAdd]);
	}

	function onDelete(column: Column) {
		setColumns([...columns.filter((col) => col.id !== column.id)]);
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

	function onDragStart(event: DragStartEvent) {
		console.log(event);
		if (event.active.data.current?.type === 'Column') {
			setActiveColumn(event.active.data.current.column);
			return;
		}
	}

	function onDragEnd({ active, over }: DragEndEvent) {
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

	return (
		<div className='m-auto flex w-full h-full overflow-x-auto overflow-y-hidden'>
			<div className='flex items-start gap-4'>
				<DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
					<div className='flex gap-4 h-full'>
						<SortableContext items={columnsId}>
							{columns.map((column) => (
								<ColumnContainer
									key={column.id}
									column={column}
									onDelete={onDelete}
									onUpdate={onUpdate}
								/>
							))}
						</SortableContext>
					</div>
					<div className='flex items-center justify-center h-[68px]'>
						<Button variant='contained' startIcon={<ControlPointIcon />} onClick={onCreate}>
							Add Column
						</Button>
					</div>
					{createPortal(
						<DragOverlay>
							{activeColumn && (
								<ColumnContainer column={activeColumn} onDelete={onDelete} onUpdate={onUpdate} />
							)}
						</DragOverlay>,
						document.body
					)}
				</DndContext>
			</div>
		</div>
	);
}
