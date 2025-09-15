"use client";
import { Task } from "../types";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskModal({ task, onClose, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [type, setType] = useState(task.type);

  const save = () => {
    onSave({ ...task, title, description, type });
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onDoubleClick={() => setEditing(true)}
      >
        {/* 🔹 Barra estilo macOS */}
        <div className="relative flex items-center justify-center h-10 bg-gray-100 border-b">
          {/* botões à esquerda */}
          <div className="flex gap-2 absolute left-4">
            <button
              onClick={onClose}
              title="Fechar"
              className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-600 hover:bg-red-600"
            />
            <span className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-yellow-500" />
            <span className="w-3.5 h-3.5 bg-green-500 rounded-full border border-green-600" />
          </div>

          {/* código centralizado */}
          <h2 className="text-sm font-mono text-gray-700">{task.code}</h2>

          {/* lixeira à direita */}
          <button
            onClick={() => onDelete(task.id)}
            className="absolute right-4 text-gray-500 hover:text-red-600"
            title="Excluir Task"
          >
            🗑
          </button>
        </div>

        {/* 🔹 Conteúdo */}
        <div className="p-6">
          {editing ? (
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg p-2 text-lg font-medium"
              />
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full border rounded-lg p-2 font-mono text-sm"
              />
              <div className="text-right">
                <button
                  onClick={save}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{title}</h3>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {type}
              </span>
              <div className="prose-sm text-gray-800 max-w-none">
                <ReactMarkdown>{description || "_Sem descrição_"}</ReactMarkdown>
              </div>
              <p className="text-xs text-gray-400 text-right">
                (Dê dois cliques para editar)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}