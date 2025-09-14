import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Column, Task } from "../types";
import TaskCard from "./TaskCard";

type Props = {
  col: Column;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onDeleteColumn: (id: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
};

export default function ColumnComponent({
  col,
  tasks,
  onSelectTask,
  onDeleteColumn,
  dragHandleProps,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 min-w-[250px] flex flex-col">
      {/* Cabeçalho com cor */}
      <div
        className="flex justify-between items-center px-4 py-2 rounded-t-3xl"
        style={{ backgroundColor: col.color }}
        {...dragHandleProps}
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

      {/* Área de tasks */}
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
    </div>
  );
}