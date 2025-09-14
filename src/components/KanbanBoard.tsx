"use client";
import { useState } from "react";
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

export default function KanbanBoard() {
  // Colunas iniciais
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", color: "#3b82f6" }, // azul
    { id: "in-progress", title: "In Progress", color: "#f59e0b" }, // amarelo
    { id: "done", title: "Done", color: "#10b981" }, // verde
  ]);

  // Tasks iniciais
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      code: "COMPANI-1",
      type: "Task",
      title: "Estudar Next.js",
      description: "Ler a [documentação oficial](https://nextjs.org).",
      status: "todo",
    },
    {
      id: "2",
      code: "COMPANI-2",
      type: "Feature",
      title: "Criar board Kanban",
      description: "Adicionar **drag and drop** e modal de criação.",
      status: "in-progress",
    },
    {
      id: "3",
      code: "COMPANI-3",
      type: "Bug",
      title: "Corrigir erro de build",
      description: "Ajustar imports relativos de `types`.",
      status: "done",
    },
  ]);

  // Controle de modais
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [selectedTask, setSelectedTask] = useState<(Task & { editing?: boolean }) | null>(null);

  // Tipos de tasks (usuário pode criar novos)
  const [taskTypes, setTaskTypes] = useState<string[]>([
    "Task",
    "Bug",
    "Feature",
    "Doc",
  ]);

  // Prefixo e contador para códigos estilo Jira
  const [taskCounter, setTaskCounter] = useState(4);
  const projectPrefix = "COMPANI";

  // Criar nova task
  const addTask = (title: string, description: string, type: string = "Task") => {
    const task: Task = {
      id: Date.now().toString(),
      code: `${projectPrefix}-${taskCounter}`,
      type: type || "Task",
      title,
      description,
      status: columns[0].id,
    };
    setTasks([...tasks, task]);
    setTaskCounter(taskCounter + 1);
  };

  // Criar nova coluna
  const addColumn = (title: string, color: string) => {
    const col: Column = {
      id: Date.now().toString(),
      title,
      color,
    };
    setColumns([...columns, col]);
  };

  // Atualizar task
  const updateTask = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...task } : t)));
  };

  // Excluir task
  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Excluir coluna (e todas as tasks dentro)
  const deleteColumn = (colId: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== colId));
    setTasks((prev) => prev.filter((t) => t.status !== colId));
  };

  // Função utilitária para reordenar listas
  const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handler do Drag & Drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "COLUMN") {
      const newColumns = reorder(columns, source.index, destination.index);
      setColumns(newColumns);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900 font-[system-ui] flex flex-col items-center p-10">
      {/* Título */}
      <h1 className="text-3xl font-semibold tracking-tight mb-10">
        Kanban Board
      </h1>

      {/* Botões de ação */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowCreateTask(true)}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:bg-blue-700 active:scale-95 transition"
        >
          Nova Tarefa
        </button>
        <button
          onClick={() => setShowCreateColumn(true)}
          className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-800 font-medium shadow-md hover:shadow-lg hover:bg-gray-200 active:scale-95 transition"
        >
          Nova Coluna
        </button>
      </div>

      {/* Board */}
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
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modais */}
      {showCreateTask && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onSave={addTask}
          taskTypes={taskTypes}
          setTaskTypes={setTaskTypes}
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