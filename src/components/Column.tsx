"use client";
import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Column, Task } from "../types";
import TaskCard from "./TaskCard";

type Props = {
  col: Column;
  onSelectTask: (task: Task) => void;
  onDeleteColumn: (id: string) => void;
  onAddTask: (colId: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
};

export default function ColumnComponent({
  col,
  onSelectTask,
  onDeleteColumn,
  onAddTask,
  dragHandleProps,
}: Props) {
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-md w-64">
      {/* header */}
      <div
        className="rounded-t-2xl px-4 py-2 text-white font-semibold flex justify-between items-center"
        style={{ backgroundColor: col.color }}
        {...(dragHandleProps ?? {})}
      >
        <span>{col.title}</span>
        <button onClick={() => onDeleteColumn(col.id)} className="font-bold">
          ×
        </button>
      </div>

      {/* droppable area */}
      <Droppable droppableId={col.id} type="TASK">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-4 space-y-3"
          >
            {(col.tasks ?? []).map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={() => onSelectTask(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* add task */}
      <button
        onClick={() => onAddTask(col.id)}
        className="m-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100"
      >
        + Nova Task
      </button>
    </div>
  );
}