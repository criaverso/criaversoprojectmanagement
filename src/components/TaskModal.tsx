"use client";
import { Task } from "../types";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

type Props = {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskModal({ task, onClose, onSave, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [type, setType] = useState(task.type);

  const handleSave = () => {
    onSave({ ...task, title, description, type });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onDoubleClick={() => setIsEditing(true)} // 👉 Duplo clique ativa edição
      >
       {/* Barra superior estilo macOS */}
<div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b relative">
  {/* Botões do macOS à esquerda */}
  <div className="flex gap-2 absolute left-4">
    <button
      onClick={onClose}
      className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-600 hover:bg-red-600"
      title="Fechar"
    />
    <span className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-500" />
    <span className="w-3.5 h-3.5 bg-green-500 rounded-full border border-green-600" />
  </div>

  {/* Código da task centralizado */}
  <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-mono text-gray-700">
    {task.code}
  </h2>

  {/* Ícone de lixeira à direita */}
  <button
    onClick={() => onDelete(task.id)}
    className="absolute right-4 text-gray-500 hover:text-red-600"
    title="Excluir Task"
  >
    🗑
  </button>
</div>

        {/* Conteúdo */}
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-2 text-lg font-medium"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border rounded-lg p-2 font-mono text-sm"
              />
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-lg p-2 font-medium"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
  <h3 className="text-lg font-semibold mb-4">{task.title}</h3>

  {/* Badge do tipo com espaçamento elegante */}
  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6">
    {task.type}
  </span>

  <div className="prose-sm text-gray-800 max-w-none">
  <ReactMarkdown components={{}}>
    {task.description}
  </ReactMarkdown>
</div>
</div>
          )}
        </div>
      </div>
    </div>
  );
}