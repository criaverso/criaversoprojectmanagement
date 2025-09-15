"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { Task, Column } from "../types";
import ColumnComponent from "./Column";
import TaskModal from "./TaskModal";
import CreateTaskModal from "./CreateTaskModal";
import CreateColumnModal from "./CreateColumnModal";
import TaskTypesModal from "./TaskTypesModal"; 

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTypes, setTaskTypes] = useState<string[]>([
    "Task",
    "Bug",
    "Feature",
    "Doc",
  ]);
  const [taskCounter, setTaskCounter] = useState(1);
  const projectPrefix = "COMPANI";

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState<string | null>(null);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [showTaskTypes, setShowTaskTypes] = useState(false);
  // ---------- Persistência ----------
  useEffect(() => {
    const saved = localStorage.getItem("kanban-data");
    if (saved) {
      const { columns, tasks, taskTypes, taskCounter } = JSON.parse(saved);
      setColumns(columns);
      setTasks(tasks);
      setTaskTypes(taskTypes);
      setTaskCounter(taskCounter);
    } else {
      setColumns([
        { id: "todo", title: "To Do", color: "#3b82f6" },
        { id: "in-progress", title: "In Progress", color: "#f59e0b" },
        { id: "done", title: "Done", color: "#10b981" },
      ]);
    }
  }, []);

  useEffect(() => {
    const data = { columns, tasks, taskTypes, taskCounter };
    localStorage.setItem("kanban-data", JSON.stringify(data));
  }, [columns, tasks, taskTypes, taskCounter]);

  // ---------- CRUD ----------
  const addTask = (title: string, description: string, type: string = "Task") => {
    if (!newTaskColumnId) return;
    const task: Task = {
      id: Date.now().toString(),
      code: `${projectPrefix}-${taskCounter}`,
      type,
      title,
      description,
      status: newTaskColumnId,
    };
    setTasks([...tasks, task]);
    setTaskCounter(taskCounter + 1);
    setNewTaskColumnId(null);
  };

  const addColumn = (title: string, color: string) => {
    setColumns([...columns, { id: Date.now().toString(), title, color }]);
  };

  const updateTask = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const deleteColumn = (colId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== colId));
    setTasks((prev) => prev.filter((t) => t.status !== colId));
  };

  // ---------- Drag & Drop ----------
  const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (type === "COLUMN") {
      setColumns(reorder(columns, source.index, destination.index));
      return;
    }

    if (type === "TASK") {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggableId ? { ...t, status: destination.droppableId } : t
        )
      );
    }
  };

  // ---------- Exportar / Importar ----------
  const exportData = () => {
    const data = { columns, tasks, taskTypes, taskCounter };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setColumns(data.columns || []);
        setTasks(data.tasks || []);
        setTaskTypes(data.taskTypes || []);
        setTaskCounter(data.taskCounter || 1);
      } catch {
        alert("Arquivo inválido");
      }
    };
    reader.readAsText(file);
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 font-[system-ui] flex flex-col">
      {/* AppBar */}
      <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex items-center justify-between px-6 py-3">
  <h1 className="text-xl font-semibold tracking-tight">Kanban Board</h1>

  <nav className="flex gap-6 text-sm font-medium relative">
    {/* Menu Arquivo */}
    <div className="relative group">
      <button className="px-2 py-1 rounded-md hover:bg-gray-100">Arquivo ▾</button>
      <div className="absolute hidden group-hover:flex flex-col mt-1 w-40 bg-white shadow-lg border rounded-md z-20">
        <button
          onClick={exportData}
          className="px-4 py-2 text-left hover:bg-gray-100"
        >
          Exportar
        </button>
        <label className="px-4 py-2 text-left hover:bg-gray-100 cursor-pointer">
          Importar
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importData}
          />
        </label>
      </div>
    </div>

    {/* Menu Editar */}
    <div className="relative group">
      <button className="px-2 py-1 rounded-md hover:bg-gray-100">Editar ▾</button>
      <div className="absolute hidden group-hover:flex flex-col mt-1 w-44 bg-white shadow-lg border rounded-md z-20">
        <button
          onClick={() => setShowTaskTypes(true)}
          className="px-4 py-2 text-left hover:bg-gray-100"
        >
          Tipos de Tasks
        </button>
      </div>
    </div>
  </nav>
</header>

      {/* Conteúdo do board */}
      <main className="flex-1 flex flex-col items-center p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex w-full max-w-6xl gap-6 overflow-x-auto pb-4"
              >
                {columns.map((col, index) => (
                  <Draggable draggableId={col.id} index={index} key={col.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex flex-col"
                      >
                        <ColumnComponent
                          col={col}
                          tasks={tasks.filter((t) => t.status === col.id)}
                          onSelectTask={setSelectedTask}
                          onDeleteColumn={deleteColumn}
                          dragHandleProps={provided.dragHandleProps}
                          onAddTask={() => {
                            setNewTaskColumnId(col.id);
                            setShowCreateTask(true);
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* Slot para nova coluna */}
                <div className="min-w-[250px] flex items-center justify-center">
                  <button
                    onClick={() => setShowCreateColumn(true)}
                    className="w-full h-full px-6 py-10 rounded-3xl bg-gray-100 text-gray-600 font-medium shadow-sm hover:shadow-md hover:bg-gray-200 active:scale-95 transition"
                  >
                    + Nova Coluna
                  </button>
                </div>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Modais */}
      {showCreateTask && newTaskColumnId && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onSave={addTask}
          taskTypes={taskTypes}
          setTaskTypes={setTaskTypes}
        />
      )}

      {showTaskTypes && (
  <TaskTypesModal
    taskTypes={taskTypes}
    setTaskTypes={setTaskTypes}
    onClose={() => setShowTaskTypes(false)}
  />
)}

      {showCreateColumn && (
        <CreateColumnModal
          onClose={() => setShowCreateColumn(false)}
          onSave={addColumn}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}