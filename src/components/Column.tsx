"use client";
import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Column, Task } from "../types";
import TaskCard from "./TaskCard";

type Props = {
  col: Column;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onDeleteColumn: (id: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onAddTask: () => void;
};

export default function ColumnComponent({
  col,
  tasks,
  onSelectTask,
  onDeleteColumn,
  dragHandleProps,
  onAddTask,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 min-w-[250px] flex flex-col">
      <div
        className="flex justify-between items-center px-4 py-2 rounded-t-3xl"
        style={{ backgroundColor: col.color }}
        {...(dragHandleProps ?? {})}
      >
        <h2 className="text-lg font-medium text-white">{col.title}</h2>
        <button
          onClick={() => onDeleteColumn(col.id)}
          className="text-white hover:text-gray-200 font-bold"
          title="Excluir coluna"
        >
          ×
        </button>
      </div>

      <Droppable droppableId={col.id} type="TASK">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-4 space-y-3"
          >
            {tasks.map((task, index) => (
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

      <button
        onClick={onAddTask}
        className="m-3 px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        + Nova Task
      </button>
    </div>
  );
}