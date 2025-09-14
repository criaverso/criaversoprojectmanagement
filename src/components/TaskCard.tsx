import { Draggable } from "@hello-pangea/dnd";
import { Task } from ˜../types";

// Função simples para gerar cor a partir do nome
const stringToColor = (str: string = "Task") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "000000".substring(0, 6 - c.length) + c;
};

type Props = {
  task: Task;
  index: number;
  onClick: () => void;
};

export default function TaskCard({ task, index, onClick }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`p-3 bg-white rounded-2xl shadow-sm cursor-pointer border border-gray-100 transition ${
            snapshot.isDragging ? "shadow-lg scale-105" : "hover:shadow-md"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono font-bold text-gray-500">
              {task.code}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: stringToColor(task.type) + "20", color: stringToColor(task.type) }}
            >
              {task.type}
            </span>
          </div>
          <span className="text-sm font-medium">{task.title}</span>
        </div>
      )}
    </Draggable>
  );
}