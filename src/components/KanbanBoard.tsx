"use client";

import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useSearchParams, useRouter } from "next/navigation";
import TopBar from "./TopBar";
import ColumnComponent from "./Column";
import CreateColumnModal from "./CreateColumnModal";
import CreateTaskModal from "./CreateTaskModal";
import TaskModal from "./TaskModal";
import TaskTypesModal from "./TaskTypesModal";
import { Column, Task } from "../types";

const STORAGE_KEY = "kanban-data-v2";
const PROJECT_PREFIX = "COMPANI";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [types, setTypes] = useState<string[]>(["Task", "Bug", "Feature"]);
  const [counter, setCounter] = useState(1); // para o code COMPANI-X

  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showCreateTaskFor, setShowCreateTaskFor] = useState<string | null>(null);
  const [showTypes, setShowTypes] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ---- load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setColumns((data.columns ?? []).map((c: any) => ({ ...c, tasks: c.tasks ?? [] })));
      setTypes(data.types ?? ["Task", "Bug", "Feature"]);
      setCounter(data.counter ?? 1);
    } else {
      setColumns([
        { id: "todo", title: "To Do", color: "#3b82f6", tasks: [] },
        { id: "in-progress", title: "In Progress", color: "#f59e0b", tasks: [] },
        { id: "done", title: "Done", color: "#10b981", tasks: [] },
      ]);
    }
  }, []);

  // ---- persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ columns, types, counter })
    );
  }, [columns, types, counter]);

  // ---- URL -> modal
  useEffect(() => {
    const code = searchParams.get("task"); // ex: COMPANI-3
    if (!code) return setSelectedTask(null);
    const t = columns.flatMap(c => c.tasks).find(tk => tk.code === code);
    if (t) setSelectedTask(t);
  }, [searchParams, columns]);

  const openTaskByClick = (task: Task) => {
    router.push(`?task=${task.code}`);
  };
  const closeTaskModal = () => {
    router.push(``);
    setSelectedTask(null);
  };

  // ---- CRUD col
  const addColumn = (title: string, color: string) => {
    setColumns(prev => [...prev, { id: Date.now().toString(), title, color, tasks: [] }]);
  };
  const deleteColumn = (id: string) => {
    setColumns(prev => prev.filter(c => c.id !== id));
  };

  // ---- CRUD task
  const addTask = (columnId: string, title: string, description: string, type: string) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: [
                ...(col.tasks ?? []),
                {
                  id: Date.now().toString(),
                  code: `${PROJECT_PREFIX}-${counter}`,
                  title,
                  description,
                  type,
                },
              ],
            }
          : col
      )
    );
    setCounter(c => c + 1);
  };

  const updateTask = (task: Task) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: (col.tasks ?? []).map(t => (t.id === task.id ? task : t)),
      }))
    );
  };

  const deleteTask = (id: string) => {
    setColumns(prev =>
      prev.map(col => ({ ...col, tasks: (col.tasks ?? []).filter(t => t.id !== id) }))
    );
    closeTaskModal();
  };

  // ---- DnD
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      const next = Array.from(columns);
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);
      setColumns(next);
      return;
    }

    // TASK
    const sourceCol = columns.find(c => c.id === source.droppableId)!;
    const destCol = columns.find(c => c.id === destination.droppableId)!;

    const sourceTasks = Array.from(sourceCol.tasks ?? []);
    const [moved] = sourceTasks.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      sourceTasks.splice(destination.index, 0, moved);
      setColumns(prev =>
        prev.map(c => (c.id === sourceCol.id ? { ...c, tasks: sourceTasks } : c))
      );
    } else {
      const destTasks = Array.from(destCol.tasks ?? []);
      destTasks.splice(destination.index, 0, moved);
      setColumns(prev =>
        prev.map(c => {
          if (c.id === sourceCol.id) return { ...c, tasks: sourceTasks };
          if (c.id === destCol.id) return { ...c, tasks: destTasks };
          return c;
        })
      );
    }
  };

  // ---- Export/Import
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ columns, types, counter }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kanban-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const data = JSON.parse((e.target?.result as string) ?? "{}");
        setColumns((data.columns ?? []).map((c: any) => ({ ...c, tasks: c.tasks ?? [] })));
        setTypes(data.types ?? ["Task", "Bug", "Feature"]);
        setCounter(data.counter ?? 1);
      } catch {
        alert("Arquivo inválido");
      }
    };
    r.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <TopBar
        onExport={exportData}
        onImport={importData}
        onOpenTaskTypes={() => setShowTypes(true)}
      />

      <main className="mx-auto max-w-6xl p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-6 items-start overflow-x-auto pb-4"
              >
                {columns.map((col, index) => (
                  <Draggable key={col.id} draggableId={col.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex flex-col"
                      >
                        <ColumnComponent
                          col={col}
                          onSelectTask={openTaskByClick}
                          onDeleteColumn={deleteColumn}
                          onAddTask={(id) => setShowCreateTaskFor(id)}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* “coluna” para criar nova */}
                <button
                  onClick={() => setShowCreateColumn(true)}
                  className="min-w-[256px] h-[72px] self-start px-6 py-4 rounded-2xl bg-gray-100 text-gray-700 border border-dashed border-gray-300 hover:bg-gray-200 shadow-sm"
                >
                  + Nova Coluna
                </button>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Modais */}
      {showCreateColumn && (
        <CreateColumnModal
          onClose={() => setShowCreateColumn(false)}
          onSave={addColumn}
        />
      )}

      {showCreateTaskFor && (
        <CreateTaskModal
          onClose={() => setShowCreateTaskFor(null)}
          onSave={(t, d, ty) => addTask(showCreateTaskFor, t, d, ty)}
          taskTypes={types}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeTaskModal}
          onSave={updateTask}
          onDelete={deleteTask}
        />
      )}

      {showTypes && (
        <TaskTypesModal
          taskTypes={types}
          setTaskTypes={setTypes}
          onClose={() => setShowTypes(false)}
        />
      )}
    </div>
  );
}