"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Task } from "../types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Gera uma cor consistente a partir do nome
const stringToColor = (str: string = "Task") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "000000".substring(0, 6 - c.length) + c;
};

// Cria um container de portal no body
function useDndPortal() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const root = document.createElement("div");
    root.id = "dnd-portal";
    document.body.appendChild(root);
    setEl(root);
    return () => {
      document.body.removeChild(root);
    };
  }, []);
  return el;
}

type Props = {
  task: Task;
  index: number;
  onClick: () => void;
};

export default function TaskCard({ task, index, onClick }: Props) {
  const portalEl = useDndPortal();
  const color = stringToColor(task.type);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const card = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            // ESSENCIAL: aplicar o style gerado pelo DnD
            style={{
              ...provided.draggableProps.style,
              zIndex: snapshot.isDragging ? 1000 : "auto",
            }}
            onClick={onClick}
            className={`p-3 bg-white rounded-2xl shadow-sm cursor-pointer border border-gray-100 transition ${
              snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono font-bold text-gray-500">
                {task.code}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: color + "20", color }}
              >
                {task.type || "Task"}
              </span>
            </div>
            <span className="text-sm font-medium">{task.title}</span>
          </div>
        );

        // Quando estiver arrastando, renderiza no portal (fora de qualquer transform/filter)
        if (snapshot.isDragging && portalEl) {
          return createPortal(card, portalEl);
        }
        return card;
      }}
    </Draggable>
  );
}