"use client";
import { Draggable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Task } from "../types";

function useDndPortal() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const root = document.createElement("div");
    root.id = "dnd-portal";
    document.body.appendChild(root);
    setEl(root);
    return () => { document.body.removeChild(root); };
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

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => {
        const node = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{ ...provided.draggableProps.style, zIndex: snapshot.isDragging ? 1000 : "auto" }}
            onClick={onClick}
            className={`p-3 bg-white rounded-2xl shadow-sm cursor-pointer border border-gray-100 transition ${
              snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono font-bold text-gray-500">
                {task.code}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100">
                {task.type}
              </span>
            </div>
            <span className="text-sm font-medium">{task.title}</span>
          </div>
        );
        if (snapshot.isDragging && portalEl) return createPortal(node, portalEl);
        return node;
      }}
    </Draggable>
  );
}